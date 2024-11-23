import React from "react";

const SidebarButton = ({ onClick, isSelected, isCollapsed, icon, label }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center p-3 mb-4 text-white transition duration-150 ease-in-out rounded-md transform hover:scale-105 hover:bg-opacity-80 ${isSelected ? "bg-blue-600" : "bg-blue-500"
                } ${isCollapsed ? "justify-center w-12 h-12" : "w-full"}`}
            aria-label={`Go to ${label}`}
        >
            <span className="text-lg">{icon}</span>
            {!isCollapsed && <span className="ml-3">{label}</span>}
        </button>
    );
};

export default SidebarButton;
