import * as React from "react";

interface MultiSelectProps {
  id?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ id, options, value, onChange, placeholder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    onChange(selected);
  };

  return (
    <select
      id={id}
      multiple
      value={value}
      onChange={handleChange}
      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
};
