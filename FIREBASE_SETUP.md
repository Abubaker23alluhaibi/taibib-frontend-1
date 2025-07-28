# 🔥 إعداد Firebase لـ Tabib IQ

## 📋 المتطلبات

1. حساب Google
2. مشروع Firebase
3. تطبيق React

## 🚀 خطوات الإعداد

### 1. إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. انقر على "إنشاء مشروع"
3. أدخل اسم المشروع: `tabib-iq`
4. اختر "تمكين Google Analytics" (اختياري)
5. انقر على "إنشاء مشروع"

### 2. إضافة تطبيق الويب

1. في لوحة التحكم، انقر على أيقونة الويب `</>`
2. أدخل اسم التطبيق: `tabib-iq-web`
3. انقر على "تسجيل التطبيق"
4. انسخ كود التكوين

### 3. تحديث ملف التكوين

استبدل محتوى `src/firebase.js` بالتكوين الحقيقي:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "tabib-iq.firebaseapp.com",
  projectId: "tabib-iq",
  storageBucket: "tabib-iq.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
```

### 4. إعداد Authentication

1. في Firebase Console، اذهب إلى "Authentication"
2. انقر على "Get started"
3. في تبويب "Sign-in method"، فعّل:
   - Email/Password
   - Google (اختياري)
   - Phone (اختياري)

### 5. إعداد Firestore Database

1. اذهب إلى "Firestore Database"
2. انقر على "Create database"
3. اختر "Start in test mode"
4. اختر موقع قاعدة البيانات (الأقرب للمستخدمين)

### 6. إعداد Storage

1. اذهب إلى "Storage"
2. انقر على "Get started"
3. اختر "Start in test mode"
4. اختر موقع التخزين

### 7. إعداد Cloud Messaging (اختياري)

1. اذهب إلى "Project settings"
2. في تبويب "Cloud Messaging"
3. انسخ "Web Push certificates" (VAPID key)
4. استبدل `YOUR_VAPID_KEY` في `firebaseMessaging.js`

## 🔧 قواعد الأمان

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // المستخدمين
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // الأطباء
    match /doctors/{doctorId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == doctorId;
    }
    
    // المواعيد
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && 
        (resource.data.patientId == request.auth.uid || 
         resource.data.doctorId == request.auth.uid);
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // صور الملف الشخصي
    match /profile-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // صور الأطباء
    match /doctor-images/{doctorId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == doctorId;
    }
    
    // المستندات
    match /documents/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 استخدام الخدمات

### Authentication

```javascript
import { loginUser, registerUser } from './services/firebaseAuth';

// تسجيل الدخول
const result = await loginUser(email, password);

// التسجيل
const result = await registerUser(email, password, userData);
```

### Firestore

```javascript
import { createAppointment, getPatientAppointments } from './services/firebaseAppointments';

// إنشاء موعد
const result = await createAppointment(appointmentData);

// جلب مواعيد المريض
const result = await getPatientAppointments(patientId);
```

### Storage

```javascript
import { uploadProfileImage } from './services/firebaseStorage';

// رفع صورة الملف الشخصي
const result = await uploadProfileImage(file, userId);
```

### Messaging

```javascript
import { setupNotifications } from './services/firebaseMessaging';

// إعداد الإشعارات
const result = await setupNotifications(userId);
```

## 🔒 متغيرات البيئة

أضف هذه المتغيرات إلى ملف `.env`:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tabib-iq.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tabib-iq
REACT_APP_FIREBASE_STORAGE_BUCKET=tabib-iq.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key
```

## 🚀 النشر

1. تأكد من تحديث قواعد الأمان
2. اختبر جميع الوظائف محلياً
3. انشر التطبيق
4. راقب Firebase Console للأخطاء

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من Firebase Console
2. راجع سجلات الأخطاء
3. تأكد من صحة التكوين
4. تحقق من قواعد الأمان 