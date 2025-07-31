# متغيرات البيئة للفرونت إند - Tabib IQ

## 🔧 المتغيرات المطلوبة

### المتغير الأساسي
```env
REACT_APP_API_URL=https://tabib-iq-backend-production.up.railway.app
```

## 📋 كيفية الإعداد

### 1. للتطوير المحلي
أنشئ ملف `.env.local` في مجلد `tabib-iq-frontend-1`:
```env
REACT_APP_API_URL=https://tabib-iq-backend-production.up.railway.app
```

### 2. للإنتاج (Vercel)
تم تحديث `vercel.json` بالفعل:
```json
{
  "env": {
    "REACT_APP_API_URL": "https://tabib-iq-backend-production.up.railway.app",
    "REACT_APP_ENV": "production"
  }
}
```

### 3. للإنتاج (Netlify)
تم تحديث `netlify.toml` بالفعل:
```toml
[build.environment]
  REACT_APP_API_URL = "https://tabib-iq-backend-production.up.railway.app"
  REACT_APP_ENV = "production"
```

### 4. للإنتاج (Railway)
أضف المتغير في Railway Dashboard:
- `REACT_APP_API_URL` = `https://tabib-iq-backend-production.up.railway.app`

## 🌐 روابط الخادم

### الخادم الرئيسي (Railway)
```
https://tabib-iq-backend-production.up.railway.app
```

### النقاط النهائية المتاحة
- `https://tabib-iq-backend-production.up.railway.app/` - الصفحة الرئيسية
- `https://tabib-iq-backend-production.up.railway.app/api/health` - فحص الصحة
- `https://tabib-iq-backend-production.up.railway.app/api/auth/login` - تسجيل الدخول
- `https://tabib-iq-backend-production.up.railway.app/api/doctors` - قائمة الأطباء

## 🔄 Fallback URLs

الفرونت إند يحتوي على fallback URLs في حالة فشل الاتصال:
```javascript
const apiUrls = [
  process.env.REACT_APP_API_URL,
  'https://api.tabib-iq.com/api',
  'https://taibib-bckend-1-production.up.railway.app/api',
  'http://localhost:5000/api'
].filter(Boolean);
```

## 🚀 كيفية التشغيل

### التطوير المحلي
```bash
cd tabib-iq-frontend-1
npm install
npm start
```

### البناء للإنتاج
```bash
npm run build
```

## 📝 ملاحظات مهمة

1. **REACT_APP_** يجب أن يبدأ اسم المتغير بـ `REACT_APP_` في React
2. **إعادة تشغيل** يجب إعادة تشغيل الخادم بعد تغيير المتغيرات
3. **CORS** الخادم يدعم CORS للفرونت إند
4. **HTTPS** جميع الروابط تستخدم HTTPS للإنتاج

## 🔍 اختبار الاتصال

يمكنك اختبار الاتصال من الفرونت إند:
```javascript
fetch('https://tabib-iq-backend-production.up.railway.app/api/health')
  .then(response => response.json())
  .then(data => console.log('Server Status:', data));
``` 