import { 
  getMessaging, 
  getToken, 
  onMessage,
  isSupported 
} from 'firebase/messaging';
import app from '../firebase';

// تهيئة Firebase Cloud Messaging
let messaging = null;

const initializeMessaging = async () => {
  try {
    const isMessagingSupported = await isSupported();
    if (isMessagingSupported) {
      messaging = getMessaging(app);
      return messaging;
    } else {
      console.log('Firebase Cloud Messaging غير مدعوم في هذا المتصفح');
      return null;
    }
  } catch (error) {
    console.error('خطأ في تهيئة Firebase Messaging:', error);
    return null;
  }
};

// طلب إذن الإشعارات
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) {
      messaging = await initializeMessaging();
    }
    
    if (!messaging) {
      return { success: false, error: 'Firebase Messaging غير مدعوم' };
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      return { success: true, permission };
    } else {
      return { success: false, error: 'تم رفض إذن الإشعارات' };
    }
  } catch (error) {
    console.error('خطأ في طلب إذن الإشعارات:', error);
    return { success: false, error: error.message };
  }
};

// الحصول على توكن الإشعارات
export const getNotificationToken = async () => {
  try {
    if (!messaging) {
      messaging = await initializeMessaging();
    }
    
    if (!messaging) {
      return { success: false, error: 'Firebase Messaging غير مدعوم' };
    }

    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_KEY' // استبدل بمفتاح VAPID الخاص بك
    });

    if (token) {
      return { success: true, token };
    } else {
      return { success: false, error: 'لا يمكن الحصول على توكن الإشعارات' };
    }
  } catch (error) {
    console.error('خطأ في الحصول على توكن الإشعارات:', error);
    return { success: false, error: error.message };
  }
};

// مراقبة الإشعارات الواردة
export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (!messaging) {
      resolve(null);
      return;
    }

    onMessage(messaging, (payload) => {
      console.log('إشعار ورد:', payload);
      resolve(payload);
    });
  });
};

// حفظ توكن الإشعارات في قاعدة البيانات
export const saveNotificationToken = async (userId, token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}/notification-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: 'فشل في حفظ توكن الإشعارات' };
    }
  } catch (error) {
    console.error('خطأ في حفظ توكن الإشعارات:', error);
    return { success: false, error: error.message };
  }
};

// إعداد الإشعارات للمستخدم
export const setupNotifications = async (userId) => {
  try {
    // طلب إذن الإشعارات
    const permissionResult = await requestNotificationPermission();
    if (!permissionResult.success) {
      return permissionResult;
    }

    // الحصول على توكن الإشعارات
    const tokenResult = await getNotificationToken();
    if (!tokenResult.success) {
      return tokenResult;
    }

    // حفظ التوكن في قاعدة البيانات
    const saveResult = await saveNotificationToken(userId, tokenResult.token);
    if (!saveResult.success) {
      return saveResult;
    }

    return { success: true, token: tokenResult.token };
  } catch (error) {
    console.error('خطأ في إعداد الإشعارات:', error);
    return { success: false, error: error.message };
  }
};

// إظهار إشعار محلي
export const showLocalNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/logo192.png',
      badge: '/logo192.png',
      ...options
    });

    // إغلاق الإشعار تلقائياً بعد 5 ثوان
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }
}; 