import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types';
import {
  getNotifications,
  getNotificationById,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../utils/localStorage';


interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  getNotification: (id: string) => Notification | undefined;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => Notification;
  markAsRead: (id: string) => Notification | undefined;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  refreshNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = () => {
    try {
      setLoading(true);
      const notificationsData = getNotifications();
      
      // Sort notifications by timestamp (newest first)
      notificationsData.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setNotifications(notificationsData);
      
      // Count unread notifications
      const unread = notificationsData.filter(notification => !notification.isRead).length;
      setUnreadCount(unread);
      
      setError(null);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const getNotification = (id: string): Notification | undefined => {
    return getNotificationById(id);
  };

  const addNotification = (
    notificationData: Omit<Notification, 'id' | 'timestamp'>
  ): Notification => {
    try {
      const newNotification = createNotification(notificationData);
      
      setNotifications(prevNotifications => 
        [newNotification, ...prevNotifications]
      );
      
      setUnreadCount(prevCount => prevCount + 1);
      
      return newNotification;
    } catch (err) {
      setError('Failed to add notification');
      console.error('Error adding notification:', err);
      throw err;
    }
  };

  const markAsRead = (id: string): Notification | undefined => {
    try {
      const updatedNotification = markNotificationAsRead(id);
      
      if (updatedNotification) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === id ? { ...notification, isRead: true } : notification
          )
        );
        
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
      
      return updatedNotification;
    } catch (err) {
      setError('Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
      throw err;
    }
  };

  const markAllAsRead = (): void => {
    try {
      markAllNotificationsAsRead();
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      setError('Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  };

  const removeNotification = (id: string): void => {
    try {
      const notification = getNotificationById(id);
      
      deleteNotification(id);
      
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      );
      
      // If the notification was unread, decrement the counter
      if (notification && !notification.isRead) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
    } catch (err) {
      setError('Failed to delete notification');
      console.error('Error deleting notification:', err);
      throw err;
    }
  };

  const refreshNotifications = (): void => {
    loadNotifications();
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      error,
      getNotification,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      refreshNotifications
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
