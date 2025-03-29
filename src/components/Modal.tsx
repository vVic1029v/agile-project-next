import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] md:w-[600px]">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-bold text-gray-500">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
