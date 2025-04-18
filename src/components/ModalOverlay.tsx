
import { ReactNode, useEffect } from "react";

interface ModalOverlayProps {
  children: ReactNode;
  onClose?: () => void;
  isEventOpen: boolean;
  title?: string;
}

export const ModalOverlay = ({ children, onClose, isEventOpen, title }: ModalOverlayProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose(); // Close on ESC key
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isEventOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity animate-fadeIn "
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-lg relative p-9 transition-transform animate-scaleIn min-w-[300px]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {title && <h1 className="text-lg font-semibold mb-2">{title}</h1>}
        {/* Close Button */}
        <button
          className="absolute top-6 right-8 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};
