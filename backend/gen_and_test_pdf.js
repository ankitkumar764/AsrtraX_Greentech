const PDFDocument = require('pdfkit');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'test_soil_report.pdf');

async function generateAndTest() {
  // Generate PDF
  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    doc.fontSize(20).font('Helvetica-Bold').text('SOIL TEST REPORT - KVK LAB', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text('Sample ID: SHC-TEST-2024');
    doc.text('Farmer: Ramesh Kumar  Village: Navagam');
    doc.text('Date: 04-04-2024');
    doc.moveDown(1);

    doc.fontSize(14).font('Helvetica-Bold').text('SOIL TEST RESULTS');
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    doc.text('Nitrogen (N):          245 mg/kg   [Medium]');
    doc.text('Phosphorus (P):         38 mg/kg   [Medium]');
    doc.text('Potassium (K):         312 mg/kg   [High]');
    doc.text('pH Value:              6.8            [Neutral]');
    doc.text('Organic Carbon (OC):   0.72 %      [Low]');
    doc.moveDown(1);

    doc.fontSize(14).font('Helvetica-Bold').text('RECOMMENDATIONS');
    doc.fontSize(11).font('Helvetica');
    doc.text('Apply Urea 90 kg/ha to supplement Nitrogen levels.');
    doc.text('Apply DAP 60 kg/ha for Phosphorus deficiency.');
    doc.text('Potassium is adequate. pH is optimal for most crops.');

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  console.log('✅ PDF generated. Size:', fs.statSync(outputPath).size, 'bytes');

  // Immediately test parsing
  const buf = fs.readFileSync(outputPath);
  try {
    const data = await pdf(buf);
    console.log('\n✅ PDF parsed successfully!');
    console.log('Text:\n', data.text);
    
    // Test regex patterns
    const patterns = {
      soilN: /(?:Nitrogen|Available\s*N|Total\s*N|N)[:\s=]*([\d.]+)/i,
      soilP: /(?:Phosphorus|Phosphate|P2O5|Available\s*P|P)[:\s=]*([\d.]+)/i,
      soilK: /(?:Potassium|Potash|K2O|Available\s*K|K)[:\s=]*([\d.]+)/i,
      pH: /(?:Soil\s*pH|pH\s*Value|pH)[:\s=]*([\d.]+)/i,
      organicCarbon: /(?:Organic\s*Carbon|OC)[:\s=]*([\d.]+)/i
    };

    console.log('\n🔬 Regex extraction:');
    Object.keys(patterns).forEach(key => {
      const match = data.text.match(patterns[key]);
      console.log(`  ${key}: ${match ? match[1] : 'NOT FOUND'}`);
    });
  } catch (e) {
    console.error('❌ Parse fail:', e.message);
  }
}

generateAndTest();
