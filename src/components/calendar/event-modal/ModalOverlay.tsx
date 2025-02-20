import { ReactNode, useEffect } from "react";

interface ModalOverlayProps {
  children: ReactNode;
  onClose?: () => void;
  isOpen: boolean;
}

export const ModalOverlay = ({ children, onClose, isOpen }: ModalOverlayProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose(); // Close on ESC key
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-96 relative p-6 transition-transform animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
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
