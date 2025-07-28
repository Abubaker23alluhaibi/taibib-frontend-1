// سكريبت نقل البيانات من قاعدة البيانات المحلية إلى MongoDB Atlas
const { MongoClient } = require('mongodb');

// روابط الاتصال
const LOCAL_URI = 'mongodb://localhost:27017/tabibiq';
const ATLAS_URI = 'mongodb+srv://abubaker:Baker123@cluster0.kamrxrt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// أسماء المجموعات (Collections) التي سيتم نقلها
const COLLECTIONS = [
  'users',
  'doctors', 
  'appointments',
  'healthcenters',
  'medicine_reminders',
  'special_appointments',
  'admin_users',
  'center_users'
];

async function نقلالبيانات() {
  console.log('🚀 بدء عملية نقل البيانات...');
  
  let localClient, atlasClient;
  
  try {
    // الاتصال بقاعدة البيانات المحلية
    console.log('📡 الاتصال بقاعدة البيانات المحلية...');
    localClient = new MongoClient(LOCAL_URI);
    await localClient.connect();
    console.log('✅ تم الاتصال بقاعدة البيانات المحلية');
    
    // الاتصال بقاعدة البيانات الجديدة
    console.log('📡 الاتصال بقاعدة البيانات الجديدة (Atlas)...');
    atlasClient = new MongoClient(ATLAS_URI);
    await atlasClient.connect();
    console.log('✅ تم الاتصال بقاعدة البيانات الجديدة');
    
    const localDb = localClient.db('tabibiq');
    const atlasDb = atlasClient.db('tabibiq'); // نفس اسم قاعدة البيانات
    
    let totalTransferred = 0;
    
    // نقل كل مجموعة
    for (const collectionName of COLLECTIONS) {
      console.log(`\n🔄 نقل مجموعة: ${collectionName}`);
      
      try {
        const localCollection = localDb.collection(collectionName);
        const atlasCollection = atlasDb.collection(collectionName);
        
        // التحقق من وجود المجموعة في قاعدة البيانات المحلية
        const count = await localCollection.countDocuments();
        
        if (count === 0) {
          console.log(`⚠️ المجموعة ${collectionName} فارغة أو غير موجودة`);
          continue;
        }
        
        console.log(`📊 عدد المستندات في ${collectionName}: ${count}`);
        
        // جلب جميع المستندات
        const documents = await localCollection.find({}).toArray();
        
        if (documents.length > 0) {
          // حذف المجموعة الموجودة في Atlas (إذا كانت موجودة)
          await atlasCollection.drop().catch(() => {
            console.log(`ℹ️ المجموعة ${collectionName} غير موجودة في Atlas`);
          });
          
          // إدراج المستندات في Atlas
          const result = await atlasCollection.insertMany(documents);
          console.log(`✅ تم نقل ${result.insertedCount} مستند من ${collectionName}`);
          totalTransferred += result.insertedCount;
        } else {
          console.log(`ℹ️ لا توجد مستندات في ${collectionName}`);
        }
        
      } catch (error) {
        console.error(`❌ خطأ في نقل ${collectionName}:`, error.message);
      }
    }
    
    console.log(`\n🎉 تم الانتهاء من نقل البيانات!`);
    console.log(`📊 إجمالي المستندات المنقولة: ${totalTransferred}`);
    
    // عرض إحصائيات نهائية
    console.log('\n📋 إحصائيات نهائية:');
    for (const collectionName of COLLECTIONS) {
      try {
        const count = await atlasDb.collection(collectionName).countDocuments();
        console.log(`   ${collectionName}: ${count} مستند`);
      } catch (error) {
        console.log(`   ${collectionName}: 0 مستند (خطأ في العد)`);
      }
    }
    
  } catch (error) {
    console.error('❌ خطأ في عملية النقل:', error);
  } finally {
    // إغلاق الاتصالات
    if (localClient) {
      await localClient.close();
      console.log('🔒 تم إغلاق الاتصال بقاعدة البيانات المحلية');
    }
    if (atlasClient) {
      await atlasClient.close();
      console.log('🔒 تم إغلاق الاتصال بقاعدة البيانات الجديدة');
    }
  }
}

// تشغيل السكريبت
نقلالبيانات().catch(console.error); 