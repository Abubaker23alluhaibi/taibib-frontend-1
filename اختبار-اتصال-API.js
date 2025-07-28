// سكريبت اختبار اتصال API للواجهة الأمامية
const API_URL = process.env.REACT_APP_API_URL || 'https://tabib-iq-backend-production.up.railway.app/api';

async function اختباراتصالAPI() {
  console.log('🔍 اختبار اتصال API للواجهة الأمامية...');
  console.log('📝 API URL:', API_URL);
  
  try {
    console.log('🔄 اختبار نقطة نهاية الصحة...');
    
    // اختبار نقطة نهاية الصحة
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    
    console.log('✅ نقطة نهاية الصحة تعمل!');
    console.log('📊 الاستجابة:', healthData);
    
    if (healthData.mongodb === 'connected') {
      console.log('✅ MongoDB متصل بنجاح!');
    } else {
      console.log('⚠️ MongoDB غير متصل:', healthData.mongodb);
    }
    
    // اختبار نقطة نهاية الجذر
    console.log('🔄 اختبار نقطة نهاية الجذر...');
    const rootResponse = await fetch(API_URL.replace('/api', ''));
    const rootData = await rootResponse.json();
    
    console.log('✅ نقطة نهاية الجذر تعمل!');
    console.log('📊 الاستجابة:', rootData);
    
    console.log('🎉 جميع الاختبارات نجحت!');
    
  } catch (error) {
    console.error('❌ فشل في اختبار الاتصال!');
    console.error('❌ رسالة الخطأ:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n🔍 استكشاف أخطاء الاتصال:');
      console.log('1. تحقق من أن الخادم يعمل على Railway');
      console.log('2. تحقق من صحة URL في متغيرات البيئة');
      console.log('3. تحقق من إعدادات CORS في الخادم');
      console.log('4. تحقق من اتصال الإنترنت');
    }
    
    console.log('\n💡 تأكد من أن:');
    console.log('- الخادم يعمل على Railway');
    console.log('- REACT_APP_API_URL صحيح');
    console.log('- لا توجد مشاكل في CORS');
  }
}

// تشغيل الاختبار إذا كان في بيئة Node.js
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  اختباراتصالAPI().catch(console.error);
} else {
  // Browser environment
  console.log('🌐 تشغيل في المتصفح - استخدم وحدة تحكم المتصفح لاختبار الاتصال');
  window.اختباراتصالAPI = اختباراتصالAPI;
} 