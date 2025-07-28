// سكريبت نقل البيانات المحدث - ينقل جميع المجموعات الموجودة
const { MongoClient } = require('mongodb');

// روابط الاتصال
const LOCAL_URI = 'mongodb://localhost:27017/tabibiq';
const ATLAS_URI = 'mongodb+srv://abubaker:Baker123@cluster0.kamrxrt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function نقلالبياناتالمحدث() {
  console.log('🚀 بدء عملية نقل البيانات المحدثة...');
  
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
    const atlasDb = atlasClient.db('tabibiq');
    
    // الحصول على جميع المجموعات الموجودة في قاعدة البيانات المحلية
    console.log('\n🔍 البحث عن جميع المجموعات في قاعدة البيانات المحلية...');
    const collections = await localDb.listCollections().toArray();
    
    console.log(`📋 تم العثور على ${collections.length} مجموعة:`);
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    let totalTransferred = 0;
    
    // نقل كل مجموعة موجودة
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`\n🔄 نقل مجموعة: ${collectionName}`);
      
      try {
        const localCollection = localDb.collection(collectionName);
        const atlasCollection = atlasDb.collection(collectionName);
        
        // التحقق من عدد المستندات
        const count = await localCollection.countDocuments();
        
        if (count === 0) {
          console.log(`   ⚠️ المجموعة ${collectionName} فارغة`);
          continue;
        }
        
        console.log(`   📊 عدد المستندات في ${collectionName}: ${count}`);
        
        // جلب جميع المستندات
        const documents = await localCollection.find({}).toArray();
        
        if (documents.length > 0) {
          // حذف المجموعة الموجودة في Atlas (إذا كانت موجودة)
          await atlasCollection.drop().catch(() => {
            console.log(`   ℹ️ المجموعة ${collectionName} غير موجودة في Atlas`);
          });
          
          // إدراج المستندات في Atlas
          const result = await atlasCollection.insertMany(documents);
          console.log(`   ✅ تم نقل ${result.insertedCount} مستند من ${collectionName}`);
          totalTransferred += result.insertedCount;
          
          // عرض عينة من البيانات المنقولة
          console.log(`   📝 عينة من البيانات المنقولة:`);
          documents.slice(0, 2).forEach((doc, index) => {
            const docStr = JSON.stringify(doc, null, 2);
            console.log(`      ${index + 1}. ${docStr.substring(0, 150)}...`);
          });
        } else {
          console.log(`   ℹ️ لا توجد مستندات في ${collectionName}`);
        }
        
      } catch (error) {
        console.error(`   ❌ خطأ في نقل ${collectionName}:`, error.message);
      }
    }
    
    console.log(`\n🎉 تم الانتهاء من نقل البيانات!`);
    console.log(`📊 إجمالي المستندات المنقولة: ${totalTransferred}`);
    
    // عرض إحصائيات نهائية
    console.log('\n📋 إحصائيات نهائية في قاعدة البيانات الجديدة:');
    for (const collection of collections) {
      try {
        const count = await atlasDb.collection(collection.name).countDocuments();
        console.log(`   ${collection.name}: ${count} مستند`);
      } catch (error) {
        console.log(`   ${collection.name}: 0 مستند (خطأ في العد)`);
      }
    }
    
    // اختبار الاتصال بقاعدة البيانات الجديدة
    console.log('\n🧪 اختبار الاتصال بقاعدة البيانات الجديدة...');
    const testCollection = atlasDb.collection('test_transfer');
    const testDoc = { 
      message: 'اختبار بعد نقل البيانات', 
      timestamp: new Date(),
      test: true 
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ اختبار الإدراج: نجح');
    
    const readResult = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('✅ اختبار القراءة: نجح');
    
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ اختبار الحذف: نجح');
    
    console.log('\n🎉 جميع الاختبارات نجحت! قاعدة البيانات جاهزة للاستخدام');
    
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
نقلالبياناتالمحدث().catch(console.error); 