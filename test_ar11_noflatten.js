const { PDFDocument, StandardFonts } = require('pdf-lib');
const fs = require('fs');

async function testNotFlatten() {
  const pdfBytes = fs.readFileSync('c:\\\\wamp64\\\\www\\\\horizon full project\\\\horizon frontend\\\\public\\\\ar-11.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  
  form.getTextField('TXT-299a-0-0').setText('123456789'); // A-Number
  form.getDropdown('State0').select('NY');
  form.getCheckBox('CHB-fb63-0-3').check(); // Apt

  // DO NOT FLATTEN
  // Update field appearances with a default font
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  form.updateFieldAppearances(helvetica);

  const outBytes = await pdfDoc.save();
  fs.writeFileSync('c:\\\\wamp64\\\\www\\\\horizon full project\\\\horizon frontend\\\\public\\\\test_ar11_noflatten.pdf', outBytes);
  console.log("No flatten PDF saved.");
}

testNotFlatten().catch(console.error);
