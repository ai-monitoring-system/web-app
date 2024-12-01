import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../context/ThemeContext';

const SidebarButton = ({ path, isSelected, isCollapsed, icon, label }) => {
  const navigate = useNavigate();
  const { themeSettings } = useTheme();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <div className="relative">
      {/* Active indicator */}
      {isSelected && (
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full"
          style={{ boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)' }}
        />
      )}
      
      <button
        onClick={handleClick}
        className={`flex items-center p-4 mb-4 text-white rounded-md transition-all duration-150 ease-in-out w-full
          ${isSelected 
            ? 'bg-white bg-opacity-25 hover:bg-opacity-30 shadow-lg' 
            : 'hover:bg-white hover:bg-opacity-10'}
          ${isCollapsed ? "justify-center w-14 h-14" : "w-full"}
          ${isSelected ? 'font-medium' : 'font-normal'}
          relative overflow-hidden
        `}
        aria-label={`Navigate to ${label}`}
        title={label}
      >
        {/* Background glow effect for selected state */}
        {isSelected && (
          <div 
            className="absolute inset-0 opacity-20 blur-lg"
            style={{ 
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)',
              transform: 'scale(1.5)'
            }}
          />
        )}

        {/* Content */}
        <div className="flex items-center relative z-10">
          {/* Icon */}
          <span className={`text-2xl ${isSelected ? 'text-white' : 'text-white text-opacity-90'}`}>
            {icon}
          </span>

          {/* Label (hidden when collapsed) */}
          {!isCollapsed && (
            <span className={`ml-4 text-base truncate ${isSelected ? 'text-white' : 'text-white text-opacity-90'}`}>
              {label}
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

SidebarButton.propTypes = {
  path: PropTypes.string.isRequired,
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