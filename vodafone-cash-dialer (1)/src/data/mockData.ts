import { Contact, CallLog, SMSMessage, Transaction } from '../types';

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'ميرا عمري',
    phone: '01010375025',
    avatarColor: 'bg-emerald-500',
    type: 'mobile',
    favorite: true,
  },
  {
    id: 'c2',
    name: 'بابا',
    phone: '01098688815',
    avatarColor: 'bg-blue-600',
    type: 'mobile',
    favorite: true,
  },
  {
    id: 'c3',
    name: 'أحمد محمود',
    phone: '01023456789',
    avatarColor: 'bg-amber-600',
    type: 'mobile',
  },
  {
    id: 'c4',
    name: 'ماما',
    phone: '01065432198',
    avatarColor: 'bg-rose-500',
    type: 'mobile',
    favorite: true,
  },
  {
    id: 'c5',
    name: 'مهندس سامي (العمل)',
    phone: '01011223344',
    avatarColor: 'bg-indigo-600',
    type: 'work',
  },
  {
    id: 'c6',
    name: 'خدمة عملاء فودافون كاش',
    phone: '7001',
    avatarColor: 'bg-red-600',
    type: 'mobile',
  },
];

export const INITIAL_CALL_LOGS: CallLog[] = [
  {
    id: 'log-1',
    contactName: 'ميرا عمري',
    phoneNumber: '01010375025',
    type: 'outgoing',
    timestamp: '8/10',
    duration: '02:45',
  },
  {
    id: 'log-2',
    contactName: 'بابا',
    phoneNumber: '01098688815',
    type: 'outgoing',
    timestamp: '8/6',
    duration: '05:12',
  },
  {
    id: 'log-3',
    contactName: 'أحمد محمود',
    phoneNumber: '01023456789',
    type: 'missed',
    timestamp: '8/5',
  },
  {
    id: 'log-4',
    contactName: 'فودافون كاش *9#',
    phoneNumber: '*9#',
    type: 'outgoing',
    timestamp: '8/3',
    isVodafoneCash: true,
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'transfer_out',
    amount: 150.0,
    recipientNumber: '01010375025',
    recipientName: 'ميرا عمري',
    fee: 1.0,
    timestamp: '2026-08-10 16:30',
    referenceCode: 'VF84910283',
    balanceAfter: 4849.0,
    status: 'completed',
  },
  {
    id: 'tx-2',
    type: 'transfer_in',
    amount: 2000.0,
    senderNumber: '01098688815',
    fee: 0,
    timestamp: '2026-08-06 11:15',
    referenceCode: 'VF73819204',
    balanceAfter: 5000.0,
    status: 'completed',
  },
];

export const INITIAL_SMS_MESSAGES: SMSMessage[] = [
  {
    id: 'sms-1',
    sender: 'VF-Cash',
    body: 'تم تحويل مبلغ 150.00 ج.م بنجاح إلى رقم 01010375025. مصاريف الخدمة 1.00 ج.م. رصيدك المتبقي الحالي هو 4849.00 ج.م. كود المعاملة: VF84910283.',
    timestamp: '10 أغسطس 04:30 م',
    read: true,
    transactionRef: 'VF84910283',
  },
  {
    id: 'sms-2',
    sender: 'VF-Cash',
    body: 'تم استلام مبلغ 2000.00 ج.م من رقم 01098688815 في محفظتك بنجاح. رصيدك الحالي هو 5000.00 ج.م. كود المعاملة: VF73819204.',
    timestamp: '6 أغسطس 11:15 ص',
    read: true,
    transactionRef: 'VF73819204',
  },
  {
    id: 'sms-3',
    sender: 'Vodafone',
    body: 'أهلاً بك في فودافون كاش. يمكنك الآن تحويل الأموال بسهولة عبر طلب كود *9*7*الرقم*المبلغ# أو طلب *9# لمزيد من الخدمات.',
    timestamp: '1 أغسطس 10:00 ص',
    read: true,
  },
];
