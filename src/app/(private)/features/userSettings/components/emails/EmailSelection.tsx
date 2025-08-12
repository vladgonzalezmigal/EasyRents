'use client';

import { useStore } from '@/store';
import { useState } from 'react';
import SettingsEditEmail from '../edits/SettingsEditEmail';
import SaveIcon from '@/app/(private)/components/svgs/SaveIcon';
import EditIcon from '@/app/(private)/components/svgs/EditIcon';

export default function EmailSelection() {
    const { emailState, updateEmail, isCudEmailLoading } = useStore();
    const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
    const [editedEmails, setEditedEmails] = useState<{ sender: string; receiver: string }>({
        sender: emailState.emails?.[0]?.sender_email || '',
        receiver: emailState.emails?.[0]?.recipient_email || ''
    });

    const isValidEmail = (type: 'sender' | 'receiver'): boolean => {
        const email = editedEmails[type];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEditClick = (type: 'sender' | 'receiver') => {
        if (editingRows.has(type)) {
            // Save changes
            const emailToUpdate = {
                id: emailState.emails?.[0]?.id || 0,
                sender_email: editedEmails.sender,
                recipient_email: editedEmails.receiver
            };
            updateEmail(emailToUpdate);
            
            const newEditingRows = new Set(editingRows);
            newEditingRows.delete(type);
            setEditingRows(newEditingRows);
        } else {
            // Start editing
            const newEditingRows = new Set(editingRows);
            newEditingRows.add(type);
            setEditingRows(newEditingRows);
        }
    };

    const handleEmailChange = (type: 'sender' | 'receiver', value: string) => {
        setEditedEmails(prev => ({
            ...prev,
            [type]: value
        }));
    };

    return (
        <div className="w-full space-y-6">
            <h3 className="text-xl font-semibold text-[#404040]">Send Documents</h3>
            {/* Table Container */}
            <div className="bg-white py-2 border border-[#E4F0F6] rounded-xl shadow-sm pb-4 max-w-[600px]">
                <div className="  ">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="sticky top-0 z-10 text-[16px] bg-white ">
                            <tr>
                                <th scope="col" className="w-[150px] min-w-[150px] max-w-[150px] px-6 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                    Email Type
                                </th>
                                <th scope="col" className="w-[300px] min-w-[300px] max-w-[300px] px-6 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs text-[#80848A] text-[16px] tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#E4F0F6] divide-y-[2px]">
                            {/* Sender Row */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium">
                                    <span className="text-[#0C3C74]">Sender</span>
                                </td>
                                <SettingsEditEmail
                                    value={editedEmails.sender}
                                    onChange={(value) => handleEmailChange('sender', value)}
                                    isEditing={editingRows.has('sender')}
                                    disabled={!isValidEmail('sender')}
                                />
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button
                                        onClick={() => handleEditClick('sender')}
                                        className={`mr-4 p-2 rounded-full ${
                                            editingRows.has('sender') && !isValidEmail('sender') || isCudEmailLoading
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-[#0C3C74] hover:text-[#2A7D7B] hover:bg-gray-100'
                                        }`}
                                    >
                                        {editingRows.has('sender') ? (
                                            <SaveIcon className="w-5 h-5" />
                                        ) : (
                                            <EditIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </td>
                            </tr>
                            {/* Receiver Row */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium">
                                    <span className="text-[#2A7D7B]">Receiver</span>
                                </td>
                                <SettingsEditEmail
                                    value={editedEmails.receiver}
                                    onChange={(value) => handleEmailChange('receiver', value)}
                                    isEditing={editingRows.has('receiver')}
                                    disabled={!isValidEmail('receiver')}
                                />
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button
                                        onClick={() => handleEditClick('receiver')}
                                        className={`mr-4 p-2 rounded-full ${
                                            editingRows.has('receiver') && !isValidEmail('receiver') || isCudEmailLoading
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-[#0C3C74] hover:text-[#2A7D7B] hover:bg-gray-100'
                                        }`}
                                    >
                                        {editingRows.has('receiver') ? (
                                            <SaveIcon className="w-5 h-5" />
                                        ) : (
                                            <EditIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}