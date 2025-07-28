// اختبار سريع للباكند - Tabib IQ
const API_URL = 'https://tabib-iq-backend-production.up.railway.app';

async function اختبارالباكند() {
  console.log('🔍 اختبار الباكند...');
  console.log('📝 API URL:', API_URL);
  
  try {
    // اختبار 1: نقطة نهاية الصحة
    console.log('\n1️⃣ اختبار نقطة نهاية الصحة...');
    const healthResponse = await fetch(`${API_URL}/api/health`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ نقطة نهاية الصحة تعمل!');
      console.log('📊 الاستجابة:', healthData);
    } else {
      console.log('❌ نقطة نهاية الصحة لا تعمل:', healthResponse.status);
      const errorText = await healthResponse.text();
      console.log('📄 تفاصيل الخطأ:', errorText);
    }
    
    // اختبار 2: نقطة نهاية الإشعارات
    console.log('\n2️⃣ اختبار نقطة نهاية الإشعارات...');
    const notificationsResponse = await fetch(`${API_URL}/notifications`);
    
    if (notificationsResponse.ok) {
      const notificationsData = await notificationsResponse.json();
      console.log('✅ نقطة نهاية الإشعارات تعمل!');
      console.log('📊 عدد الإشعارات:', notificationsData.length);
    } else {
      console.log('❌ نقطة نهاية الإشعارات لا تعمل:', notificationsResponse.status);
      const errorText = await notificationsResponse.text();
      console.log('📄 تفاصيل الخطأ:', errorText);
    }
    
    // اختبار 3: إنشاء إشعار تجريبي
    console.log('\n3️⃣ اختبار إنشاء إشعار تجريبي...');
    const createNotificationResponse = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '507f1f77bcf86cd799439011',
        doctorId: '507f1f77bcf86cd799439012',
        title: 'اختبار إشعار',
        message: 'هذا إشعار تجريبي للاختبار',
        type: 'appointment'
      })
    });
    
    if (createNotificationResponse.ok) {
      const notificationData = await createNotificationResponse.json();
      console.log('✅ تم إنشاء الإشعار التجريبي بنجاح!');
      console.log('📊 بيانات الإشعار:', notificationData);
    } else {
      console.log('❌ فشل في إنشاء الإشعار التجريبي:', createNotificationResponse.status);
      const errorText = await createNotificationResponse.text();
      console.log('📄 تفاصيل الخطأ:', errorText);
    }
    
  } catch (error) {
    console.error('❌ خطأ في اختبار الباكند:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('💡 المشكلة: الباكند لا يعمل على Railway');
      console.log('🔧 الحل: تحقق من Railway Dashboard');
    } else if (error.message.includes('CORS')) {
      console.log('💡 المشكلة: مشكلة في CORS');
    }
  }
}

// تشغيل الاختبار
اختبارالباكند(); 