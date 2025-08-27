import React from "react";
import clsx from "clsx";

type InputProps = {
    label?: string;
    name?: string;
    type?: string;
    value: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

const Input = ({ 
    label,
    name,
    type = "text",
    placeholder = "",
    value = "",
    onChange,
    disabled = false,
}: InputProps) => {
    return (
        <div className="mb-6">
            {
                (label || label !== "") && (
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        { label }
                    </label>
                )
            }
            <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    )
}

export default Input;