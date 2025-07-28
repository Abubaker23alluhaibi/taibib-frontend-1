import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// إنشاء موعد جديد
export const createAppointment = async (appointmentData) => {
  try {
    const appointmentRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
    
    return { success: true, appointmentId: appointmentRef.id };
  } catch (error) {
    console.error('خطأ في إنشاء الموعد:', error);
    return { success: false, error: error.message };
  }
};

// جلب مواعيد المريض
export const getPatientAppointments = async (patientId) => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, appointments };
  } catch (error) {
    console.error('خطأ في جلب مواعيد المريض:', error);
    return { success: false, error: error.message };
  }
};

// جلب مواعيد الطبيب
export const getDoctorAppointments = async (doctorId) => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('doctorId', '==', doctorId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, appointments };
  } catch (error) {
    console.error('خطأ في جلب مواعيد الطبيب:', error);
    return { success: false, error: error.message };
  }
};

// جلب مواعيد طبيب في تاريخ محدد
export const getDoctorAppointmentsByDate = async (doctorId, date) => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('doctorId', '==', doctorId),
      where('date', '==', date),
      where('status', 'in', ['pending', 'confirmed'])
    );
    
    const querySnapshot = await getDocs(q);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, appointments };
  } catch (error) {
    console.error('خطأ في جلب مواعيد الطبيب في التاريخ:', error);
    return { success: false, error: error.message };
  }
};

// تحديث حالة الموعد
export const updateAppointmentStatus = async (appointmentId, status, prescription = '') => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      status,
      prescription,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('خطأ في تحديث حالة الموعد:', error);
    return { success: false, error: error.message };
  }
};

// حذف موعد
export const deleteAppointment = async (appointmentId) => {
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
    return { success: true };
  } catch (error) {
    console.error('خطأ في حذف الموعد:', error);
    return { success: false, error: error.message };
  }
};

// جلب موعد واحد
export const getAppointment = async (appointmentId) => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    const appointmentSnap = await getDoc(appointmentRef);
    
    if (appointmentSnap.exists()) {
      return { 
        success: true, 
        appointment: {
          id: appointmentSnap.id,
          ...appointmentSnap.data()
        }
      };
    } else {
      return { success: false, error: 'الموعد غير موجود' };
    }
  } catch (error) {
    console.error('خطأ في جلب الموعد:', error);
    return { success: false, error: error.message };
  }
};

// جلب جميع المواعيد (للمدير)
export const getAllAppointments = async () => {
  try {
    const q = query(
      collection(db, 'appointments'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, appointments };
  } catch (error) {
    console.error('خطأ في جلب جميع المواعيد:', error);
    return { success: false, error: error.message };
  }
}; 