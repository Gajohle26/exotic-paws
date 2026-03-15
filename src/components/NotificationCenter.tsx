import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Notifications } from '@/entities';
import { useMember } from '@/integrations';

export default function NotificationCenter() {
  const { member } = useMember();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (member?._id) {
      loadNotifications();
      // Poll for new notifications every 10 seconds
      const interval = setInterval(loadNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [member?._id]);

  const loadNotifications = async () => {
    try {
      if (!member?._id) return;
      const result = await BaseCrudService.getAll<Notifications>('notifications', {}, { limit: 20 });
      const userNotifications = result.items
        .filter(n => n.userId === member._id)
        .sort((a, b) => {
          const timeA = new Date(a.createdDate || 0).getTime();
          const timeB = new Date(b.createdDate || 0).getTime();
          return timeB - timeA;
        });
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await BaseCrudService.update('notifications', {
        _id: notificationId,
        isRead: true,
      });
      await loadNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await BaseCrudService.delete('notifications', notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'outbid':
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      case 'verification_status':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'auction_update':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-secondary" />;
    }
  };

  if (!member) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-subtlebackground rounded-full transition-colors"
      >
        <Bell className="w-6 h-6 text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructiveforeground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-3xl shadow-2xl border border-secondary/10 z-50 max-h-[600px] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-secondary/10 p-4 flex items-center justify-between rounded-t-3xl">
              <h3 className="font-heading text-lg text-secondary">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-subtlebackground rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>

            {/* Notifications List */}
            {notifications.length > 0 ? (
              <div className="divide-y divide-secondary/5">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-4 hover:bg-subtlebackground/50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => markAsRead(notification._id!)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-paragraph font-semibold text-secondary text-sm">
                          {notification.message}
                        </p>
                        <p className="text-xs text-secondary/60 mt-1">
                          {notification.createdDate
                            ? new Date(notification.createdDate).toLocaleString()
                            : 'Just now'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification._id!);
                        }}
                        className="flex-shrink-0 p-1 hover:bg-secondary/10 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-secondary/40" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-secondary/20 mx-auto mb-3" />
                <p className="font-paragraph text-secondary/60">
                  No notifications yet
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
