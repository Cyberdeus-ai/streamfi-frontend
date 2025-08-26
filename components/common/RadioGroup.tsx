import React, { ChangeEvent } from 'react';

type RadioGroupProps = {
    name: string;
    options: string[];
    selectedValue: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    label: string;
}

const RadioGroup = ({
    name,
    options,
    selectedValue,
    onChange,
    label,
}: RadioGroupProps) => {

  return (
    <div className="flex flex-col space-y-2">
        <label className="text-lg font-medium">{label}</label>
        <div className="flex flex-col space-y-2">
            {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <input
                        type="radio"
                        id={`${name}-${option}`}
                        name={name}
                        value={option}
                        checked={selectedValue === option}
                        onChange={onChange}
                        className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor={`${name}-${option}`} className="text-sm">
                        {option}
                    </label>
                </div>
            ))}
        </div>
    </div>
  );
};

export default RadioGroup;