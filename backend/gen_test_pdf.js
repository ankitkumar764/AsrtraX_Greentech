const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'test_soil_report.pdf');
const doc = new PDFDocument({ margin: 50 });
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Header
doc.fontSize(20).font('Helvetica-Bold').text('SOIL TEST REPORT - KVK LAB', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('─'.repeat(65), { align: 'center' });
doc.moveDown(0.5);

// Farm Details
doc.fontSize(11).font('Helvetica').text('Sample ID: SHC-TEST-2024');
doc.text('Farmer: Ramesh Kumar');
doc.text('Village: Navagam    District: Gandhinagar');
doc.text('Date: 04-04-2024');
doc.moveDown(1);

// Section Title
doc.fontSize(14).font('Helvetica-Bold').text('SOIL TEST RESULTS');
doc.moveDown(0.5);
doc.fontSize(11).font('Helvetica').text('─'.repeat(65));
doc.moveDown(0.3);

// Parameters
const rows = [
  ['Nitrogen (N)', '245', 'mg/kg', 'Medium'],
  ['Phosphorus (P)', '38', 'mg/kg', 'Medium'],
  ['Potassium (K)', '312', 'mg/kg', 'High'],
  ['pH Value', '6.8', '', 'Neutral'],
  ['Organic Carbon (OC)', '0.72', '%', 'Low'],
];

doc.fontSize(11);
rows.forEach(([param, val, unit, status]) => {
  doc.font('Helvetica-Bold').text(`${param}:`, { continued: true });
  doc.font('Helvetica').text(`   ${val} ${unit}    [${status}]`);
  doc.moveDown(0.3);
});

doc.moveDown(1);
doc.fontSize(14).font('Helvetica-Bold').text('RECOMMENDATIONS');
doc.moveDown(0.5);
doc.fontSize(11).font('Helvetica');
doc.text('• Apply Urea 90 kg/ha to supplement Nitrogen levels.');
doc.text('• Apply DAP 60 kg/ha for Phosphorus deficiency.');
doc.text('• Potassium levels are adequate. No supplement needed.');
doc.text('• Soil pH is optimal for most crops.');

doc.end();

stream.on('finish', () => {
  console.log('✅ Test PDF created at:', outputPath);
  console.log('📏 File size:', fs.statSync(outputPath).size, 'bytes');
});
stream.on('error', (e) => console.error('Error:', e));
