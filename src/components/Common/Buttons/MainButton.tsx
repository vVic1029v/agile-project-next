import React from "react";

interface MainButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const MainButton: React.FC<MainButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`bg-neutral-800 text-white p-3 rounded-lg mt-4 hover:bg-neutral-900 ${className}`}
    >
      {children}
    </button>
  );
};

export default MainButton;