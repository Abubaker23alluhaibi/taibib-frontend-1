# Tabib IQ Frontend

تطبيق React.js لمنصة الاستشارات الطبية Tabib IQ

## 🚀 النشر

### على Netlify
1. اربط المشروع بـ GitHub
2. استخدم إعدادات البناء التالية:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables:
     - `REACT_APP_API_URL`: `https://tabib-iq-backend-production.up.railway.app/api`
     - `REACT_APP_ENV`: `production`

### على Vercel
1. اربط المشروع بـ GitHub
2. سيتم التعرف على المشروع تلقائياً كـ Create React App
3. إضافة Environment Variables:
   - `REACT_APP_API_URL`: `https://tabib-iq-backend-production.up.railway.app/api`
   - `REACT_APP_ENV`: `production`

## 🌐 Domain
الموقع منشور على: `https://tabib-iq.com`

## 🔧 التطوير المحلي
```bash
npm install
npm start
```

## 📦 المتطلبات
- Node.js >= 18.0.0
- npm >= 8.0.0 