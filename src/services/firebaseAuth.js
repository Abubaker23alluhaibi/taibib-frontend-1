import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// تسجيل مستخدم جديد
export const registerUser = async (email, password, userData) => {
  try {
    // إنشاء حساب في Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // تحديث الملف الشخصي
    await updateProfile(user, {
      displayName: userData.name || userData.first_name
    });

    // حفظ بيانات المستخدم في Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: userData.name || userData.first_name,
      phone: userData.phone || '',
      user_type: userData.user_type || 'patient',
      role: userData.role || 'patient',
      createdAt: new Date(),
      active: true
    });

    return { success: true, user };
  } catch (error) {
    console.error('خطأ في التسجيل:', error);
    return { success: false, error: error.message };
  }
};

// تسجيل الدخول
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // جلب بيانات المستخدم من Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { 
        success: true, 
        user: {
          ...user,
          ...userData
        }
      };
    } else {
      return { success: true, user };
    }
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    return { success: false, error: error.message };
  }
};

// تسجيل الخروج
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
    return { success: false, error: error.message };
  }
};

// مراقبة حالة تسجيل الدخول
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // جلب بيانات المستخدم من Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          callback({ ...user, ...userData });
        } else {
          callback(user);
        }
      } catch (error) {
        console.error('خطأ في جلب بيانات المستخدم:', error);
        callback(user);
      }
    } else {
      callback(null);
    }
  });
};

// إعادة تعيين كلمة المرور
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('خطأ في إعادة تعيين كلمة المرور:', error);
    return { success: false, error: error.message };
  }
};

// تحديث بيانات المستخدم
export const updateUserProfile = async (updates) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('لا يوجد مستخدم مسجل');
    }

    // تحديث الملف الشخصي في Firebase Auth
    if (updates.displayName) {
      await updateProfile(user, { displayName: updates.displayName });
    }

    // تحديث البيانات في Firestore
    await setDoc(doc(db, 'users', user.uid), updates, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('خطأ في تحديث الملف الشخصي:', error);
    return { success: false, error: error.message };
  }
}; 