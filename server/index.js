import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import GoogleSheetsService from "./googleSheetsService.js";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Sheets service
const googleSheetsService = new GoogleSheetsService();

// Initialize Google Sheets authentication
googleSheetsService.initializeAuth().then(success => {
  if (success) {
    console.log('Google Sheets service initialized successfully');
  } else {
    console.log('Google Sheets service initialization failed - check your credentials');
  }
});

// MongoDB connection - optional since we're using Google Sheets as primary storage
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/insu-raksha")
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.log('MongoDB connection failed - using Google Sheets only mode');
    console.log('To enable MongoDB, install and start MongoDB service');
  });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  registeredAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true }
});
const User = mongoose.model("User", UserSchema);

app.post("/api/register", async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already registered" });

    // Hash password
  const hashed = await bcrypt.hash(password, 10);
    
    // Save to MongoDB
    const user = new User({ 
      email, 
      password: hashed,
      name: name || '',
      phone: phone || '',
      registeredAt: new Date()
    });
  await user.save();

    // Save to Google Sheets
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const rowData = [timestamp, name || '', email, phone || '', 'Registered', 'Active'];

    const result = await googleSheetsService.addDataToSheet(
      process.env.GOOGLE_SPREADSHEET_ID,
      'Users!A:F',
      rowData
    );

    if (result.success) {
      console.log('User data saved to Google Sheets successfully');
    } else {
      console.error('Failed to save user data to Google Sheets:', result.error);
    }

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
  const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

  const user = await User.findOne({ email });
    if (!user) {
      // Log failed login attempt
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const rowData = [timestamp, '', email, '', 'Login Failed', 'Invalid Email'];
      
      await googleSheetsService.addDataToSheet(
        process.env.GOOGLE_SPREADSHEET_ID,
        'Users!A:F',
        rowData
      );
      
      return res.status(400).json({ message: "Invalid credentials" });
    }

  const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      // Log failed login attempt
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const rowData = [timestamp, user.name || '', email, user.phone || '', 'Login Failed', 'Invalid Password'];
      
      await googleSheetsService.addDataToSheet(
        process.env.GOOGLE_SPREADSHEET_ID,
        'Users!A:F',
        rowData
      );
      
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Log successful login
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const rowData = [timestamp, user.name || '', email, user.phone || '', 'Login Success', 'Active'];
    
    await googleSheetsService.addDataToSheet(
      process.env.GOOGLE_SPREADSHEET_ID,
      'Users!A:F',
      rowData
    );

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "_KEY");
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        phone: user.phone 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Logout endpoint
app.post("/api/logout", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        // Log logout action
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        const rowData = [timestamp, user.name || '', email, user.phone || '', 'Logout', 'Inactive'];
        
        await googleSheetsService.addDataToSheet(
          process.env.GOOGLE_SPREADSHEET_ID,
          'Users!A:F',
          rowData
        );
      }
    }
    
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: "Server error during logout" });
  }
});

// Get user profile endpoint
app.get("/api/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "_KEY");
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(401).json({ message: "Invalid token" });
  }
});

// Google Sheets integration endpoints

// Submit quote request to Google Sheets
app.post("/api/quote", async (req, res) => {
  try {
    const { name, email, phone, insuranceType, coverage } = req.body;
    
    if (!name || !phone || !insuranceType || !coverage) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Prepare data for Google Sheets
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const rowData = [timestamp, name, email, phone, insuranceType, coverage];

    // Add to Google Sheets
    const result = await googleSheetsService.addDataToSheet(
      process.env.GOOGLE_SPREADSHEET_ID,
      'Quote Requests!A:F',
      rowData
    );

    if (result.success) {
      res.json({ message: "Quote request submitted successfully" });
    } else {
      console.error('Google Sheets error:', result.error);
      res.status(500).json({ message: "Failed to save quote request" });
    }
  } catch (err) {
    console.error('Quote submission error:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit application form to Google Sheets
app.post("/api/application", async (req, res) => {
  try {
    const { name, email, phone, dob, gender, address, insuranceType, previousInsurance, requirements } = req.body;
    
    if (!name || !email || !phone || !insuranceType) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Prepare data for Google Sheets
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const rowData = [timestamp, name, email, phone, dob, gender, address, insuranceType, previousInsurance, requirements];

    // Add to Google Sheets
    const result = await googleSheetsService.addDataToSheet(
      process.env.GOOGLE_SPREADSHEET_ID,
      'Applications!A:J',
      rowData
    );

    if (result.success) {
      res.json({ message: "Application submitted successfully" });
    } else {
      console.error('Google Sheets error:', result.error);
      res.status(500).json({ message: "Failed to save application" });
    }
  } catch (err) {
    console.error('Application submission error:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit consultation form to Google Sheets
app.post("/api/consultation", async (req, res) => {
  try {
    const { name, email, phone, preferredDate, preferredTime, consultationType, currentInsurance, budget, message } = req.body;
    
    if (!name || !email || !phone || !consultationType) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Prepare data for Google Sheets
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const rowData = [timestamp, name, email, phone, preferredDate, preferredTime, consultationType, currentInsurance, budget, message];

    // Add to Google Sheets
    const result = await googleSheetsService.addDataToSheet(
      process.env.GOOGLE_SPREADSHEET_ID,
      'Consultations!A:J',
      rowData
    );

    if (result.success) {
      res.json({ message: "Consultation request submitted successfully" });
    } else {
      console.error('Google Sheets error:', result.error);
      res.status(500).json({ message: "Failed to save consultation request" });
    }
  } catch (err) {
    console.error('Consultation submission error:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Initialize Google Sheets with headers (run once)
app.post("/api/init-sheets", async (req, res) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    // Create sheets if they don't exist
    await googleSheetsService.createSheetIfNotExists(spreadsheetId, 'Users');
    await googleSheetsService.createSheetIfNotExists(spreadsheetId, 'Quote Requests');
    await googleSheetsService.createSheetIfNotExists(spreadsheetId, 'Applications');
    await googleSheetsService.createSheetIfNotExists(spreadsheetId, 'Consultations');

    // Add headers
    await googleSheetsService.addHeaders(spreadsheetId, 'Users', 
      ['Timestamp', 'Name', 'Email', 'Phone', 'Action', 'Status']);
    
    await googleSheetsService.addHeaders(spreadsheetId, 'Quote Requests', 
      ['Timestamp', 'Name', 'Email', 'Phone', 'Insurance Type', 'Coverage']);
    
    await googleSheetsService.addHeaders(spreadsheetId, 'Applications', 
      ['Timestamp', 'Name', 'Email', 'Phone', 'Date of Birth', 'Gender', 'Address', 'Insurance Type', 'Previous Insurance', 'Requirements']);
    
    await googleSheetsService.addHeaders(spreadsheetId, 'Consultations', 
      ['Timestamp', 'Name', 'Email', 'Phone', 'Preferred Date', 'Preferred Time', 'Consultation Type', 'Current Insurance', 'Budget', 'Message']);

    res.json({ message: "Google Sheets initialized successfully" });
  } catch (err) {
    console.error('Sheet initialization error:', err);
    res.status(500).json({ message: "Failed to initialize sheets" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));