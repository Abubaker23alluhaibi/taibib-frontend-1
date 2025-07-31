// API Service for Tabib IQ Frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.tabib-iq.com';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.fallbackURLs = [
      'https://api.tabib-iq.com'
    ];
  }

  // Generic request method with fallback
  async makeRequest(endpoint, options = {}) {
    const urls = [this.baseURL, ...this.fallbackURLs];
    
    for (const url of urls) {
      try {
        const fullUrl = url.endsWith('/api') ? `${url}${endpoint}` : `${url}/api${endpoint}`;
        
        const response = await fetch(fullUrl, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
          }
        });

        if (response.ok) {
          const data = await response.json();
          return { success: true, data, url: fullUrl };
        }
      } catch (error) {
        console.log(`❌ فشل الاتصال بـ ${url}:`, error.message);
        continue;
      }
    }
    
    throw new Error('فشل الاتصال بجميع الخوادم');
  }

  // Get all doctors
  async getDoctors() {
    try {
      const result = await this.makeRequest('/doctors');
      console.log('✅ تم جلب الأطباء بنجاح:', result.data.length);
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في جلب الأطباء:', error);
      return [];
    }
  }

  // Get doctor by ID
  async getDoctorById(doctorId) {
    try {
      const result = await this.makeRequest(`/doctors/${doctorId}`);
      console.log('🔍 apiService.getDoctorById - result:', result);
      return result.data.doctor || result.data;
    } catch (error) {
      console.error('❌ خطأ في جلب بيانات الطبيب:', error);
      return null;
    }
  }

  // Get all users
  async getUsers() {
    try {
      const result = await this.makeRequest('/users');
      console.log('✅ تم جلب المستخدمين بنجاح:', result.data.length);
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في جلب المستخدمين:', error);
      return [];
    }
  }

  // Get users by type (patient, doctor, admin)
  async getUsersByType(type) {
    try {
      const result = await this.makeRequest(`/users/${type}`);
      return result.data;
    } catch (error) {
      console.error(`❌ خطأ في جلب المستخدمين من نوع ${type}:`, error);
      return [];
    }
  }

  // Get all appointments
  async getAppointments() {
    try {
      const result = await this.makeRequest('/appointments');
      console.log('✅ تم جلب المواعيد بنجاح:', result.data.length);
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في جلب المواعيد:', error);
      return [];
    }
  }

  // Get appointments by user ID
  async getUserAppointments(userId) {
    try {
      const result = await this.makeRequest(`/user-appointments/${userId}`);
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في جلب مواعيد المستخدم:', error);
      return [];
    }
  }

  // Get appointments by doctor ID
  async getDoctorAppointments(doctorId) {
    try {
      const result = await this.makeRequest(`/doctor-appointments/${doctorId}`);
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في جلب مواعيد الطبيب:', error);
      return [];
    }
  }

  // Create new appointment
  async createAppointment(appointmentData) {
    try {
      const result = await this.makeRequest('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData)
      });
      console.log('✅ تم إنشاء الموعد بنجاح');
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في إنشاء الموعد:', error);
      throw error;
    }
  }

  // Update appointment status
  async updateAppointmentStatus(appointmentId, status) {
    try {
      const result = await this.makeRequest(`/appointments/${appointmentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      console.log('✅ تم تحديث حالة الموعد بنجاح');
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في تحديث حالة الموعد:', error);
      throw error;
    }
  }

  // Delete appointment
  async deleteAppointment(appointmentId) {
    try {
      const result = await this.makeRequest(`/appointments/${appointmentId}`, {
        method: 'DELETE'
      });
      console.log('✅ تم حذف الموعد بنجاح');
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في حذف الموعد:', error);
      throw error;
    }
  }

  // Get notifications
  async getNotifications() {
    try {
      const result = await this.makeRequest('/notifications');
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في جلب الإشعارات:', error);
      return [];
    }
  }

  // Check appointments
  async checkAppointments() {
    try {
      const result = await this.makeRequest('/check-appointments');
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في فحص المواعيد:', error);
      return [];
    }
  }

  // Get health centers
  async getHealthCenters() {
    try {
      const result = await this.makeRequest('/health-centers');
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في جلب المراكز الصحية:', error);
      return [];
    }
  }

  // Search doctors by specialty
  async searchDoctorsBySpecialty(specialty) {
    try {
      const doctors = await this.getDoctors();
      return doctors.filter(doctor => 
        doctor.specialty && 
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    } catch (error) {
      console.error('❌ خطأ في البحث عن الأطباء:', error);
      return [];
    }
  }

  // Search doctors by location
  async searchDoctorsByLocation(location) {
    try {
      const doctors = await this.getDoctors();
      return doctors.filter(doctor => 
        doctor.location && 
        doctor.location.toLowerCase().includes(location.toLowerCase())
      );
    } catch (error) {
      console.error('❌ خطأ في البحث عن الأطباء حسب الموقع:', error);
      return [];
    }
  }

  // Get available time slots for doctor
  async getAvailableTimeSlots(doctorId, date) {
    try {
      const result = await this.makeRequest(`/appointments/${doctorId}/${date}`);
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في جلب الأوقات المتاحة:', error);
      return [];
    }
  }

  // Get statistics
  async getStatistics() {
    try {
      const [doctors, users, appointments] = await Promise.all([
        this.getDoctors(),
        this.getUsers(),
        this.getAppointments()
      ]);

      return {
        totalDoctors: doctors.length,
        totalUsers: users.filter(u => u.user_type === 'patient').length,
        totalAppointments: appointments.length,
        activeAppointments: appointments.filter(a => a.status === 'confirmed').length,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length
      };
    } catch (error) {
      console.error('❌ خطأ في جلب الإحصائيات:', error);
      return {
        totalDoctors: 0,
        totalUsers: 0,
        totalAppointments: 0,
        activeAppointments: 0,
        pendingAppointments: 0
      };
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const result = await this.makeRequest(`/change-password/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      console.log('✅ تم تغيير كلمة المرور بنجاح');
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في تغيير كلمة المرور:', error);
      throw error;
    }
  }

  // Upload profile image
  async uploadProfileImage(userId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('profileImage', imageFile);
      formData.append('userId', userId);

      const urls = [this.baseURL, ...this.fallbackURLs];
      
      for (const url of urls) {
        try {
          const fullUrl = url.endsWith('/api') ? `${url}/upload-profile-image` : `${url}/api/upload-profile-image`;
          
          const response = await fetch(fullUrl, {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            const data = await response.json();
            console.log('✅ تم رفع الصورة الشخصية بنجاح');
            return data;
          }
        } catch (error) {
          console.log(`❌ فشل رفع الصورة إلى ${url}:`, error.message);
          continue;
        }
      }
      
      throw new Error('فشل رفع الصورة لجميع الخوادم');
    } catch (error) {
      console.error('❌ خطأ في رفع الصورة الشخصية:', error);
      throw error;
    }
  }

  // Admin login
  async adminLogin(email, password) {
    try {
      const result = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          loginType: 'admin'
        })
      });
      console.log('✅ تم تسجيل دخول الأدمن بنجاح');
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في تسجيل دخول الأدمن:', error);
      throw error;
    }
  }

  // Get admin dashboard data
  async getAdminDashboard() {
    try {
      const result = await this.makeRequest('/admin/dashboard');
      console.log('✅ تم جلب بيانات لوحة التحكم بنجاح');
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في جلب بيانات لوحة التحكم:', error);
      throw error;
    }
  }

  // Approve doctor
  async approveDoctor(doctorId) {
    try {
      const result = await this.makeRequest(`/doctors/${doctorId}/approve`, {
        method: 'PUT'
      });
      console.log('✅ تم الموافقة على الطبيب بنجاح');
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في الموافقة على الطبيب:', error);
      throw error;
    }
  }

  // Reject doctor
  async rejectDoctor(doctorId) {
    try {
      const result = await this.makeRequest(`/doctors/${doctorId}/reject`, {
        method: 'PUT'
      });
      console.log('✅ تم رفض الطبيب بنجاح');
      return result.data;
    } catch (error) {
      console.error('❌ خطأ في رفض الطبيب:', error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService; 