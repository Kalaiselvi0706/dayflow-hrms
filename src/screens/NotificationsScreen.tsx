import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import { Notification } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';

export const NotificationsScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications(currentUser.id);
      setAlerts(data);
    } catch (err) {
      setError('Failed to fetch user notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [currentUser]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const success = await notificationService.markAsRead(id);
      if (success) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
        );
      }
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    if (!currentUser) return;
    try {
      const success = await notificationService.markAllAsRead(currentUser.id);
      if (success) {
        setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
      }
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-4">
        <SkeletonLoader variant="list" count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <ErrorState message={error} onRetry={fetchAlerts} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl flex items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">System Notifications</h2>
          <p className="text-sm text-[#908fa0]">Alerts, approvals, policy changes, and neural sync warnings.</p>
        </div>
        {alerts.some((a) => !a.isRead) && (
          <Button variant="secondary" icon="done_all" onClick={handleMarkAllRead}>
            Mark All Read
          </Button>
        )}
      </div>

      {!alerts.length ? (
        <EmptyState
          icon="notifications_off"
          title="All caught up!"
          description="You don't have any pending alerts or warnings inside your log feed."
        />
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const borderColors = {
              success: 'border-emerald-500/20 bg-emerald-500/5',
              warning: 'border-amber-500/20 bg-amber-500/5',
              error: 'border-rose-500/20 bg-rose-500/5',
              info: 'border-[#8083ff]/20 bg-[#8083ff]/5',
            };
            const icons = {
              success: 'check_circle',
              warning: 'warning',
              error: 'error',
              info: 'info',
            };
            const iconColors = {
              success: 'text-emerald-400',
              warning: 'text-amber-400',
              error: 'text-rose-400',
              info: 'text-[#c0c1ff]',
            };

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border flex gap-4 transition-all relative overflow-hidden backdrop-blur-md ${
                  borderColors[alert.type]
                } ${!alert.isRead ? 'ring-1 ring-[#8083ff]/30' : 'opacity-70'}`}
              >
                {!alert.isRead && (
                  <span className="absolute top-0 right-0 w-3 h-3 rounded-bl-xl bg-[#8083ff]"></span>
                )}
                <div className={`w-9 h-9 rounded-xl bg-[#282a30] flex items-center justify-center shrink-0 border border-[#464554]/30 ${iconColors[alert.type]}`}>
                  <span className="material-symbols-outlined text-base">
                    {icons[alert.type]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-white truncate">{alert.title}</h4>
                    <span className="text-[10px] text-[#908fa0] shrink-0 font-medium">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#908fa0] leading-relaxed">{alert.message}</p>
                </div>
                {!alert.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(alert.id)}
                    className="self-center text-[10px] font-bold text-[#8083ff] hover:underline shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
