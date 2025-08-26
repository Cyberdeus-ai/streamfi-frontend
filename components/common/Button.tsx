import React from "react";
import clsx from "clsx";

type ButtonProps = {
    title: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

const Button = ({ title, onClick, disabled, className }: ButtonProps) => {
    return (
        <button
            className={
                clsx("w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-3 px-6 rounded-lg \
                    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    className
                )
            }    
            onClick={onClick}
            disabled={disabled}
        >
            {title}    
        </button>
    )
}

export default Button;