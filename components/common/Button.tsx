import React from "react";

type ButtonProps = {
    title: string;
    onClick: () => void;
}

const Button = ({ title, onClick }: ButtonProps) => {
    return (
        <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"    
            onClick={onClick}
        >
            {title}    
        </button>
    )
}

export default Button;