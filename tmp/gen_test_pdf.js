const fs = require('fs');
const path = require('path');

// Helper: create a minimal, valid PDF with readable text
function createPDF(text) {
  const stream = `BT\n/F1 14 Tf\n50 750 Td\n${text}\nET`;
  const streamLen = Buffer.byteLength(stream, 'utf8');

  const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]\n   /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n`;
  const obj4 = `4 0 obj\n<< /Length ${streamLen} >>\nstream\n${stream}\nendstream\nendobj\n`;
  const obj5 = `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;

  const header = `%PDF-1.4\n`;
  let body = header + obj1 + obj2 + obj3 + obj4 + obj5;

  // Build basic xref table
  const offsets = [];
  let pos = header.length;
  [obj1, obj2, obj3, obj4, obj5].forEach(o => {
    offsets.push(pos);
    pos += Buffer.byteLength(o, 'utf8');
  });

  const xrefPos = pos;
  const xref = `xref\n0 6\n0000000000 65535 f \n${offsets.map(o => String(o).padStart(10, '0') + ' 00000 n ').join('\n')}\n`;
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;

  return body + xref + trailer;
}

const reportText = [
  `(SOIL TEST REPORT - KVK LAB) Tj`,
  `0 -25 Td (Sample ID: SHC-TEST-2024) Tj`,
  `0 -20 Td (Farmer: Ramesh Kumar  Village: Navagam) Tj`,
  `0 -20 Td (Date: 04-04-2024) Tj`,
  `0 -30 Td (SOIL TEST RESULTS) Tj`,
  `0 -20 Td (Nitrogen: 245 mg/kg) Tj`,
  `0 -20 Td (Phosphorus: 38 mg/kg) Tj`,
  `0 -20 Td (Potassium: 312 mg/kg) Tj`,
  `0 -20 Td (pH Value: 6.8) Tj`,
  `0 -20 Td (Organic Carbon: 0.72 %) Tj`,
].join('\n');

const pdfBuffer = createPDF(reportText);
const outputPath = path.join(__dirname, 'test_soil_report.pdf');
fs.writeFileSync(outputPath, pdfBuffer, 'binary');
console.log('✅ PDF created at:', outputPath);
