# API Endpoints Reference

## Google Sheets Integration Endpoints

### 1. Initialize Sheets
**POST** `/api/init-sheets`

Creates the required sheets and headers in your Google Spreadsheet.

**Response:**
```json
{
  "message": "Google Sheets initialized successfully"
}
```

### 2. Submit Quote Request
**POST** `/api/quote`

Saves quote request data to the "Quote Requests" sheet.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string",
  "phone": "string (required)",
  "insuranceType": "string (required)",
  "coverage": "string (required)"
}
```

**Response:**
```json
{
  "message": "Quote request submitted successfully"
}
```

### 3. Submit Application
**POST** `/api/application`

Saves application data to the "Applications" sheet.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (required)",
  "dob": "string",
  "gender": "string",
  "address": "string",
  "insuranceType": "string (required)",
  "previousInsurance": "string",
  "requirements": "string"
}
```

**Response:**
```json
{
  "message": "Application submitted successfully"
}
```

### 4. Submit Consultation Request
**POST** `/api/consultation`

Saves consultation data to the "Consultations" sheet.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (required)",
  "preferredDate": "string",
  "preferredTime": "string",
  "consultationType": "string (required)",
  "currentInsurance": "string",
  "budget": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "message": "Consultation request submitted successfully"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- **200**: Success
- **400**: Bad Request (missing required fields)
- **500**: Internal Server Error

Error response format:
```json
{
  "message": "Error description"
}
```

## Environment Variables Required

```env
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./credentials.json
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
MONGODB_URI=mongodb://localhost:27017/insu-raksha
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

## Quick Start

1. Set up Google Sheets API credentials
2. Configure environment variables
3. Start the server: `node index.js`
4. Initialize sheets: `POST /api/init-sheets`
5. Start submitting form data!
