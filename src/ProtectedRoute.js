import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

    console.log('🔒 ProtectedRoute:', {
    requiredUserType,
    userType: user?.user_type || user?.role,
    hasUser: !!user,
    loading
  });

  if (loading) {
    console.log('⏳ ProtectedRoute: جاري التحميل...');
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(90deg, #7c4dff 0%, #00bcd4 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>جاري التحميل...</div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ ProtectedRoute: لا يوجد مستخدم - إعادة توجيه للصفحة الرئيسية');
    // حفظ الرابط الأصلي في redirect
    return <Navigate to={`/?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

    // معالجة أنواع المستخدمين المختلفة
    const userType = user?.user_type || user?.role;
    const isUserTypeValid = requiredUserType === 'user' ? 
      (userType === 'user' || userType === 'patient') : 
      (userType === requiredUserType);
    
    if (requiredUserType && !isUserTypeValid) {
      console.log('❌ نوع المستخدم غير صحيح:', {
        required: requiredUserType,
        actual: userType
      });

      // Redirect based on user type
      if (userType === 'doctor') {
        return <Navigate to="/doctor-dashboard" replace />;
      } else if (userType === 'admin') {
        return <Navigate to="/admin-login" replace />;
      } else {
        return <Navigate to="/home" replace />;
      }
    }

  console.log('✅ ProtectedRoute: تم الوصول للصفحة بنجاح');
  return children;
};

export default ProtectedRoute; 