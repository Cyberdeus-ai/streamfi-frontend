import React from "react";
import clsx from "clsx";

export type DropDownOption = string | { label: string; value: string; disabled?: boolean };

type DropDownProps = {
    label?: string;
    name?: string;
    value: string;
    options: DropDownOption[];
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    className?: string;
};

const normalizeOption = (opt: DropDownOption) => {
    if (typeof opt === "string") return { label: opt, value: opt, disabled: false };
    return { label: opt.label, value: opt.value, disabled: !!opt.disabled };
};

const DropDown = ({
    label,
    name,
    value,
    options,
    placeholder,
    onChange,
    disabled = false,
    className,
}: DropDownProps) => {
    const normalized = options.map(normalizeOption);

    return (
        <div className="mt-2">
            {(label || label !== "") && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={clsx(
                    "w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-blue-500 bg-white",
                    className
                )}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {normalized.map((o) => (
                    <option key={o.value} value={o.value} disabled={o.disabled}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropDown;