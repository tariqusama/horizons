const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function fillFields() {
  const pdfBytes = fs.readFileSync('c:\\\\wamp64\\\\www\\\\horizon full project\\\\horizon frontend\\\\public\\\\g-1145.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  
  const setTextField = (form, name, value) => {
    try {
      const field = form.getTextField(name);
      field.setText(value);
    } catch (e) {
      console.error(`Could not set text field ${name}`, e);
    }
  };

  setTextField(form, 'A2', 'A2');
  setTextField(form, 'A3', 'A3');
  setTextField(form, 'A4', 'A4');
  setTextField(form, 'A5', 'A5');
  setTextField(form, 'A6', 'A6');

  const outPdfBytes = await pdfDoc.save();
  fs.writeFileSync('c:\\\\wamp64\\\\www\\\\horizon full project\\\\horizon frontend\\\\public\\\\test_g1145_fields.pdf', outPdfBytes);
}

fillFields().catch(console.error);
