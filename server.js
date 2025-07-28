require('dotenv').config();
const express = require('express');  
const mongoose = require('mongoose');
const cors = require('cors');        
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// إعدادات CORS محسنة للوصول من الهاتف
app.use(cors({
  origin: true, // السماح لجميع المصادر مؤقتاً
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// إعداد مجلد رفع الملفات
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// إعداد Multer لرفع الملفات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// إعداد MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tabib-iq', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// تعريف النماذج
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  date_of_birth: String,
  gender: String,
  image: String,
  profileImage: String,
  imageUrl: String,
  created_at: { type: Date, default: Date.now }
});

const doctorSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  specialization: String,
  experience: String,
  education: String,
  image: String,
  profileImage: String,
  imageUrl: String,
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  documents: {
    idFront: String,
    idBack: String,
    syndicateFront: String,
    syndicateBack: String
  },
  created_at: { type: Date, default: Date.now }
});

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  date: String,
  time: String,
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  title: { type: String, required: true },
  message: String,
  type: String,
  isRead: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

const healthCenterSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  email: String,
  image: String,
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const HealthCenter = mongoose.model('HealthCenter', healthCenterSchema);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Tabib IQ Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Tabib IQ Backend is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// إعداد مجلد رفع الصور
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// نقاط نهاية المستخدمين
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, date_of_birth, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      date_of_birth,
      gender
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// نقاط نهاية الأطباء
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: true }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/register-doctor', async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, specialization, experience, education, documents } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new Doctor({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      specialization,
      experience,
      education,
      documents
    });
    await doctor.save();
    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/doctor-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isValidPassword = await bcrypt.compare(password, doctor.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ doctor: { ...doctor.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// نقاط نهاية المواعيد
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'first_name last_name email')
      .populate('doctorId', 'first_name last_name specialization');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { userId, doctorId, date, time } = req.body;
    const appointment = new Appointment({ userId, doctorId, date, time });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/user-appointments/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId })
      .populate('doctorId', 'first_name last_name specialization');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/doctor-appointments/:doctorId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate('userId', 'first_name last_name email');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// نقاط نهاية الإشعارات
app.post('/api/notifications', async (req, res) => {
  try {
    const { userId, doctorId, title, message, type } = req.body;
    const notification = new Notification({ userId, doctorId, title, message, type });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/notifications', async (req, res) => {
  try {
    const { userId, doctorId } = req.query;
    let query = {};
    if (userId) query.userId = userId;
    if (doctorId) query.doctorId = doctorId;
    
    const notifications = await Notification.find(query).sort({ created_at: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/notifications/mark-read', async (req, res) => {
  try {
    const { notificationId } = req.body;
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// نقاط نهاية رفع الملفات
app.post('/api/upload-profile-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload-doctor-documents', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'syndicateFront', maxCount: 1 },
  { name: 'syndicateBack', maxCount: 1 }
]), async (req, res) => {
  try {
    const documents = {};
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        if (req.files[key] && req.files[key][0]) {
          documents[key] = `/uploads/${req.files[key][0].filename}`;
        }
      });
    }
    res.json({ documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// نقاط نهاية لوحة تحكم الأدمن
app.put('/api/doctors/:doctorId/approve', async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.doctorId, { isApproved: true });
    res.json({ message: 'Doctor approved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/doctors/:doctorId/reject', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.doctorId);
    res.json({ message: 'Doctor rejected and deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/doctors/:doctorId/feature', async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.doctorId, { isFeatured: true });
    res.json({ message: 'Doctor featured successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/doctors/:doctorId/unfeature', async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.doctorId, { isFeatured: false });
    res.json({ message: 'Doctor unfeatured successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:userId', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/doctors/:doctorId', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.doctorId);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// نقاط نهاية مراكز الصحة
app.get('/api/health-centers', async (req, res) => {
  try {
    const healthCenters = await HealthCenter.find();
    res.json(healthCenters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/health-centers', async (req, res) => {
  try {
    const healthCenter = new HealthCenter(req.body);
    await healthCenter.save();
    res.status(201).json(healthCenter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/health-centers/:id', async (req, res) => {
  try {
    const healthCenter = await HealthCenter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(healthCenter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/health-centers/:id', async (req, res) => {
  try {
    await HealthCenter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Health center deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إحصائيات الأدمن
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const pendingDoctors = await Doctor.countDocuments({ isApproved: false });
    const totalAppointments = await Appointment.countDocuments();
    const totalHealthCenters = await HealthCenter.countDocuments();
    
    res.json({
      totalUsers,
      totalDoctors,
      pendingDoctors,
      totalAppointments,
      totalHealthCenters
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`MongoDB connection status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
}); 