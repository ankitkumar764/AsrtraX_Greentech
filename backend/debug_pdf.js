const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, '..', 'test_soil_report.pdf');

console.log('🔍 Reading PDF from:', pdfPath);
console.log('📦 File exists:', fs.existsSync(pdfPath));
console.log('📏 File size:', fs.statSync(pdfPath).size, 'bytes');

const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(data => {
  console.log('\n✅ PDF parsed successfully!');
  console.log('📄 Pages:', data.numpages);
  console.log('📝 Raw text:\n---');
  console.log(data.text);
  console.log('---');
  console.log('Text length:', data.text.trim().length, 'chars');

  // Now test the regex patterns
  const patterns = {
    soilN: /(?:Nitrogen|Available\s*N|Total\s*N|N)[:\s=]*([\d.]+)/i,
    soilP: /(?:Phosphorus|Phosphate|P2O5|Available\s*P|P)[:\s=]*([\d.]+)/i,
    soilK: /(?:Potassium|Potash|K2O|Available\s*K|K)[:\s=]*([\d.]+)/i,
    pH: /(?:Soil\s*pH|pH\s*Value|pH)[:\s=]*([\d.]+)/i,
    organicCarbon: /(?:Organic\s*Carbon|OC)[:\s=]*([\d.]+)/i
  };

  console.log('\n🔬 Regex extraction results:');
  Object.keys(patterns).forEach(key => {
    const match = data.text.match(patterns[key]);
    console.log(`  ${key}: ${match ? match[1] : 'NOT FOUND'}`);
  });
}).catch(err => {
  console.error('\n❌ PDF Parse FAILED:');
  console.error(err.message);
});
