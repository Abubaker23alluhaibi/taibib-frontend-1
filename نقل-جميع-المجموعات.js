// سكريبت نقل جميع المجموعات من قاعدة البيانات المحلية إلى Atlas
const { MongoClient } = require('mongodb');

// روابط الاتصال
const LOCAL_URI = 'mongodb://localhost:27017/tabibiq';
const ATLAS_URI = 'mongodb+srv://abubaker:Baker123@cluster0.kamrxrt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function نقلجميعالمجموعات() {
  console.log('🚀 بدء عملية نقل جميع المجموعات...');
  
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
    
    // الحصول على جميع المجموعات من قاعدة البيانات المحلية
    console.log('\n🔍 جلب جميع المجموعات من قاعدة البيانات المحلية...');
    const localCollections = await localDb.listCollections().toArray();
    
    console.log(`📋 المجموعات الموجودة في قاعدة البيانات المحلية (${localCollections.length} مجموعة):`);
    localCollections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    // الحصول على جميع المجموعات من Atlas
    console.log('\n🔍 جلب جميع المجموعات من Atlas...');
    const atlasCollections = await atlasDb.listCollections().toArray();
    
    console.log(`📋 المجموعات الموجودة في Atlas (${atlasCollections.length} مجموعة):`);
    atlasCollections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    let totalTransferred = 0;
    const transferredCollections = [];
    
    // نقل كل مجموعة من المحلية إلى Atlas
    console.log('\n🔄 بدء نقل المجموعات...');
    
    for (const localCollection of localCollections) {
      const collectionName = localCollection.name;
      console.log(`\n📦 نقل مجموعة: ${collectionName}`);
      
      try {
        const localColl = localDb.collection(collectionName);
        const atlasColl = atlasDb.collection(collectionName);
        
        // التحقق من عدد المستندات
        const count = await localColl.countDocuments();
        console.log(`   📊 عدد المستندات في ${collectionName}: ${count}`);
        
        if (count === 0) {
          console.log(`   ⚠️ المجموعة ${collectionName} فارغة - سيتم إنشاؤها فارغة`);
          // إنشاء المجموعة فارغة
          await atlasColl.insertOne({ _temp: true });
          await atlasColl.deleteOne({ _temp: true });
          transferredCollections.push(collectionName);
          console.log(`   ✅ تم إنشاء المجموعة ${collectionName} فارغة`);
          continue;
        }
        
        // جلب جميع المستندات
        const documents = await localColl.find({}).toArray();
        
        if (documents.length > 0) {
          // حذف المجموعة الموجودة في Atlas (إذا كانت موجودة)
          await atlasColl.drop().catch(() => {
            console.log(`   ℹ️ المجموعة ${collectionName} غير موجودة في Atlas`);
          });
          
          // إدراج المستندات في Atlas
          const result = await atlasColl.insertMany(documents);
          console.log(`   ✅ تم نقل ${result.insertedCount} مستند من ${collectionName}`);
          totalTransferred += result.insertedCount;
          transferredCollections.push(collectionName);
          
          // عرض عينة من البيانات المنقولة
          console.log(`   📝 عينة من البيانات المنقولة:`);
          documents.slice(0, 1).forEach((doc, index) => {
            const docStr = JSON.stringify(doc, null, 2);
            console.log(`      ${index + 1}. ${docStr.substring(0, 200)}...`);
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
    console.log(`📦 إجمالي المجموعات المنقولة: ${transferredCollections.length}`);
    
    // التحقق النهائي من Atlas
    console.log('\n🔍 التحقق النهائي من Atlas...');
    const finalAtlasCollections = await atlasDb.listCollections().toArray();
    
    console.log(`📋 المجموعات الموجودة في Atlas بعد النقل (${finalAtlasCollections.length} مجموعة):`);
    for (const collection of finalAtlasCollections) {
      try {
        const count = await atlasDb.collection(collection.name).countDocuments();
        console.log(`   ${collection.name}: ${count} مستند`);
      } catch (error) {
        console.log(`   ${collection.name}: خطأ في العد`);
      }
    }
    
    // مقارنة المجموعات
    console.log('\n📊 مقارنة المجموعات:');
    console.log('   المحلية:', localCollections.map(c => c.name).join(', '));
    console.log('   Atlas:', finalAtlasCollections.map(c => c.name).join(', '));
    
    // التحقق من تطابق المجموعات
    const localNames = localCollections.map(c => c.name).sort();
    const atlasNames = finalAtlasCollections.map(c => c.name).sort();
    
    if (JSON.stringify(localNames) === JSON.stringify(atlasNames)) {
      console.log('✅ جميع المجموعات تم نقلها بنجاح!');
    } else {
      console.log('⚠️ بعض المجموعات لم يتم نقلها بشكل صحيح');
      const missing = localNames.filter(name => !atlasNames.includes(name));
      if (missing.length > 0) {
        console.log('   المجموعات المفقودة:', missing.join(', '));
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
نقلجميعالمجموعات().catch(console.error); 