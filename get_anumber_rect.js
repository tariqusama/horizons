const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function getCombFieldRect() {
  const pdfBytes = fs.readFileSync('c:\\\\wamp64\\\\www\\\\horizon full project\\\\horizon frontend\\\\public\\\\ar-11.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  
  const aNumberField = form.getTextField('TXT-299a-0-0');
  const widgets = aNumberField.acroField.getWidgets();
  const rect = widgets[0].getRectangle();
  console.log("A-Number Rect:", rect);
}

getCombFieldRect().catch(console.error);
