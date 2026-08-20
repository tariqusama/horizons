const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function testFlatten() {
  const pdfBytes = fs.readFileSync('c:\\\\wamp64\\\\www\\\\horizon full project\\\\horizon frontend\\\\public\\\\ar-11.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  
  form.getTextField('TXT-299a-0-0').setText('123456789'); // A-Number
  form.getDropdown('State0').select('NY');
  form.getCheckBox('CHB-fb63-0-3').check(); // Apt

  form.flatten();
  const outBytes = await pdfDoc.save();
  fs.writeFileSync('c:\\\\wamp64\\\\www\\\\horizon full project\\\\horizon frontend\\\\public\\\\test_ar11_flatten.pdf', outBytes);
  console.log("Flattened PDF saved.");
}

testFlatten().catch(console.error);
