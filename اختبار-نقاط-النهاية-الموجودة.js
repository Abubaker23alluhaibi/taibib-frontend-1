// اختبار نقاط النهاية الموجودة - Tabib IQ
const API_URL = 'https://api.tabib-iq.com/api';

async function اختبارنقاطالنهايةالموجودة() {
  console.log('🔍 اختبار نقاط النهاية الموجودة...');
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
    } else {
      console.log('❌ نقطة نهاية الصحة لا تعمل:', healthResponse.status);
      return;
    }
    
    // اختبار 2: تجربة نقاط نهاية مختلفة للمستخدمين
    console.log('\n2️⃣ اختبار نقاط نهاية المستخدمين...');
    
    const userEndpoints = [
      '/users',
      '/api/users',
      '/admin/users',
      '/all-users',
      '/user',
      '/patients'
    ];
    
    for (const endpoint of userEndpoints) {
      console.log(`\n🔍 اختبار: ${endpoint}`);
      try {
        const response = await fetch(`${API_URL}${endpoint}`);
        console.log(`📊 الاستجابة: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ نجح! عدد المستخدمين: ${data.length || data.users?.length || 'غير محدد'}`);
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
    
    // اختبار 3: تجربة نقاط نهاية مختلفة للأطباء
    console.log('\n3️⃣ اختبار نقاط نهاية الأطباء...');
    
    const doctorEndpoints = [
      '/doctors',
      '/api/doctors',
      '/admin/doctors',
      '/all-doctors',
      '/doctor',
      '/physicians'
    ];
    
    for (const endpoint of doctorEndpoints) {
      console.log(`\n🔍 اختبار: ${endpoint}`);
      try {
        const response = await fetch(`${API_URL}${endpoint}`);
        console.log(`📊 الاستجابة: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ نجح! عدد الأطباء: ${data.length || data.doctors?.length || 'غير محدد'}`);
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
    
    // اختبار 4: تجربة نقاط نهاية مختلفة للمواعيد
    console.log('\n4️⃣ اختبار نقاط نهاية المواعيد...');
    
    const appointmentEndpoints = [
      '/appointments',
      '/api/appointments',
      '/admin/appointments',
      '/all-appointments',
      '/appointment',
      '/bookings'
    ];
    
    for (const endpoint of appointmentEndpoints) {
      console.log(`\n🔍 اختبار: ${endpoint}`);
      try {
        const response = await fetch(`${API_URL}${endpoint}`);
        console.log(`📊 الاستجابة: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ نجح! عدد المواعيد: ${data.length || data.appointments?.length || 'غير محدد'}`);
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
    
    // اختبار 5: تجربة نقاط نهاية مختلفة للمراكز الصحية
    console.log('\n5️⃣ اختبار نقاط نهاية المراكز الصحية...');
    
    const healthCenterEndpoints = [
      '/health-centers',
      '/api/health-centers',
      '/admin/health-centers',
      '/all-health-centers',
      '/health-center',
      '/clinics',
      '/hospitals'
    ];
    
    for (const endpoint of healthCenterEndpoints) {
      console.log(`\n🔍 اختبار: ${endpoint}`);
      try {
        const response = await fetch(`${API_URL}${endpoint}`);
        console.log(`📊 الاستجابة: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ نجح! عدد المراكز: ${data.length || data.healthCenters?.length || 'غير محدد'}`);
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
    
    console.log('\n🎉 تم الانتهاء من اختبار نقاط النهاية الموجودة!');
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

// تشغيل الاختبار
اختبارنقاطالنهايةالموجودة(); 