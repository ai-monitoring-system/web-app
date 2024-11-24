import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const SidebarButton = ({ path, isSelected, isCollapsed, icon, label }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path); // Navigate to the provided path
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center p-3 mb-4 text-white rounded-md transition-transform duration-150 ease-in-out transform hover:scale-105 hover:bg-opacity-80
        ${isSelected ? "bg-blue-600" : "bg-blue-500"}
        ${isCollapsed ? "justify-center w-12 h-12" : "w-full"}`}
      aria-label={`Navigate to ${label}`}
      title={label}
    >
      {/* Icon */}
      <span className="text-lg">{icon}</span>

      {/* Label (hidden when collapsed) */}
      {!isCollapsed && (
        <span className="ml-3 text-sm font-medium truncate">{label}</span>
      )}
    </button>
  );
};

SidebarButton.propTypes = {
  path: PropTypes.string.isRequired, // Route path to navigate to
  isSelected: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

SidebarButton.defaultProps = {
  isSelected: false,
  isCollapsed: false,
};

export default SidebarButton;