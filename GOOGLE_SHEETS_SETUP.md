# Google Sheets API Integration Setup Guide

This guide will help you set up Google Sheets API integration for your insurance application to store form data.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. Node.js and npm installed

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 2: Create Service Account Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `insu-raksha-sheets-service`
   - Description: `Service account for Google Sheets integration`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"
6. Click on the created service account
7. Go to the "Keys" tab
8. Click "Add Key" > "Create new key"
9. Choose "JSON" format and download the key file
10. Rename the downloaded file to `credentials.json`
11. Place it in the `server` directory

## Step 3: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Insu Raksha Data" (or any name you prefer)
4. Copy the spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - The ID is the long string between `/d/` and `/edit`

## Step 4: Share the Spreadsheet

1. Open your created spreadsheet
2. Click "Share" button (top right)
3. Add the service account email (found in your `credentials.json` file)
4. Give it "Editor" permissions
5. Click "Send"

## Step 5: Configure Environment Variables

1. In the `server` directory, create a `.env` file (if not already created)
2. Add the following variables:

```env
# Google Sheets API Configuration
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./credentials.json
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/insu-raksha

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=5000
```

Replace `your_spreadsheet_id_here` with your actual spreadsheet ID.

## Step 6: Install Dependencies

Make sure you have all required dependencies installed:

```bash
cd server
npm install googleapis dotenv
```

## Step 7: Initialize the Sheets

1. Start your server:
   ```bash
   cd server
   node index.js
   ```

2. Initialize the Google Sheets with headers by making a POST request to:
   ```
   POST http://localhost:5000/api/init-sheets
   ```

   You can use Postman, curl, or any API testing tool:
   ```bash
   curl -X POST http://localhost:5000/api/init-sheets
   ```

## Step 8: Test the Integration

Your forms will now automatically save data to Google Sheets:

- **Quote Requests** → `Quote Requests` sheet
- **Applications** → `Applications` sheet  
- **Consultations** → `Consultations` sheet

Each submission will add a new row with:
- Timestamp (IST)
- All form fields
- Automatic formatting

## Data Structure

### Quote Requests Sheet
| Timestamp | Name | Email | Phone | Insurance Type | Coverage |
|-----------|------|-------|-------|----------------|----------|

### Applications Sheet
| Timestamp | Name | Email | Phone | Date of Birth | Gender | Address | Insurance Type | Previous Insurance | Requirements |
|-----------|------|-------|-------|---------------|--------|---------|----------------|-------------------|--------------|

### Consultations Sheet
| Timestamp | Name | Email | Phone | Preferred Date | Preferred Time | Consultation Type | Current Insurance | Budget | Message |
|-----------|------|-------|-------|----------------|----------------|-------------------|-------------------|--------|---------|

## Troubleshooting

### Common Issues

1. **Authentication Error**
   - Verify `credentials.json` is in the correct location
   - Check that the service account has access to the spreadsheet
   - Ensure the Google Sheets API is enabled

2. **Permission Denied**
   - Make sure the service account email is added to the spreadsheet
   - Verify the service account has "Editor" permissions

3. **Spreadsheet Not Found**
   - Double-check the `GOOGLE_SPREADSHEET_ID` in your `.env` file
   - Ensure the spreadsheet exists and is accessible

4. **Sheet Creation Failed**
   - Run the initialization endpoint: `POST /api/init-sheets`
   - Check server logs for detailed error messages

### Testing Individual Endpoints

You can test each form submission endpoint:

```bash
# Test Quote Request
curl -X POST http://localhost:5000/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "insuranceType": "health",
    "coverage": "premium"
  }'

# Test Application
curl -X POST http://localhost:5000/api/application \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "0987654321",
    "dob": "01/01/1990",
    "gender": "female",
    "address": "123 Main St",
    "insuranceType": "life",
    "previousInsurance": "no",
    "requirements": "Basic coverage needed"
  }'

# Test Consultation
curl -X POST http://localhost:5000/api/consultation \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Smith",
    "email": "bob@example.com",
    "phone": "5555555555",
    "preferredDate": "2024-01-15",
    "preferredTime": "10:00 AM",
    "consultationType": "phone",
    "currentInsurance": "none",
    "budget": "5000",
    "message": "Need help choosing insurance"
  }'
```

## Security Notes

1. **Never commit `credentials.json` to version control**
2. **Add `credentials.json` to your `.gitignore`**
3. **Use environment variables for sensitive data**
4. **Consider using Google Cloud Secret Manager for production**

## Production Considerations

For production deployment:

1. Use Google Cloud Secret Manager instead of local credential files
2. Set up proper error monitoring and logging
3. Implement rate limiting for API endpoints
4. Add data validation and sanitization
5. Consider using Google Apps Script for additional automation

## Support

If you encounter any issues:

1. Check the server console for error messages
2. Verify all environment variables are set correctly
3. Test the Google Sheets API directly using the Google API Explorer
4. Ensure your service account has the necessary permissions

The integration is now ready to use! All form submissions will be automatically saved to your Google Spreadsheet.
