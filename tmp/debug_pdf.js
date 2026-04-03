const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, '..', 'test_soil_report.pdf');

console.log('🔍 Reading PDF from:', pdfPath);

const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(data => {
  console.log('\n✅ PDF parsed successfully!');
  console.log('📄 Number of pages:', data.numpages);
  console.log('📝 Raw text extracted:\n---');
  console.log(data.text);
  console.log('---');
  console.log('\nText length:', data.text.trim().length, 'characters');
}).catch(err => {
  console.error('\n❌ PDF Parse FAILED with error:');
  console.error(err.message);
  console.error(err.stack);
});
