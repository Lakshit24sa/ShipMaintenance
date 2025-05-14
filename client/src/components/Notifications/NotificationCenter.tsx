import React from 'react';
import { XIcon, BellIcon, CheckIcon } from 'lucide-react';
import { Notification } from '../../types';
import { formatTimeAgo } from '../../utils/dateUtils';
import { Button } from '@/components/ui/button';

interface NotificationCenterProps {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  markAsRead,
  markAllAsRead,
  onClose
}) => {
  // Handle click outside to close the notification center
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(id);
  };
  
  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'Job Created':
        return <div className="p-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full"><BellIcon className="h-3 w-3" /></div>;
      case 'Job Updated':
        return <div className="p-1 bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300 rounded-full"><BellIcon className="h-3 w-3" /></div>;
      case 'Job Completed':
        return <div className="p-1 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 rounded-full"><CheckIcon className="h-3 w-3" /></div>;
      default:
        return <div className="p-1 bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300 rounded-full"><BellIcon className="h-3 w-3" /></div>;
    }
  };
  
  return (
    <div 
      ref={ref} 
      className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
    >
      <div className="py-1">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Notifications</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={onClose}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="max-h-60 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`px-4 py-2 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex">
                    <div className="mt-0.5 mr-2">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                        {notification.type}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{notification.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatTimeAgo(notification.timestamp)}</p>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <button 
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      aria-label="Mark as read"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              <BellIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No notifications</p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
