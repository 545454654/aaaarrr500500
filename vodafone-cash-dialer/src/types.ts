export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatarColor?: string;
  type?: 'mobile' | 'home' | 'work';
  favorite?: boolean;
}

export interface CallLog {
  id: string;
  contactName?: string;
  phoneNumber: string;
  type: 'incoming' | 'outgoing' | 'missed';
  timestamp: string; // e.g. "8/10", "8/6", "اليوم 05:22 م"
  duration?: string;
  isVodafoneCash?: boolean;
}

export interface Transaction {
  id: string;
  type: 'transfer_out' | 'transfer_in' | 'cash_out' | 'recharge' | 'fee';
  amount: number;
  recipientNumber?: string;
  recipientName?: string;
  senderNumber?: string;
  fee: number;
  timestamp: string;
  referenceCode: string;
  balanceAfter: number;
  status: 'completed' | 'failed' | 'pending';
}

export interface SMSMessage {
  id: string;
  sender: 'VF-Cash' | 'Vodafone' | string;
  body: string;
  timestamp: string;
  read: boolean;
  transactionRef?: string;
}

export interface USSDState {
  isOpen: boolean;
  status: 'dialing' | 'prompt' | 'message' | 'error';
  title?: string;
  message: string;
  showInput?: boolean;
  inputType?: 'pin' | 'text' | 'number' | 'menu';
  inputValue?: string;
  placeholder?: string;
  step?: string;
  contextData?: {
    recipient?: string;
    amount?: number;
    menuOption?: string;
    stage?: string;
  };
}
