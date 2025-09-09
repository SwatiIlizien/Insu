import fetch from 'node-fetch';

// Initialize Google Sheets with headers
async function initializeSheets() {
  try {
    console.log('Initializing Google Sheets...');
    
    const response = await fetch('http://localhost:5000/api/init-sheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Google Sheets initialized successfully!');
      console.log('Sheets created:');
      console.log('- Quote Requests');
      console.log('- Applications');
      console.log('- Consultations');
    } else {
      console.error('❌ Failed to initialize sheets:', result.message);
    }
  } catch (error) {
    console.error('❌ Error initializing sheets:', error.message);
    console.log('Make sure your server is running on port 5000');
  }
}

// Test data submission
async function testDataSubmission() {
  try {
    console.log('\nTesting data submission...');
    
    // Test quote request
    const quoteResponse = await fetch('http://localhost:5000/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        insuranceType: 'health',
        coverage: 'premium'
      }),
    });

    if (quoteResponse.ok) {
      console.log('✅ Quote request test successful');
    } else {
      console.log('❌ Quote request test failed');
    }
  } catch (error) {
    console.error('❌ Error testing data submission:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Google Sheets Integration Setup\n');
  
  // Wait a moment for server to be ready
  console.log('Waiting for server to be ready...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await initializeSheets();
  await testDataSubmission();
  
  console.log('\n🎉 Setup complete! Check your Google Spreadsheet for the data.');
}

main().catch(console.error);
