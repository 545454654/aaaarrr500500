import React, { useState } from 'react';
import { Search, Phone, ArrowLeftRight, UserPlus, Star, User } from 'lucide-react';
import { Contact } from '../types';

interface ContactsListProps {
  contacts: Contact[];
  onSelectContact: (phone: string, name: string) => void;
  onQuickTransfer: (phone: string, name: string) => void;
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  onSelectContact,
  onQuickTransfer,
  onAddContact,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    onAddContact({
      name: newName.trim(),
      phone: newPhone.trim(),
      type: 'mobile',
      avatarColor: 'bg-indigo-500',
    });
    setNewName('');
    setNewPhone('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto px-4 py-2 select-none">
      {/* Header and Search */}
      <div className="flex items-center justify-between pt-2 pb-3">
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة</span>
        </button>

        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">جهات الاتصال</h1>
      </div>

      {/* Search Bar */}
      <div className="relative w-full mb-3">
        <input
          id="input-contacts-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث في الأسماء أو الأرقام..."
          className="w-full h-10 pr-10 pl-4 bg-zinc-100/80 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-emerald-500/30 text-right"
        />
        <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
      </div>

      {/* Contacts List */}
      <div className="flex-1 space-y-1 pb-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            id={`contact-row-${contact.id}`}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100"
          >
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onQuickTransfer(contact.phone, contact.name)}
                title="تحويل فودافون كاش"
                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all flex items-center gap-1 text-xs font-medium"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>تحويل كاش</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectContact(contact.phone, contact.name)}
                title="اتصال"
                className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>

            {/* Name & Phone details */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onSelectContact(contact.phone, contact.name)}
            >
              <div className="flex flex-col items-end text-right">
                <div className="flex items-center gap-1">
                  {contact.favorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                  <span className="text-base font-semibold text-zinc-900">{contact.name}</span>
                </div>
                <span className="text-xs text-zinc-400 font-mono dir-ltr">{contact.phone}</span>
              </div>

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${
                  contact.avatarColor || 'bg-zinc-700'
                }`}
              >
                {contact.name.charAt(0)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-right animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <User className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-zinc-900">إضافة جهة اتصال جديدة</h3>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">الاسم</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: محمد علي"
                  className="w-full h-11 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">رقم الهاتف (فودافون)</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="مثال: 01012345678"
                  className="w-full h-11 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-emerald-500 font-mono dir-ltr text-right"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#00C853] text-white hover:bg-[#00B248] shadow-sm"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
