import React from "react";

interface UtilityButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const UtilityButton: React.FC<UtilityButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-100 px-5 py-2.5 ${className}`}
    >
      {children}
    </button>
  );
};

export default UtilityButton;