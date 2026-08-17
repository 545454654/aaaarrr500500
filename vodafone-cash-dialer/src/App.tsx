/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Keypad } from './components/Keypad';
import { RecentCalls } from './components/RecentCalls';
import { ContactsList } from './components/ContactsList';
import { BottomNav } from './components/BottomNav';
import { USSDModal } from './components/USSDModal';
import { SMSNotification, SMSInboxModal } from './components/SMSNotification';
import { WalletInfoModal } from './components/WalletInfoModal';
import { QuickHelpModal } from './components/QuickHelpModal';
import { CallDetailModal } from './components/CallDetailModal';
import { CallScreen } from './components/CallScreen';
import {
  INITIAL_CONTACTS,
  INITIAL_CALL_LOGS,
  INITIAL_TRANSACTIONS,
  INITIAL_SMS_MESSAGES,
} from './data/mockData';
import { Contact, CallLog, Transaction, SMSMessage, USSDState } from './types';
import { playSuccessTone, playNotificationChime, playDTMFTone } from './utils/audio';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'recents' | 'contacts'>('recents');
  const [recentsFilter, setRecentsFilter] = useState<'all' | 'missed'>('all');
  const [showKeypad, setShowKeypad] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Dialpad input (e.g. "+20 10 10375025" or "*9*7*01010375025*100#")
  const [dialInput, setDialInput] = useState<string>('+20 10 10375025');

  // Wallet & User Settings State (with LocalStorage fallback)
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('vf_balance');
    if (!saved || saved === '5000' || saved === '5000.0' || saved === '5000.00') {
      return 23467.0;
    }
    return parseFloat(saved);
  });
  const [pin, setPin] = useState<string>(() => {
    const saved = localStorage.getItem('vf_pin');
    if (!saved || saved === '123456') {
      return '500500';
    }
    return saved;
  });

  // App Data State
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('vf_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });
  const [callLogs, setCallLogs] = useState<CallLog[]>(() => {
    const saved = localStorage.getItem('vf_calls');
    return saved ? JSON.parse(saved) : INITIAL_CALL_LOGS;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('vf_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [smsMessages, setSmsMessages] = useState<SMSMessage[]>(() => {
    const saved = localStorage.getItem('vf_sms');
    return saved ? JSON.parse(saved) : INITIAL_SMS_MESSAGES;
  });

  // Active overlays and modals
  const [activeNotification, setActiveNotification] = useState<SMSMessage | null>(null);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showSMSInboxModal, setShowSMSInboxModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [selectedCallDetail, setSelectedCallDetail] = useState<CallLog | null>(null);
  const [activeVoiceCall, setActiveVoiceCall] = useState<{
    phoneNumber: string;
    contactName?: string;
  } | null>(null);

  // USSD Engine State
  const [ussdState, setUssdState] = useState<USSDState>({
    isOpen: false,
    status: 'dialing',
    message: '',
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('vf_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('vf_pin', pin);
  }, [pin]);

  useEffect(() => {
    localStorage.setItem('vf_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('vf_calls', JSON.stringify(callLogs));
  }, [callLogs]);

  useEffect(() => {
    localStorage.setItem('vf_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('vf_sms', JSON.stringify(smsMessages));
  }, [smsMessages]);

  // Handle keypad number clicks
  const handleKeypadPress = (char: string) => {
    setDialInput((prev) => prev + char);
  };

  const handleKeypadDelete = () => {
    setDialInput((prev) => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setDialInput('');
  };

  // Find contact name for a given phone number
  const findContactName = (phone: string): string | undefined => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    const found = contacts.find(
      (c) => c.phone.replace(/[^0-9]/g, '') === cleaned || cleaned.endsWith(c.phone)
    );
    return found ? found.name : undefined;
  };

  // Trigger Vodafone Cash Transfer Completion
  const executeTransfer = (recipientNumber: string, transferAmount: number) => {
    const fee = 1.0;
    const totalDeduction = transferAmount + fee;

    if (balance < totalDeduction) {
      setUssdState({
        isOpen: true,
        status: 'error',
        message: `عفواً، رصيد محفظتك (${balance.toFixed(
          2
        )} ج.م) غير كافٍ لإتمام تحويل مبلغ ${transferAmount.toFixed(
          2
        )} ج.م بالإضافة لمصاريف الخدمة (1.00 ج.م).`,
      });
      return;
    }

    const newBalance = balance - totalDeduction;
    setBalance(newBalance);

    const refCode = `VF${Math.floor(10000000 + Math.random() * 90000000)}`;
    const recipientName = findContactName(recipientNumber) || recipientNumber;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const dateFormatted = `${now.getDate()}/${now.getMonth() + 1}`;

    // Add Transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'transfer_out',
      amount: transferAmount,
      recipientNumber,
      recipientName,
      fee,
      timestamp: `${dateFormatted} ${timeFormatted}`,
      referenceCode: refCode,
      balanceAfter: newBalance,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Add SMS Message
    const newSms: SMSMessage = {
      id: `sms-${Date.now()}`,
      sender: 'VF-Cash',
      body: `تم تحويل مبلغ ${transferAmount.toFixed(
        2
      )} ج.م بنجاح إلى رقم ${recipientNumber}. مصاريف الخدمة ${fee.toFixed(
        2
      )} ج.م. رصيدك المتبقي الحالي هو ${newBalance.toFixed(
        2
      )} ج.م. كود المعاملة: ${refCode}.`,
      timestamp: `اليوم ${timeFormatted}`,
      read: false,
      transactionRef: refCode,
    };
    setSmsMessages((prev) => [newSms, ...prev]);

    // Add to Call Logs
    const newCall: CallLog = {
      id: `log-${Date.now()}`,
      contactName: `فودافون كاش (${recipientName})`,
      phoneNumber: `*9*7*${recipientNumber}*${transferAmount}#`,
      type: 'outgoing',
      timestamp: dateFormatted,
      isVodafoneCash: true,
    };
    setCallLogs((prev) => [newCall, ...prev]);

    // Sound & Notification
    playSuccessTone();
    setTimeout(() => {
      playNotificationChime();
      setActiveNotification(newSms);
    }, 600);

    // USSD Success Dialog
    setUssdState({
      isOpen: true,
      status: 'message',
      title: 'فودافون كاش - نجاح التحويل',
      message: `تم تحويل مبلغ ${transferAmount.toFixed(
        2
      )} ج.م بنجاح إلى الرقم ${recipientNumber} (${recipientName}).\n\nمصاريف الخدمة: 1.00 ج.م\nالرصيد المتبقي: ${newBalance.toFixed(
        2
      )} ج.م\nكود المعاملة: ${refCode}\n\nتم إرسال رسالة تأكيد SMS.`,
    });
  };

  // Main Call / USSD Trigger function
  const handleMakeCall = (overrideInput?: string) => {
    const rawInput = (overrideInput || dialInput).trim();
    if (!rawInput) {
      // Like a real phone dialer: if empty, pressing call button recalls the last called number
      if (callLogs.length > 0) {
        setDialInput(callLogs[0].phoneNumber);
      }
      return;
    }

    // 1. Check if input is a USSD Code (Starts with * and ends with #)
    if (rawInput.startsWith('*') && rawInput.endsWith('#')) {
      const code = rawInput;

      // Check for Direct Transfer Syntax: *9*7*NUMBER*AMOUNT#
      // e.g. *9*7*01010375025*100# or *9*7*01098688815*500#
      const directTransferRegex = /^\*9\*7\*([0-9\+]+)\*([0-9\.]+)#$/;
      const directMatch = code.match(directTransferRegex);

      if (directMatch) {
        const recipient = directMatch[1];
        const amount = parseFloat(directMatch[2]);

        if (isNaN(amount) || amount <= 0) {
          setUssdState({
            isOpen: true,
            status: 'error',
            message: 'المبلغ المدخل غير صالح. برجاء كتابة مبلغ صحيح أكبر من 0.',
          });
          return;
        }

        // 1. Show dialing / running USSD animation
        setUssdState({
          isOpen: true,
          status: 'dialing',
          message: code,
        });

        // 2. Prompt for PIN after realistic delay
        setTimeout(() => {
          const contactName = findContactName(recipient);
          const nameDisplay = contactName ? ` (${contactName})` : '';

          setUssdState({
            isOpen: true,
            status: 'prompt',
            title: 'فودافون كاش - تأكيد التحويل',
            message: `تحويل مبلغ ${amount.toFixed(
              2
            )} ج.م إلى رقم ${recipient}${nameDisplay}؟\nمصاريف الخدمة: 1.00 ج.م.\n\nبرجاء إدخال الرقم السري (PIN) لتأكيد التحويل:`,
            showInput: true,
            inputType: 'pin',
            step: 'direct_transfer_pin',
            contextData: {
              recipient,
              amount,
            },
          });
        }, 1100);

        return;
      }

      // Check for Interactive Menu: *9#
      if (code === '*9#') {
        setUssdState({
          isOpen: true,
          status: 'dialing',
          message: code,
        });

        setTimeout(() => {
          setUssdState({
            isOpen: true,
            status: 'prompt',
            title: 'فودافون كاش - القائمة الرئيسية',
            message:
              '1. تحويل أموال\n2. شحن ودفع فاتورة\n3. كارت الشراء أونلاين (VCN)\n4. السحب من ATM\n5. الاستعلام عن الرصيد\n6. المزيد من الخدمات',
            showInput: true,
            inputType: 'number',
            placeholder: 'اختر رقم الخدمة (1-6)',
            step: 'main_menu',
          });
        }, 1100);

        return;
      }

      // Check for Balance Check: *9*13#
      if (code === '*9*13#') {
        setUssdState({
          isOpen: true,
          status: 'dialing',
          message: code,
        });

        setTimeout(() => {
          setUssdState({
            isOpen: true,
            status: 'prompt',
            title: 'فودافون كاش - استعلام عن الرصيد',
            message: 'برجاء إدخال الرقم السري (PIN) لعرض رصيد محفظتك:',
            showInput: true,
            inputType: 'pin',
            step: 'balance_check_pin',
          });
        }, 1100);

        return;
      }

      // Generic other USSD Code
      setUssdState({
        isOpen: true,
        status: 'dialing',
        message: code,
      });

      setTimeout(() => {
        setUssdState({
          isOpen: true,
          status: 'message',
          title: 'خدمة فودافون',
          message: `تم استلام الرمز ${code}. للتحويل المباشر استخدم الصيغة: *9*7*الرقم*المبلغ# أو اطلب *9# للقائمة.`,
        });
      }, 1100);

      return;
    }

    // 2. Normal Phone Call
    const cleanPhone = rawInput.replace(/\s+/g, '');
    const contactName = findContactName(cleanPhone);

    // Add to call log
    const now = new Date();
    const dateFormatted = `${now.getDate()}/${now.getMonth() + 1}`;
    const newLog: CallLog = {
      id: `log-${Date.now()}`,
      contactName,
      phoneNumber: cleanPhone,
      type: 'outgoing',
      timestamp: dateFormatted,
    };
    setCallLogs((prev) => [newLog, ...prev]);

    setActiveVoiceCall({
      phoneNumber: cleanPhone,
      contactName,
    });
  };


  // Handle USSD Input Submissions
  const handleUSSDSubmit = (value: string) => {
    // Step: direct_transfer_pin
    if (ussdState.step === 'direct_transfer_pin') {
      const enteredPin = value.trim();
      const { recipient, amount } = ussdState.contextData || {};

      if (!recipient || !amount) {
        setUssdState({
          isOpen: true,
          status: 'error',
          message: 'حدث خطأ في قراءة بيانات العملية. يرجى المحاولة من جديد.',
        });
        return;
      }

      if (enteredPin !== pin) {
        setUssdState({
          isOpen: true,
          status: 'error',
          message:
            'الرقم السري الذي أدخلته غير صحيح!\nبرجاء التأكد من كتابة الرقم السري الصحيح للمحفظة (500500).',
        });
        return;
      }

      // Execute transfer
      executeTransfer(recipient, amount);
      return;
    }

    // Step: main_menu
    if (ussdState.step === 'main_menu') {
      const choice = value.trim();

      if (choice === '1' || choice === '7') {
        // Transfer Money flow step 1: enter phone number
        setUssdState({
          isOpen: true,
          status: 'prompt',
          title: 'فودافون كاش - تحويل أموال',
          message: 'أدخل رقم هاتف فودافون المراد التحويل إليه (11 رقم):',
          showInput: true,
          inputType: 'number',
          placeholder: 'مثال: 01010375025',
          step: 'menu_transfer_phone',
        });
        return;
      }

      if (choice === '5') {
        // Balance check
        setUssdState({
          isOpen: true,
          status: 'prompt',
          title: 'فودافون كاش - استعلام عن الرصيد',
          message: 'أدخل الرقم السري للمحفظة لعرض الرصيد:',
          showInput: true,
          inputType: 'pin',
          step: 'balance_check_pin',
        });
        return;
      }

      if (choice === '2') {
        setUssdState({
          isOpen: true,
          status: 'message',
          title: 'فودافون كاش - شحن ودفع الفواتير',
          message: 'خدمة الشحن ودفع الفواتير متاحة. يمكنك شحن رصيد لرقمك أو أرقام أخرى عبر الكود *9*0#.',
        });
        return;
      }

      if (choice === '3') {
        setUssdState({
          isOpen: true,
          status: 'message',
          title: 'كارت الشراء أونلاين VCN',
          message:
            'يمكنك إصدار كارت دفع إلكتروني مؤقت للتسوق عبر الإنترنت صالح لمدة 24 ساعة عبر كود *9*100#.',
        });
        return;
      }

      // Other menu options
      setUssdState({
        isOpen: true,
        status: 'message',
        title: 'فودافون كاش',
        message: 'تم استلام اختيارك بنجاح. شكراً لاستخدامك فودافون كاش.',
      });
      return;
    }

    // Step: menu_transfer_phone
    if (ussdState.step === 'menu_transfer_phone') {
      const recipient = value.replace(/[^0-9\+]/g, '');
      if (recipient.length < 9) {
        setUssdState({
          isOpen: true,
          status: 'error',
          message: 'رقم الهاتف غير صالح. يرجى إدخال رقم صحيح مكون من 11 رقماً.',
        });
        return;
      }

      setUssdState({
        isOpen: true,
        status: 'prompt',
        title: 'فودافون كاش - تحويل أموال',
        message: `التحويل إلى: ${recipient}\n\nأدخل المبلغ المراد تحويله (من 5 إلى 30,000 ج.م):`,
        showInput: true,
        inputType: 'number',
        placeholder: 'المبلغ بالجنيه',
        step: 'menu_transfer_amount',
        contextData: { recipient },
      });
      return;
    }

    // Step: menu_transfer_amount
    if (ussdState.step === 'menu_transfer_amount') {
      const amt = parseFloat(value);
      if (isNaN(amt) || amt <= 0) {
        setUssdState({
          isOpen: true,
          status: 'error',
          message: 'المبلغ غير صالح. يرجى كتابة مبلغ صحيح.',
        });
        return;
      }

      const recipient = ussdState.contextData?.recipient || '';
      setUssdState({
        isOpen: true,
        status: 'prompt',
        title: 'فودافون كاش - تأكيد التحويل',
        message: `تحويل مبلغ ${amt.toFixed(
          2
        )} ج.م إلى رقم ${recipient}؟\nمصاريف الخدمة: 1.00 ج.م\n\nأدخل الرقم السري (PIN) لتأكيد المعاملة:`,
        showInput: true,
        inputType: 'pin',
        step: 'direct_transfer_pin',
        contextData: { recipient, amount: amt },
      });
      return;
    }

    // Step: balance_check_pin
    if (ussdState.step === 'balance_check_pin') {
      if (value.trim() !== pin) {
        setUssdState({
          isOpen: true,
          status: 'error',
          message: 'الرقم السري غير صحيح. تعذر عرض رصيد المحفظة.',
        });
        return;
      }

      setUssdState({
        isOpen: true,
        status: 'message',
        title: 'رصيد محفظة فودافون كاش',
        message: `رصيدك الحالي هو: ${balance.toFixed(2)} ج.م.\n\nكود الاستعلام: *9*13#\nفودافون كاش معك في أي وقت.`,
      });
      return;
    }

    // Default close
    setUssdState((prev) => ({ ...prev, isOpen: false }));
  };

  // Quick Action for a contact
  const handleQuickTransferForContact = (phone: string, name?: string) => {
    const defaultAmount = 100;
    const ussdCode = `*9*7*${phone}*${defaultAmount}#`;
    setDialInput(ussdCode);
    setShowKeypad(true);
    // Optionally trigger immediately or prompt
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-zinc-950 flex items-center justify-center p-0 sm:p-4 text-zinc-900 font-sans antialiased"
    >
      {/* Mobile Device Mockup Frame */}
      <div
        id="phone-device-container"
        className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] max-h-[100dvh] bg-white sm:rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border-[10px] sm:border-zinc-800"
      >
        {/* Top Header Bar (Matching Samsung / Android Phone app) */}
        <TopBar
          onOpenSettings={() => setShowWalletModal(true)}
          onOpenSearch={() => setShowHelpModal(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'recents' && (
            <RecentCalls
              callLogs={callLogs}
              filter={recentsFilter}
              onFilterChange={setRecentsFilter}
              onSelectCall={(phone) => {
                setDialInput(phone);
                setShowKeypad(true);
              }}
              onOpenCashTransferFor={(phone, name) => {
                handleQuickTransferForContact(phone, name);
              }}
              onShowCallDetails={(log) => setSelectedCallDetail(log)}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsList
              contacts={contacts}
              onSelectContact={(phone) => {
                setDialInput(phone);
                setActiveTab('recents');
                setShowKeypad(true);
              }}
              onQuickTransfer={(phone, name) => {
                handleQuickTransferForContact(phone, name);
                setActiveTab('recents');
              }}
              onAddContact={(newC) => {
                const c: Contact = { ...newC, id: `c-${Date.now()}` };
                setContacts((prev) => [c, ...prev]);
              }}
            />
          )}
        </div>

        {/* Keypad Overlay / Bottom section */}
        {showKeypad && (
          <Keypad
            dialInput={dialInput}
            onNumberClick={handleKeypadPress}
            onDeleteClick={handleKeypadDelete}
            onClearClick={handleKeypadClear}
            onCallClick={() => handleMakeCall()}
            onWhatsAppClick={() => {
              const clean = dialInput.replace(/[^0-9]/g, '');
              if (clean) {
                window.open(`https://wa.me/20${clean.replace(/^0+/, '')}`, '_blank');
              }
            }}
            onToggleKeypad={() => setShowKeypad(false)}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          showKeypad={showKeypad}
          onToggleKeypad={() => setShowKeypad(!showKeypad)}
        />

        {/* Voice Calling Screen */}
        {activeVoiceCall && (
          <CallScreen
            phoneNumber={activeVoiceCall.phoneNumber}
            contactName={activeVoiceCall.contactName}
            onEndCall={() => setActiveVoiceCall(null)}
          />
        )}

        {/* USSD Modal */}
        <USSDModal
          ussd={ussdState}
          onCancel={() => setUssdState((prev) => ({ ...prev, isOpen: false }))}
          onSubmit={handleUSSDSubmit}
          onAcknowledge={() => setUssdState((prev) => ({ ...prev, isOpen: false }))}
        />

        {/* SMS Notification Banner */}
        <SMSNotification
          notification={activeNotification}
          onDismiss={() => setActiveNotification(null)}
          onOpenInbox={() => {
            setActiveNotification(null);
            setShowSMSInboxModal(true);
          }}
        />

        {/* SMS Inbox Modal */}
        <SMSInboxModal
          isOpen={showSMSInboxModal}
          onClose={() => setShowSMSInboxModal(false)}
          messages={smsMessages}
        />

        {/* Wallet Info & Quick Presets Modal */}
        <WalletInfoModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          balance={balance}
          transactions={transactions}
          pin={pin}
          onChangePin={(newPin) => setPin(newPin)}
          onAddFunds={(amt) => {
            const newBal = balance + amt;
            setBalance(newBal);
            const refCode = `VF${Math.floor(10000000 + Math.random() * 90000000)}`;
            const now = new Date();
            const timeFormatted = now.toLocaleTimeString('ar-EG', {
              hour: '2-digit',
              minute: '2-digit',
            });
            const newTx: Transaction = {
              id: `tx-${Date.now()}`,
              type: 'transfer_in',
              amount: amt,
              senderNumber: 'إيداع نقدي',
              fee: 0,
              timestamp: `اليوم ${timeFormatted}`,
              referenceCode: refCode,
              balanceAfter: newBal,
              status: 'completed',
            };
            setTransactions((prev) => [newTx, ...prev]);
            const newSms: SMSMessage = {
              id: `sms-${Date.now()}`,
              sender: 'VF-Cash',
              body: `تم إيداع مبلغ ${amt.toFixed(
                2
              )} ج.م في محفظتك بنجاح. رصيدك الحالي هو ${newBal.toFixed(
                2
              )} ج.م. كود المعاملة: ${refCode}.`,
              timestamp: `اليوم ${timeFormatted}`,
              read: false,
              transactionRef: refCode,
            };
            setSmsMessages((prev) => [newSms, ...prev]);
            playNotificationChime();
            setActiveNotification(newSms);
          }}
          onSelectQuickCode={(code) => {
            setDialInput(code);
            setShowKeypad(true);
          }}
        />

        {/* Quick Help & Presets Modal */}
        <QuickHelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          onSelectCode={(code) => {
            setDialInput(code);
            setShowKeypad(true);
          }}
        />

        {/* Call Detail Sheet */}
        <CallDetailModal
          callLog={selectedCallDetail}
          onClose={() => setSelectedCallDetail(null)}
          onCall={(phone) => {
            setDialInput(phone);
            setShowKeypad(true);
            handleMakeCall(phone);
          }}
          onTransferCash={(phone, name) => {
            handleQuickTransferForContact(phone, name);
          }}
        />
      </div>
    </main>
  );
}
