// سكريبت فحص قاعدة البيانات المحلية للبحث عن جميع المجموعات
const { MongoClient } = require('mongodb');

const LOCAL_URI = 'mongodb://localhost:27017/tabibiq';

async function فحصقاعدةالبياناتالمحلية() {
  console.log('🔍 فحص قاعدة البيانات المحلية...');
  console.log('📝 Local URI:', LOCAL_URI);
  
  let client;
  
  try {
    // الاتصال بقاعدة البيانات المحلية
    console.log('📡 الاتصال بقاعدة البيانات المحلية...');
    client = new MongoClient(LOCAL_URI);
    await client.connect();
    console.log('✅ تم الاتصال بقاعدة البيانات المحلية');
    
    const db = client.db('tabibiq');
    
    // قائمة جميع المجموعات
    console.log('\n📋 جميع المجموعات الموجودة في قاعدة البيانات المحلية:');
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('   ⚠️ لا توجد مجموعات في قاعدة البيانات المحلية');
      return;
    }
    
    // عرض تفاصيل كل مجموعة
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`   📊 ${collection.name}: ${count} مستند`);
      
      // عرض عينة من البيانات (أول 3 مستندات)
      if (count > 0) {
        const sample = await db.collection(collection.name).find({}).limit(3).toArray();
        console.log(`      عينة من البيانات:`);
        sample.forEach((doc, index) => {
          console.log(`        ${index + 1}. ${JSON.stringify(doc, null, 2).substring(0, 200)}...`);
        });
      }
      console.log('');
    }
    
    // البحث عن مجموعات قد تكون بأسماء مختلفة
    console.log('🔍 البحث عن مجموعات إضافية...');
    const possibleCollections = [
      'appointments',
      'healthcenters', 
      'health_centers',
      'medicine_reminders',
      'medicine_reminder',
      'special_appointments',
      'special_appointment',
      'admin_users',
      'admin',
      'admins',
      'center_users',
      'centers',
      'featured_doctors',
      'featureddoctors',
      'messages',
      'notifications',
      'notification',
      'reviews',
      'ratings',
      'schedules',
      'schedule',
      'working_hours',
      'workinghours',
      'services',
      'specialties',
      'specialty'
    ];
    
    console.log('\n🔍 فحص المجموعات المحتملة:');
    for (const collectionName of possibleCollections) {
      try {
        const count = await db.collection(collectionName).countDocuments();
        if (count > 0) {
          console.log(`   ✅ ${collectionName}: ${count} مستند`);
        }
      } catch (error) {
        // المجموعة غير موجودة
      }
    }
    
  } catch (error) {
    console.error('❌ خطأ في فحص قاعدة البيانات المحلية:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 الحل: تأكد من تشغيل MongoDB المحلي');
    }
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 تم إغلاق الاتصال بقاعدة البيانات المحلية');
    }
  }
}

// تشغيل الفحص
فحصقاعدةالبياناتالمحلية().catch(console.error); 