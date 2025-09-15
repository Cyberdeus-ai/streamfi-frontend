import clsx from 'clsx';
import React, { useState, useEffect } from 'react';

type TagInputProps = {
    label?: string;
    value?: string[];
    name: string,
    onChange?: (name: string, tags: string[]) => void;
    placeholder?: string;
    error?: boolean;
}

const TagInput = ({ label, value = [], name, onChange, placeholder = "Add a Tag", error }: TagInputProps) => {
    const [tags, setTags] = useState<string[]>(value);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        setTags(value);
    }, [value]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            const trimmedValue = inputValue.trim();
            if (!tags.includes(trimmedValue)) {
                const newTags = [...tags, trimmedValue];
                setTags(newTags);
                onChange?.(name, newTags);
            }
            setInputValue('');
        } else if (e.key === 'Escape') {
            setInputValue('');
        }
    };

    const handleDelete = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
        onChange?.(name, newTags);
    };

    return (
        <div className="flex flex-col space-y-2 w-full mt-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className={
                clsx("flex flex-wrap items-center gap-2 min-h-[48px] px-4 py-2 border-2 rounded-lg \
                     focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent",
                    error ? "border-red-600" : "border-gray-300")
            }>
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleDelete(index)}
                            className="ml-2 text-gray-500 font-bold cursor-pointer hover:text-gray-900"
                        >
                            x
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    className="flex-1 min-w-[120px] outline-none text-gray-700 placeholder-gray-400"
                    onBlur={() => {
                        const trimmedValue = inputValue.trim();
                        if (trimmedValue !== '' && !tags.includes(trimmedValue)) {
                            const newTags = [...tags, trimmedValue];
                            setTags(newTags);
                            onChange?.(name, newTags);
                        }
                        setInputValue('');
                    }}
                />
            </div>
        </div>
    );
};

export default TagInput;
