const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function getFields() {
  const pdfBytes = fs.readFileSync('c:\\\\wamp64\\\\www\\\\horizon full project\\\\horizon frontend\\\\public\\\\g-1145.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  fields.forEach(field => {
    const type = field.constructor.name;
    const name = field.getName();
    const widgets = field.acroField.getWidgets();
    const rect = widgets[0].getRectangle();
    console.log(`${name}: x=${rect.x}, y=${rect.y}, w=${rect.width}, h=${rect.height}`);
  });
}

getFields().catch(console.error);
