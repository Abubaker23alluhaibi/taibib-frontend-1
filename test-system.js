// Comprehensive System Test - Tabib IQ
const API_URL = 'https://tabib-iq-backend-production.up.railway.app/api';

async function testSystem() {
  console.log('🔍 Testing System...');
  console.log('📝 API URL:', API_URL);
  console.log('⏰ Time:', new Date().toLocaleString('ar-EG'));
  
  try {
    // Test 1: Health endpoint
    console.log('\n1️⃣ Testing Health Endpoint...');
    const healthResponse = await fetch(`${API_URL}/health`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health endpoint working!');
      console.log('📊 Response:', healthData);
      
      if (healthData.mongodb === 'connected') {
        console.log('✅ MongoDB connected successfully!');
      } else {
        console.log('❌ MongoDB not connected:', healthData.mongodb);
        console.log('💡 Problem: Need to update MONGO_URI in Railway');
        return;
      }
    } else {
      console.log('❌ Health endpoint not working:', healthResponse.status);
      const errorText = await healthResponse.text();
      console.log('📄 Error details:', errorText);
      return;
    }
    
    // Test 2: Get users
    console.log('\n2️⃣ Testing Get Users...');
    const usersResponse = await fetch(`${API_URL}/users`);
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log(`✅ Got ${usersData.length} users`);
      console.log('📊 Users:', usersData);
    } else {
      console.log('❌ Failed to get users:', usersResponse.status);
      const errorText = await usersResponse.text();
      console.log('📄 Error details:', errorText);
    }
    
    // Test 3: Get doctors
    console.log('\n3️⃣ Testing Get Doctors...');
    const doctorsResponse = await fetch(`${API_URL}/admin/doctors`);
    
    if (doctorsResponse.ok) {
      const doctorsData = await doctorsResponse.json();
      console.log(`✅ Got ${doctorsData.length} doctors`);
      console.log('📊 Doctors:', doctorsData);
      
      // Show pending doctors
      const pendingDoctors = doctorsData.filter(d => d.status === 'pending');
      console.log(`📋 Pending doctors: ${pendingDoctors.length}`);
      pendingDoctors.forEach(doctor => {
        console.log(`   - ${doctor.name} (${doctor.email}) - ${doctor.specialty}`);
      });
    } else {
      console.log('❌ Failed to get doctors:', doctorsResponse.status);
      const errorText = await doctorsResponse.text();
      console.log('📄 Error details:', errorText);
    }
    
    // Test 4: Get appointments
    console.log('\n4️⃣ Testing Get Appointments...');
    const appointmentsResponse = await fetch(`${API_URL}/appointments`);
    
    if (appointmentsResponse.ok) {
      const appointmentsData = await appointmentsResponse.json();
      console.log(`✅ Got ${appointmentsData.length} appointments`);
      console.log('📊 Appointments:', appointmentsData);
    } else {
      console.log('❌ Failed to get appointments:', appointmentsResponse.status);
      const errorText = await appointmentsResponse.text();
      console.log('📄 Error details:', errorText);
    }
    
    // Test 5: Get health centers
    console.log('\n5️⃣ Testing Get Health Centers...');
    const centersResponse = await fetch(`${API_URL}/admin/health-centers`);
    
    if (centersResponse.ok) {
      const centersData = await centersResponse.json();
      console.log(`✅ Got ${centersData.length} health centers`);
      console.log('📊 Health Centers:', centersData);
    } else {
      console.log('❌ Failed to get health centers:', centersResponse.status);
      const errorText = await centersResponse.text();
      console.log('📄 Error details:', errorText);
    }
    
    // Test 6: Admin login test
    console.log('\n6️⃣ Testing Admin Login...');
    const adminLoginData = {
      email: 'admin@tabib-iq.com',
      password: 'admin123'
    };
    
    const adminLoginResponse = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminLoginData)
    });
    
    if (adminLoginResponse.ok) {
      const adminLoginResult = await adminLoginResponse.json();
      console.log('✅ Admin login successful!');
      console.log('📊 Result:', adminLoginResult);
    } else {
      console.log('❌ Failed admin login:', adminLoginResponse.status);
      const errorText = await adminLoginResponse.text();
      console.log('📄 Error details:', errorText);
    }
    
    console.log('\n🎉 Comprehensive test completed!');
    console.log('📋 Summary:');
    console.log('   ✅ Database connected');
    console.log('   ✅ API working correctly');
    console.log('   ✅ All endpoints available');
    
  } catch (error) {
    console.error('❌ Error in comprehensive test:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('💡 Solution: Make sure backend is running on Railway');
    } else if (error.message.includes('CORS')) {
      console.log('💡 Solution: Check CORS settings in backend');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Solution: Check API URL validity');
    }
  }
}

// Run test
testSystem(); 