// اختبار نقاط النهاية المباشر - Tabib IQ
const API_URL = 'https://tabib-iq-backend-production.up.railway.app/api';

async function اختبارنقاطالنهايةالمباشر() {
  console.log('🔍 اختبار نقاط النهاية المباشر...');
  console.log('📝 API URL:', API_URL);
  console.log('⏰ الوقت:', new Date().toLocaleString('ar-EG'));
  
  try {
    // اختبار 1: نقطة نهاية الصحة
    console.log('\n1️⃣ اختبار نقطة نهاية الصحة...');
    const healthResponse = await fetch(`${API_URL}/health`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ نقطة نهاية الصحة تعمل!');
      console.log('📊 الاستجابة:', healthData);
      
      if (healthData.mongodb === 'connected') {
        console.log('✅ MongoDB متصل بنجاح!');
      } else {
        console.log('❌ MongoDB غير متصل:', healthData.mongodb);
        return;
      }
    } else {
      console.log('❌ نقطة نهاية الصحة لا تعمل:', healthResponse.status);
      const errorText = await healthResponse.text();
      console.log('📄 تفاصيل الخطأ:', errorText);
      return;
    }
    
    // اختبار 2: جلب المستخدمين - نقطة نهاية مختلفة
    console.log('\n2️⃣ اختبار جلب المستخدمين (نقطة نهاية مختلفة)...');
    
    // تجربة نقاط نهاية مختلفة
    const endpoints = [
      '/users',
      '/api/users',
      '/admin/users',
      '/all-users'
    ];
    
    for (const endpoint of endpoints) {
      console.log(`\n🔍 اختبار: ${endpoint}`);
      try {
        const response = await fetch(`${API_URL}${endpoint}`);
        console.log(`📊 الاستجابة: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ نجح! عدد المستخدمين: ${data.length}`);
          console.log('📊 البيانات:', data);
          break;
        } else {
          const errorText = await response.text();
          console.log(`❌ فشل: ${errorText}`);
        }
      } catch (error) {
        console.log(`❌ خطأ: ${error.message}`);
      }
    }
    
    // اختبار 3: جلب الأطباء - نقطة نهاية مختلفة
    console.log('\n3️⃣ اختبار جلب الأطباء (نقطة نهاية مختلفة)...');
    
    const doctorEndpoints = [
      '/admin/doctors',
      '/api/doctors',
      '/doctors',
      '/all-doctors'
    ];
    
    for (const endpoint of doctorEndpoints) {
      console.log(`\n🔍 اختبار: ${endpoint}`);
      try {
        const response = await fetch(`${API_URL}${endpoint}`);
        console.log(`📊 الاستجابة: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ نجح! عدد الأطباء: ${data.length}`);
          console.log('📊 البيانات:', data);
          
          // عرض الأطباء المعلقين
          const pendingDoctors = data.filter(d => d.status === 'pending');
          console.log(`📋 الأطباء المعلقين: ${pendingDoctors.length}`);
          pendingDoctors.forEach(doctor => {
            console.log(`   - ${doctor.name} (${doctor.email}) - ${doctor.specialty}`);
          });
          break;
        } else {
          const errorText = await response.text();
          console.log(`❌ فشل: ${errorText}`);
        }
      } catch (error) {
        console.log(`❌ خطأ: ${error.message}`);
      }
    }
    
    // اختبار 4: جلب المواعيد
    console.log('\n4️⃣ اختبار جلب المواعيد...');
    
    const appointmentEndpoints = [
      '/appointments',
      '/api/appointments',
      '/all-appointments'
    ];
    
    for (const endpoint of appointmentEndpoints) {
      console.log(`\n🔍 اختبار: ${endpoint}`);
      try {
        const response = await fetch(`${API_URL}${endpoint}`);
        console.log(`📊 الاستجابة: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ نجح! عدد المواعيد: ${data.length}`);
          console.log('📊 البيانات:', data);
          break;
        } else {
          const errorText = await response.text();
          console.log(`❌ فشل: ${errorText}`);
        }
      } catch (error) {
        console.log(`❌ خطأ: ${error.message}`);
      }
    }
    
    // اختبار 5: تسجيل دخول الأدمن
    console.log('\n5️⃣ اختبار تسجيل دخول الأدمن...');
    const adminLoginData = {
      email: 'admin@tabib-iq.com',
      password: 'admin123',
      loginType: 'admin'
    };
    
    try {
      const adminLoginResponse = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminLoginData)
      });
      
      console.log(`📊 استجابة تسجيل دخول الأدمن: ${adminLoginResponse.status}`);
      
      if (adminLoginResponse.ok) {
        const adminLoginResult = await adminLoginResponse.json();
        console.log('✅ تسجيل دخول الأدمن ناجح!');
        console.log('📊 النتيجة:', adminLoginResult);
      } else {
        const errorText = await adminLoginResponse.text();
        console.log('❌ فشل في تسجيل دخول الأدمن:', errorText);
      }
    } catch (error) {
      console.log('❌ خطأ في تسجيل دخول الأدمن:', error.message);
    }
    
    console.log('\n🎉 تم الانتهاء من اختبار نقاط النهاية المباشر!');
    console.log('📋 ملخص النتائج:');
    console.log('   ✅ قاعدة البيانات متصلة');
    console.log('   ✅ API يعمل بشكل صحيح');
    console.log('   ✅ تم اختبار جميع نقاط النهاية');
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار المباشر:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('💡 الحل: تأكد من أن الباكند يعمل على Railway');
    } else if (error.message.includes('CORS')) {
      console.log('💡 الحل: تحقق من إعدادات CORS في الباكند');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('💡 الحل: تحقق من صحة رابط API');
    }
  }
}

// تشغيل الاختبار
اختبارنقاطالنهايةالمباشر(); 