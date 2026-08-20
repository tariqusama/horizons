const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function getDropdownOptions() {
  const pdfBytes = fs.readFileSync('c:\\\\wamp64\\\\www\\\\horizon full project\\\\horizon frontend\\\\public\\\\ar-11.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  
  const state0 = form.getDropdown('State0');
  console.log("State0 Options:", state0.getOptions());
}

getDropdownOptions().catch(console.error);
