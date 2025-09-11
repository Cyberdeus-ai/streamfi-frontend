import clsx from "clsx";
import React from "react";

type InputProps = {
    label?: string;
    name?: string;
    type?: string;
    value: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    disabled?: boolean;
    error?: boolean
}

const Input = ({
    label,
    name,
    type = "text",
    placeholder = "",
    value = "",
    onChange,
    onBlur,
    disabled = false,
    error
}: InputProps) => {
    return (
        <div className="mt-2">
            {
                (label || label !== "") && (
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )
            }
            <input
                className={
                    clsx("w-full px-4 py-3 border-2 rounded-lg text-gray-700 placeholder-gray-400 \
                         focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-blue-500",
                         error ? 'border-red-600' : 'border-gray-300')
                }
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
            />
        </div>
    )
}

export default Input;