import React from "react";

const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{background: 'rgba(0,0,0,0.5)'}}>
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-10 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-10 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        </div>
    );
}

export default Loader;