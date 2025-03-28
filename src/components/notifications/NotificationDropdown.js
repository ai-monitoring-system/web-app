import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaTimesCircle, FaExclamationCircle, FaCheckCircle, FaInfo, FaRegBell } from 'react-icons/fa';

const NotificationDropdown = ({ notifications, onClose, onClearAll, onMarkAsRead, isOpen }) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.timestamp).toLocaleDateString();
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(notification);
    return groups;
  }, {});

  // Get sorted dates (newest first)
  const sortedDates = Object.keys(groupedNotifications).sort((a, b) => 
    new Date(b) - new Date(a)
  );

  // Icon mapping based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'warning':
        return <FaInfo className="text-yellow-500" />;
      default:
        return <FaBell className="text-blue-500" />;
    }
  };

  const getTimeString = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Navigate to notification settings
  const goToNotificationSettings = () => {
    onClose(); // Close the dropdown first
    navigate('/settings', { state: { activeTab: 'notifications' }}); // Navigate with state to highlight the notifications tab
  };

  return (
    <div 
      className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onClearAll}
            className="text-sm px-2 py-1 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50/60 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 transition-colors duration-150"
          >
            Clear All
          </button>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimesCircle />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-gray-500 dark:text-gray-400">
            <FaRegBell className="text-4xl mb-3 opacity-50" />
            <p>No notifications yet</p>
            <p className="text-sm mt-1">We'll notify you when something important happens</p>
          </div>
        ) : (
          <>
            {sortedDates.map((date) => (
              <div key={date}>
                <div className="sticky top-0 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 z-10">
                  {date === new Date().toLocaleDateString() ? 'Today' : date}
                </div>
                
                {groupedNotifications[date].map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 
                      hover:bg-blue-50/60 dark:hover:bg-blue-900/30 transition-colors duration-150 
                      ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {getTimeString(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
        <button 
          className="text-sm text-blue-600 dark:text-blue-400 py-1.5 px-4 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-150"
          onClick={goToNotificationSettings}
        >
          Notification Settings
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
