import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll 
} from 'firebase/storage';
import app from '../firebase';

const storage = getStorage(app);

// رفع صورة
export const uploadImage = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    return { success: false, error: error.message };
  }
};

// رفع صورة الملف الشخصي
export const uploadProfileImage = async (file, userId) => {
  const path = `profile-images/${userId}/${Date.now()}_${file.name}`;
  return await uploadImage(file, path);
};

// رفع صورة الطبيب
export const uploadDoctorImage = async (file, doctorId) => {
  const path = `doctor-images/${doctorId}/${Date.now()}_${file.name}`;
  return await uploadImage(file, path);
};

// رفع مستندات
export const uploadDocument = async (file, userId, type) => {
  const path = `documents/${userId}/${type}/${Date.now()}_${file.name}`;
  return await uploadImage(file, path);
};

// حذف ملف
export const deleteFile = async (path) => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error) {
    console.error('خطأ في حذف الملف:', error);
    return { success: false, error: error.message };
  }
};

// جلب قائمة الملفات في مجلد
export const listFiles = async (path) => {
  try {
    const listRef = ref(storage, path);
    const res = await listAll(listRef);
    
    const files = [];
    for (const itemRef of res.items) {
      const url = await getDownloadURL(itemRef);
      files.push({
        name: itemRef.name,
        url: url,
        path: itemRef.fullPath
      });
    }
    
    return { success: true, files };
  } catch (error) {
    console.error('خطأ في جلب قائمة الملفات:', error);
    return { success: false, error: error.message };
  }
};

// تحويل ملف إلى URL
export const getFileURL = async (path) => {
  try {
    const fileRef = ref(storage, path);
    const url = await getDownloadURL(fileRef);
    return { success: true, url };
  } catch (error) {
    console.error('خطأ في جلب رابط الملف:', error);
    return { success: false, error: error.message };
  }
}; 