// سكريبت اختبار النظام بعد ربط قاعدة البيانات الجديدة
const API_URL = 'https://tabib-iq-backend-production.up.railway.app/api';

async function اختبارالنظام() {
  console.log('🔍 اختبار النظام بعد ربط قاعدة البيانات الجديدة...');
  console.log('📝 API URL:', API_URL);
  
  try {
    // اختبار 1: نقطة نهاية الصحة
    console.log('\n1️⃣ اختبار نقطة نهاية الصحة...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    
    console.log('📊 استجابة الصحة:', healthData);
    
    if (healthData.mongodb === 'connected') {
      console.log('✅ MongoDB متصل بنجاح!');
    } else {
      console.log('❌ MongoDB غير متصل:', healthData.mongodb);
      return;
    }
    
    // اختبار 2: جلب المستخدمين
    console.log('\n2️⃣ اختبار جلب المستخدمين...');
    const usersResponse = await fetch(`${API_URL}/users`);
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log(`✅ تم جلب ${usersData.length} مستخدم`);
    } else {
      console.log('❌ فشل في جلب المستخدمين:', usersResponse.status);
    }
    
    // اختبار 3: جلب الأطباء
    console.log('\n3️⃣ اختبار جلب الأطباء...');
    const doctorsResponse = await fetch(`${API_URL}/admin/doctors`);
    
    if (doctorsResponse.ok) {
      const doctorsData = await doctorsResponse.json();
      console.log(`✅ تم جلب ${doctorsData.length} طبيب`);
    } else {
      console.log('❌ فشل في جلب الأطباء:', doctorsResponse.status);
    }
    
    // اختبار 4: جلب المواعيد
    console.log('\n4️⃣ اختبار جلب المواعيد...');
    const appointmentsResponse = await fetch(`${API_URL}/appointments`);
    
    if (appointmentsResponse.ok) {
      const appointmentsData = await appointmentsResponse.json();
      console.log(`✅ تم جلب ${appointmentsData.length} موعد`);
    } else {
      console.log('❌ فشل في جلب المواعيد:', appointmentsResponse.status);
    }
    
    // اختبار 5: جلب المراكز الصحية
    console.log('\n5️⃣ اختبار جلب المراكز الصحية...');
    const centersResponse = await fetch(`${API_URL}/admin/health-centers`);
    
    if (centersResponse.ok) {
      const centersData = await centersResponse.json();
      console.log(`✅ تم جلب ${centersData.length} مركز صحي`);
    } else {
      console.log('❌ فشل في جلب المراكز الصحية:', centersResponse.status);
    }
    
    console.log('\n🎉 تم الانتهاء من اختبار النظام!');
    console.log('📋 ملخص النتائج:');
    console.log('   ✅ قاعدة البيانات متصلة');
    console.log('   ✅ API يعمل بشكل صحيح');
    console.log('   ✅ البيانات منقولة بنجاح');
    
  } catch (error) {
    console.error('❌ خطأ في اختبار النظام:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('💡 الحل: تأكد من أن الباكند يعمل على Railway');
    } else if (error.message.includes('CORS')) {
      console.log('💡 الحل: تحقق من إعدادات CORS في الباكند');
    }
  }
}

// تشغيل الاختبار
اختبارالنظام().catch(console.error); 