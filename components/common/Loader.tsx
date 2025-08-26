import React from "react";

const Loader = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="relative w-16 h-16">
                <div
                    className="absolute border-4 border-t-4 border-transparent rounded-full w-full h-full animate-spin 
                                from-blue-500 via-purple-500 to-pink-500 bg-gradient-to-r animate-gradient-background"
                >
                </div>
            </div>
        </div>
    );
}

export default Loader;