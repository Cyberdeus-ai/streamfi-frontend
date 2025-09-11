import React from "react";

type ToggleProps = {
    label: string;
    active: boolean;
    onToggle: () => void;
};

const Toggle = ({ label, active, onToggle }: ToggleProps) => {
    return (
        <div className="flex items-center justify-end my-2">
            <label className="text-sm font-medium text-gray-600 mr-2">{label}</label>
            <button
                type="button"
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${active ? 'bg-blue-600' : 'bg-gray-600'}`}
                aria-pressed={active ? 'true' : 'false'}
                aria-label={`Toggle ${label}`}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
};

export default Toggle;