import { google } from 'googleapis';

class GoogleSheetsService {
  constructor() {
    this.sheets = google.sheets({ version: 'v4' });
    this.auth = null;
  }

  // Initialize authentication
  async initializeAuth() {
    try {
      // For service account authentication
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || './credentials.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.auth = await auth.getClient();
      console.log('Google Sheets authentication initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Google Sheets auth:', error);
      return false;
    }
  }

  // Add data to a specific sheet
  async addDataToSheet(spreadsheetId, range, values) {
    try {
      if (!this.auth) {
        await this.initializeAuth();
      }

      const response = await this.sheets.spreadsheets.values.append({
        auth: this.auth,
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
          values: [values]
        }
      });

      console.log('Data added to sheet successfully:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error adding data to sheet:', error);
      return { success: false, error: error.message };
    }
  }

  // Get data from a specific sheet
  async getDataFromSheet(spreadsheetId, range) {
    try {
      if (!this.auth) {
        await this.initializeAuth();
      }

      const response = await this.sheets.spreadsheets.values.get({
        auth: this.auth,
        spreadsheetId: spreadsheetId,
        range: range,
      });

      return { success: true, data: response.data.values || [] };
    } catch (error) {
      console.error('Error getting data from sheet:', error);
      return { success: false, error: error.message };
    }
  }

  // Create a new sheet if it doesn't exist
  async createSheetIfNotExists(spreadsheetId, sheetName) {
    try {
      if (!this.auth) {
        await this.initializeAuth();
      }

      // First, get the spreadsheet to check existing sheets
      const spreadsheet = await this.sheets.spreadsheets.get({
        auth: this.auth,
        spreadsheetId: spreadsheetId,
      });

      const existingSheets = spreadsheet.data.sheets.map(sheet => sheet.properties.title);
      
      if (!existingSheets.includes(sheetName)) {
        // Create new sheet
        await this.sheets.spreadsheets.batchUpdate({
          auth: this.auth,
          spreadsheetId: spreadsheetId,
          resource: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName
                }
              }
            }]
          }
        });
        console.log(`Sheet '${sheetName}' created successfully`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating sheet:', error);
      return { success: false, error: error.message };
    }
  }

  // Add headers to a sheet
  async addHeaders(spreadsheetId, sheetName, headers) {
    try {
      if (!this.auth) {
        await this.initializeAuth();
      }

      const range = `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`;
      
      const response = await this.sheets.spreadsheets.values.update({
        auth: this.auth,
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
          values: [headers]
        }
      });

      console.log('Headers added successfully');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error adding headers:', error);
      return { success: false, error: error.message };
    }
  }
}

export default GoogleSheetsService;
