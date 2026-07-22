import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNotification, NOTIFICATIONS } from '@/constants/data';

const STORAGE_KEY = '@swiftmart/notifications';
const MAX_NOTIFS = 10;

/* ─── Types ─────────────────────────────────────────────────────── */
interface NotificationCtx {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationCtx | null>(null);

/* ─── Provider ───────────────────────────────────────────────────── */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const initialized = useRef(false);

  /* Load from AsyncStorage on mount; seed with static data if empty */
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setNotifications(JSON.parse(raw));
        } else {
          // First launch — seed with the static sample list (capped)
          const seeded = NOTIFICATIONS.slice(0, MAX_NOTIFS);
          setNotifications(seeded);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        }
      } catch {
        setNotifications(NOTIFICATIONS.slice(0, MAX_NOTIFS));
      }
      initialized.current = true;
    })();
  }, []);

  /* Persist whenever state changes (skip the very first render) */
  useEffect(() => {
    if (!initialized.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications)).catch(() => {});
  }, [notifications]);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  /**
   * Prepend a new notification and drop the oldest if over the 10-item cap.
   */
  const addNotification = useCallback(
    (partial: Omit<AppNotification, 'id' | 'read'>) => {
      const next: AppNotification = {
        ...partial,
        id: `n_${Date.now()}`,
        read: false,
      };
      setNotifications((prev) => {
        const updated = [next, ...prev];
        return updated.length > MAX_NOTIFS ? updated.slice(0, MAX_NOTIFS) : updated;
      });
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────────────── */
export function useNotifications(): NotificationCtx {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
