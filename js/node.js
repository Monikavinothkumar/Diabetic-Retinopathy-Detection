const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();

app.get('/download-pdf', (req, res) => {
  const doc = new PDFDocument();
  
  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

  // Pipe PDF to response
  doc.pipe(res);
  
  // Add content
  doc.fontSize(25).text('Monthly Report', 100, 100);
  doc.fontSize(14).text('Report content goes here...', 100, 150);
  // Add more content as needed
  
  doc.end();
});

app.listen(3000, () => console.log('Server running on port 3000'));