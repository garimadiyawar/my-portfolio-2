const docxPdf = require('docx-pdf');
const path = require('path');

const docxPath = path.join(__dirname, 'public', 'Garima_Diyawar_Resume.docx');
const pdfPath = path.join(__dirname, 'public', 'Garima_Diyawar_Resume.pdf');

docxPdf(docxPath, pdfPath, (err) => {
  if (err) {
    console.error('Conversion failed:', err);
    process.exit(1);
  }
  console.log('Successfully converted Garima_Diyawar_Resume.docx to PDF');
  console.log('PDF saved at:', pdfPath);
});
