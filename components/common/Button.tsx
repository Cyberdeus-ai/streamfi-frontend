import React from "react";
import clsx from "clsx";

type ButtonProps = {
    title: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    variant?: string;
}

const setButtonVariant = (variant: string) => {
    switch(variant) {
        case "primary":
            return "bg-white text-blue-700 border-2 border-blue-700 hover:bg-blue-100";
        case "secondary":
            return "bg-blue-600 hover:bg-blue-700 text-white";
        case "default":
            return  "bg-gray-300 hover:bg-gray-400 text-black";
        case "danger":
            return "bg-white text-red-700 border-2 border-red-700 hover:bg-red-100";
        default:
            return "";
    }
}

const Button = ({ title, onClick, disabled, className, variant = "default" }: ButtonProps) => {
    return (
        <button
            className={
                clsx("w-full cursor-pointer font-semibold py-3 px-6 rounded-lg transition-colors \
                    duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    setButtonVariant(variant),className
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