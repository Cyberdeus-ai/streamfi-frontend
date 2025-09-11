import React from "react";

type MinimumProps = {
    onMinimum: () => void
}

const Minimum = ({ onMinimum }: MinimumProps) => {
    return (
        <div
            aria-label="Minimum sidebar"
            onClick={onMinimum}
            className="ml-auto rounded-md p-2 cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="20" height="2" rx="1" fill="#e5e7eb" />
                <rect x="1" y="8" width="20" height="2" rx="1" fill="#e5e7eb" />
                <rect x="1" y="15" width="20" height="2" rx="1" fill="#e5e7eb" />
            </svg>
        </div>
    )
}

export default Minimum;