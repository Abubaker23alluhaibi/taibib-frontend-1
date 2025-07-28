// سكريبت اختبار الاتصال بقاعدة البيانات الجديدة على MongoDB Atlas
const { MongoClient } = require('mongodb');

const ATLAS_URI = 'mongodb+srv://abubaker:Baker123@cluster0.kamrxrt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function اختباراتصالAtlas() {
  console.log('🔍 اختبار الاتصال بقاعدة البيانات الجديدة (MongoDB Atlas)...');
  console.log('📝 Atlas URI:', ATLAS_URI.replace(/\/\/.*@/, '//***:***@')); // إخفاء بيانات الاعتماد
  
  let client;
  
  try {
    // الاتصال بقاعدة البيانات
    console.log('📡 محاولة الاتصال...');
    client = new MongoClient(ATLAS_URI);
    await client.connect();
    console.log('✅ تم الاتصال بنجاح!');
    
    // اختبار قاعدة البيانات
    const db = client.db('tabibiq');
    console.log('📊 قاعدة البيانات: tabibiq');
    
    // قائمة المجموعات
    console.log('\n📋 المجموعات الموجودة:');
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('   ⚠️ لا توجد مجموعات في قاعدة البيانات');
    } else {
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`   ${collection.name}: ${count} مستند`);
      }
    }
    
    // اختبار العمليات الأساسية
    console.log('\n🧪 اختبار العمليات الأساسية...');
    
    // اختبار الإدراج
    const testCollection = db.collection('test_connection');
    const testDoc = { 
      message: 'اختبار الاتصال', 
      timestamp: new Date(),
      test: true 
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ اختبار الإدراج: نجح');
    
    // اختبار القراءة
    const readResult = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('✅ اختبار القراءة: نجح');
    
    // اختبار التحديث
    const updateResult = await testCollection.updateOne(
      { _id: insertResult.insertedId },
      { $set: { updated: true } }
    );
    console.log('✅ اختبار التحديث: نجح');
    
    // اختبار الحذف
    const deleteResult = await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ اختبار الحذف: نجح');
    
    console.log('\n🎉 جميع الاختبارات نجحت! قاعدة البيانات جاهزة للاستخدام');
    
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 الحل: تأكد من صحة رابط الاتصال واتصال الإنترنت');
    } else if (error.message.includes('Authentication failed')) {
      console.log('💡 الحل: تأكد من صحة اسم المستخدم وكلمة المرور');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 الحل: تأكد من أن السيرفر متاح وأن IP مضاف في whitelist');
    }
    
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 تم إغلاق الاتصال');
    }
  }
}

// تشغيل الاختبار
اختباراتصالAtlas().catch(console.error); 