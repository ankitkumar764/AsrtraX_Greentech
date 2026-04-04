const { extractSoilMetrics } = require('./utils/soilParser');

const sampleText = `
  REPORT SUMMARY
  Nitrogen (N): 245.5 kg/ha
  Available P: 18.2
  K2O content: 156
  pH: 6.8
  OC: 0.52 %
`;

console.log('Testing Soil Parser with sample text:');
console.log(extractSoilMetrics(sampleText));
