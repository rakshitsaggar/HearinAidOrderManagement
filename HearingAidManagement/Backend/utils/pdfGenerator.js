const PDFDocument = require('pdfkit');

function generateInvoice(order, customer, items, res) {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.id}.pdf`);

  doc.fontSize(20).text(`Invoice #${order.id}`);
  doc.text(`Customer: ${customer.first_name} ${customer.last_name}`);
  doc.text(`Email: ${customer.email}`);
  doc.text('----------------------');

  items.forEach(i => {
    doc.text(`${i.HearingAid.brand} ${i.HearingAid.model}: ₹${i.unit_price} x ${i.quantity} (${i.ear_side})`);
  });

  doc.text('----------------------');
  doc.text(`Total: ₹${order.total_amount}`);
  doc.text(`Insurance Discount: ₹${order.insurance_discount}`);
  doc.text(`Final Amount: ₹${order.final_amount}`);

  doc.end();
  doc.pipe(res);
}
module.exports = generateInvoice;