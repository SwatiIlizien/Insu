import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import GoogleSheetsService from "./googleSheetsService.js";

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS to allow your Netlify domain
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://*.netlify.app',
    'https://*.vercel.app',
    'https://swatilizien.github.io'
  ],
  credentials: true
};

app.use(cors(corsOptions));
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

// In-memory user storage (for demo purposes)
// In production, you'd want to use a proper database
const users = new Map();

// Commission tracking
const commissions = new Map(); // phone -> { totalEarnings, referrals, lastUpdated }

// Helper function to generate user ID
const generateUserId = () => Math.random().toString(36).substr(2, 9);

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { phone, password, name } = req.body;
    
    // Validate required fields
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }

    // Validate phone number format (10 digits)
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    // Check if user already exists
    if (users.has(phone)) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Create user object
    const user = {
      id: generateUserId(),
      phone,
      password: hashed,
      name: name || '',
      email: '', // Keep empty for compatibility
      registeredAt: new Date(),
      lastLogin: null,
      isActive: true
    };

    // Store user in memory
    users.set(phone, user);

    // Initialize commission tracking for new user
    commissions.set(phone, {
      totalEarnings: 0,
      referrals: 0,
      lastUpdated: new Date()
    });

    // Save to Google Sheets
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const rowData = [timestamp, name || '', '', phone, 'Registered', 'Active'];

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

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }

    // Validate phone number format (10 digits)
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    const user = users.get(phone);
    if (!user) {
      // Log failed login attempt
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const rowData = [timestamp, '', '', phone, 'Login Failed', 'Invalid Phone'];
      
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
      const rowData = [timestamp, user.name || '', '', phone, 'Login Failed', 'Invalid Password'];
      
      await googleSheetsService.addDataToSheet(
        process.env.GOOGLE_SPREADSHEET_ID,
        'Users!A:F',
        rowData
      );
      
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update last login time
    user.lastLogin = new Date();

    // Log successful login
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const rowData = [timestamp, user.name || '', '', phone, 'Login Success', 'Active'];
    
    await googleSheetsService.addDataToSheet(
      process.env.GOOGLE_SPREADSHEET_ID,
      'Users!A:F',
      rowData
    );

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "_KEY");
    res.json({ 
      token, 
      user: { 
        id: user.id, 
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
    const { phone } = req.body;
    
    if (phone) {
      const user = users.get(phone);
      if (user) {
        // Log logout action
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        const rowData = [timestamp, user.name || '', '', phone, 'Logout', 'Inactive'];
        
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
    const user = Array.from(users.values()).find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get commission data
    const commissionData = commissions.get(user.phone) || { totalEarnings: 0, referrals: 0, lastUpdated: new Date() };

    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        phone: user.phone 
      },
      commission: commissionData
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(401).json({ message: "Invalid token" });
  }
});

// Get commission info endpoint
app.get("/api/commission-info", (req, res) => {
  res.json({
    singlePolicy: {
      percentage: 14,
      description: "Earn 14% commission on single insurance policy"
    },
    multiplePolicy: {
      percentage: 20,
      description: "Earn 20% commission on multiple insurance policies"
    },
    companies: [
      {
        id: "acko-motor",
        name: "Acko Motor Insurance",
        description: "Leading digital-first motor insurance provider with comprehensive coverage options and instant claims processing",
        link: "", // Will be added later
        isActive: false // Only active after login
      },
      {
        id: "icici-lombard", 
        name: "ICICI Lombard Insurance",
        description: "Trusted insurance partner with competitive rates and extensive network coverage across India",
        link: "", // Will be added later
        isActive: false // Only active after login
      }
    ]
  });
});

// Track referral endpoint (for when user clicks on company links)
app.post("/api/track-referral", async (req, res) => {
  try {
    const { phone, companyId, policyType } = req.body;
    
    if (!phone || !companyId) {
      return res.status(400).json({ message: "Phone and company ID are required" });
    }

    const user = users.get(phone);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update commission tracking
    const commissionData = commissions.get(phone) || { totalEarnings: 0, referrals: 0, lastUpdated: new Date() };
    commissionData.referrals += 1;
    commissionData.lastUpdated = new Date();
    commissions.set(phone, commissionData);

    // Log referral to Google Sheets
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const rowData = [timestamp, user.name || '', '', phone, `Referral - ${companyId}`, policyType || 'Unknown'];

    await googleSheetsService.addDataToSheet(
      process.env.GOOGLE_SPREADSHEET_ID,
      'Users!A:F',
      rowData
    );

    res.json({ 
      message: "Referral tracked successfully",
      commission: commissionData
    });
  } catch (err) {
    console.error('Referral tracking error:', err);
    res.status(500).json({ message: "Server error during referral tracking" });
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📊 Google Sheets integration active');
  console.log('💾 Using in-memory storage (no MongoDB required)');
});
