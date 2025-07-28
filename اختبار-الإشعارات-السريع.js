// اختبار سريع للإشعارات - Tabib IQ
const API_URL = 'https://tabib-iq-backend-production.up.railway.app';

async function اختبارالإشعارات() {
  console.log('🔍 اختبار الإشعارات...');
  console.log('📝 API URL:', API_URL);
  
  try {
    // اختبار 1: جلب جميع الإشعارات
    console.log('\n1️⃣ اختبار جلب جميع الإشعارات...');
    const allNotificationsResponse = await fetch(`${API_URL}/notifications`);
    
    if (allNotificationsResponse.ok) {
      const allNotifications = await allNotificationsResponse.json();
      console.log('✅ تم جلب جميع الإشعارات:', allNotifications.length);
      console.log('📊 الإشعارات الموجودة:', allNotifications);
    } else {
      console.log('❌ فشل في جلب جميع الإشعارات:', allNotificationsResponse.status);
      const errorText = await allNotificationsResponse.text();
      console.log('📄 تفاصيل الخطأ:', errorText);
    }
    
    // اختبار 2: جلب إشعارات الدكتور المحدد
    console.log('\n2️⃣ اختبار جلب إشعارات الدكتور...');
    const doctorId = '688792c244dd6c861f1a5d22'; // استبدل بمعرف الطبيب الحقيقي
    const doctorNotificationsResponse = await fetch(`${API_URL}/notifications?doctorId=${doctorId}`);
    
    if (doctorNotificationsResponse.ok) {
      const doctorNotifications = await doctorNotificationsResponse.json();
      console.log('✅ تم جلب إشعارات الطبيب:', doctorNotifications.length);
      console.log('📊 إشعارات الطبيب:', doctorNotifications);
    } else {
      console.log('❌ فشل في جلب إشعارات الطبيب:', doctorNotificationsResponse.status);
      const errorText = await doctorNotificationsResponse.text();
      console.log('📄 تفاصيل الخطأ:', errorText);
    }
    
    // اختبار 3: إنشاء إشعار تجريبي للطبيب
    console.log('\n3️⃣ اختبار إنشاء إشعار تجريبي للطبيب...');
    const createNotificationResponse = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '688792c244dd6c861f1a5d22',
        doctorId: '688792c244dd6c861f1a5d22',
        title: 'اختبار إشعار',
        message: 'هذا إشعار تجريبي للاختبار',
        type: 'appointment'
      })
    });
    
    if (createNotificationResponse.ok) {
      const newNotification = await createNotificationResponse.json();
      console.log('✅ تم إنشاء الإشعار التجريبي بنجاح!');
      console.log('📊 الإشعار الجديد:', newNotification);
    } else {
      console.log('❌ فشل في إنشاء الإشعار التجريبي:', createNotificationResponse.status);
      const errorText = await createNotificationResponse.text();
      console.log('📄 تفاصيل الخطأ:', errorText);
    }
    
    // اختبار 4: تحديد الإشعارات كمقروءة
    console.log('\n4️⃣ اختبار تحديد الإشعارات كمقروءة...');
    const markReadResponse = await fetch(`${API_URL}/notifications/mark-read?doctorId=${doctorId}`, {
      method: 'PUT'
    });
    
    if (markReadResponse.ok) {
      const markReadResult = await markReadResponse.json();
      console.log('✅ تم تحديد الإشعارات كمقروءة بنجاح!');
      console.log('📊 النتيجة:', markReadResult);
    } else {
      console.log('❌ فشل في تحديد الإشعارات كمقروءة:', markReadResponse.status);
      const errorText = await markReadResponse.text();
      console.log('📄 تفاصيل الخطأ:', errorText);
    }
    
  } catch (error) {
    console.error('❌ خطأ في اختبار الإشعارات:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('💡 المشكلة: الباكند لا يعمل على Railway');
      console.log('🔧 الحل: تحقق من Railway Dashboard');
    } else if (error.message.includes('CORS')) {
      console.log('💡 المشكلة: مشكلة في CORS');
    }
  }
}

// تشغيل الاختبار
اختبارالإشعارات(); 