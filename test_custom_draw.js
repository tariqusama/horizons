const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');

async function testCustomDraw() {
  const pdfBytes = fs.readFileSync('c:\\\\wamp64\\\\www\\\\horizon full project\\\\horizon frontend\\\\public\\\\ar-11.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  
  // Set some dropdown to test if it flattens properly
  form.getDropdown('State0').select('NY');

  // Instead of setting A-Number text field, draw it manually
  const aNumber = '123456789';
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const font = await pdfDoc.embedFont(StandardFonts.CourierBold);

  const startX = 203.998;
  const startY = 600.001;
  const cellWidth = 138.01 / 9; // 15.334

  for (let i = 0; i < aNumber.length; i++) {
    firstPage.drawText(aNumber[i], {
      x: startX + (i * cellWidth) + 4, // Add slight offset for padding inside cell
      y: startY + 5, // slightly above the bottom border
      size: 11,
      font: font,
      color: rgb(0, 0, 0),
    });
  }

  form.flatten();
  
  const outBytes = await pdfDoc.save();
  fs.writeFileSync('c:\\\\wamp64\\\\www\\\\horizon full project\\\\horizon frontend\\\\public\\\\test_ar11_custom_draw.pdf', outBytes);
  console.log("Custom draw PDF saved.");
}

testCustomDraw().catch(console.error);
