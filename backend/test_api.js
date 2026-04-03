const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const http = require('http');

const pdfPath = path.join(__dirname, '..', 'test_soil_report.pdf');
console.log('📄 Testing with PDF:', pdfPath);
console.log('📏 File size:', fs.statSync(pdfPath).size, 'bytes');

const form = new FormData();
form.append('report', fs.createReadStream(pdfPath), {
  filename: 'test_soil_report.pdf',
  contentType: 'application/pdf'
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/soil/upload-report',
  method: 'POST',
  headers: form.getHeaders()
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('\n📬 Response Status:', res.statusCode);
    try {
      const parsed = JSON.parse(body);
      console.log('📦 Response Body:', JSON.stringify(parsed, null, 2));
    } catch {
      console.log('📦 Raw Response:', body);
    }
  });
});

req.on('error', e => {
  console.error('❌ Request Error:', e.message);
  console.error('Make sure backend is running on port 5001!');
});

form.pipe(req);
