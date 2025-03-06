import React from 'react';

export interface CheckboxProps {
  name: string;
  checked: boolean;
  label?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  checked,
  label,
  onChange,
  className,
}) => (
  <div className={`relative flex items-center ${className}`}>
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="cursor-pointer rounded border border-gray-300 bg-white text-gray-900 focus:ring-cyan-400"
      required
    />
    {label && (
      <label htmlFor={name} className="ml-2 block font-medium text-slate-800">
        {label}
      </label>
    )}
  </div>
);

export default Checkbox;