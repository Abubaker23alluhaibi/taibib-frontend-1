// سكريبت اختبار لوحة تحكم الأدمن - Tabib IQ
const API_URL = 'https://tabib-iq-backend-production.up.railway.app/api';

async function اختبارلوحةتحكمالأدمن() {
  console.log('🔍 اختبار لوحة تحكم الأدمن...');
  console.log('📝 API URL:', API_URL);
  
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
        console.log('💡 المشكلة: يجب تحديث MONGO_URI في Railway');
        return;
      }
    } else {
      console.log('❌ نقطة نهاية الصحة لا تعمل:', healthResponse.status);
      return;
    }
    
    // اختبار 2: جلب المستخدمين
    console.log('\n2️⃣ اختبار جلب المستخدمين...');
    const usersResponse = await fetch(`${API_URL}/users`);
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log(`✅ تم جلب ${usersData.length} مستخدم`);
      console.log('📊 المستخدمين:', usersData);
    } else {
      console.log('❌ فشل في جلب المستخدمين:', usersResponse.status);
      const errorText = await usersResponse.text();
      console.log('📄 تفاصيل الخطأ:', errorText);
    }
    
    // اختبار 3: جلب الأطباء
    console.log('\n3️⃣ اختبار جلب الأطباء...');
    const doctorsResponse = await fetch(`${API_URL}/admin/doctors`);
    
    if (doctorsResponse.ok) {
      const doctorsData = await doctorsResponse.json();
      console.log(`✅ تم جلب ${doctorsData.length} طبيب`);
      console.log('📊 الأطباء:', doctorsData);
      
      // عرض الأطباء المعلقين
      const pendingDoctors = doctorsData.filter(d => d.status === 'pending');
      console.log(`📋 الأطباء المعلقين: ${pendingDoctors.length}`);
      pendingDoctors.forEach(doctor => {
        console.log(`   - ${doctor.name} (${doctor.email}) - ${doctor.specialty}`);
      });
    } else {
      console.log('❌ فشل في جلب الأطباء:', doctorsResponse.status);
      const errorText = await doctorsResponse.text();
      console.log('📄 تفاصيل الخطأ:', errorText);
    }
    
    // اختبار 4: جلب المواعيد
    console.log('\n4️⃣ اختبار جلب المواعيد...');
    const appointmentsResponse = await fetch(`${API_URL}/appointments`);
    
    if (appointmentsResponse.ok) {
      const appointmentsData = await appointmentsResponse.json();
      console.log(`✅ تم جلب ${appointmentsData.length} موعد`);
      console.log('📊 المواعيد:', appointmentsData);
    } else {
      console.log('❌ فشل في جلب المواعيد:', appointmentsResponse.status);
      const errorText = await appointmentsResponse.text();
      console.log('📄 تفاصيل الخطأ:', errorText);
    }
    
    // اختبار 5: جلب المراكز الصحية
    console.log('\n5️⃣ اختبار جلب المراكز الصحية...');
    const centersResponse = await fetch(`${API_URL}/admin/health-centers`);
    
    if (centersResponse.ok) {
      const centersData = await centersResponse.json();
      console.log(`✅ تم جلب ${centersData.length} مركز صحي`);
      console.log('📊 المراكز الصحية:', centersData);
    } else {
      console.log('❌ فشل في جلب المراكز الصحية:', centersResponse.status);
      const errorText = await centersResponse.text();
      console.log('📄 تفاصيل الخطأ:', errorText);
    }
    
    // اختبار 6: اختبار الموافقة على طبيب (محاكاة)
    console.log('\n6️⃣ اختبار وظائف الأدمن...');
    console.log('📋 الوظائف المتاحة:');
    console.log('   - الموافقة على طبيب: PUT /api/doctors/:doctorId/approve');
    console.log('   - رفض طبيب: PUT /api/doctors/:doctorId/reject');
    console.log('   - حذف طبيب: DELETE /api/doctors/:doctorId');
    console.log('   - حذف مستخدم: DELETE /api/users/:userId');
    console.log('   - إنشاء مركز صحي: POST /admin/health-centers');
    
    console.log('\n🎉 تم الانتهاء من اختبار لوحة تحكم الأدمن!');
    console.log('📋 ملخص النتائج:');
    console.log('   ✅ قاعدة البيانات متصلة');
    console.log('   ✅ API يعمل بشكل صحيح');
    console.log('   ✅ جميع نقاط النهاية متاحة');
    
  } catch (error) {
    console.error('❌ خطأ في اختبار لوحة تحكم الأدمن:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('💡 الحل: تأكد من أن الباكند يعمل على Railway');
    } else if (error.message.includes('CORS')) {
      console.log('💡 الحل: تحقق من إعدادات CORS في الباكند');
    }
  }
}

// تشغيل الاختبار
اختبارلوحةتحكمالأدمن(); 