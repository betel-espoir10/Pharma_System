const PDFDocument = require("pdfkit");
const { Sale, SaleItem, Customer, Drug} = require("../models");

// ======================================
// GENERER FACTURE PDF
// ======================================
exports.generateInvoice = async (req, res) => {
  try {
    const sale = await Sale.findByPk(
      req.params.id,
      {
        include: [
          Customer,
          {
            model: SaleItem,
            include: [Drug]
          }
        ]
      }
    );
    // SI VENTE INTROUVABLE
    if (!sale) {
      return res.status(404).send(
        "Facture introuvable"
      );
    }
    // CREATION PDF
    const doc = new PDFDocument({
      margin: 50
    });
    // HEADERS
    res.setHeader(
      "Content-Type",
      "application/pdf"
    );
    res.setHeader(
      "Content-Disposition",
      `inline; filename=invoice-${sale.id}.pdf`
    );
    // ENVOYER PDF AU NAVIGATEUR
    doc.pipe(res);
    // ======================================
    // TITRE
    // ======================================
    doc
      .fontSize(22)
      .text(
        "FACTURE PHARMACIE",
        {
          align: "center"
        }
      );
    doc.moveDown();

    // ======================================
    // INFOS FACTURE
    // ======================================
    doc
      .fontSize(12)
      .text(
        `Facture : ${sale.invoiceNumber}`
      );
    doc.text(
      `Client : ${sale.customer.name}`
    );
    doc.text(
      `Date : ${sale.createdAt}`
    );
    doc.moveDown();

    // ======================================
    // PRODUITS
    // ======================================
    doc
      .fontSize(16)
      .text("Produits");
    doc.moveDown();
    sale.sale_items.forEach(item => {
      doc
        .fontSize(12)
        .text(
          `${item.drug.name}
          | Qté: ${item.quantity}
          | Prix: ${item.unitPrice}
          | Sous-total: ${item.subtotal}`
        );
    });
    doc.moveDown();

    // ======================================
    // TOTAL
    // ======================================
    doc
      .fontSize(16)
      .text(
        `TOTAL : ${sale.totalAmount}`,
        {
          align: "right"
        }
      );
    doc.moveDown();
    doc.text(
      "Merci pour votre achat.",
      {
        align: "center"
      }
    );

    // TERMINER PDF
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send(
      "Erreur génération facture"
    );
  }
};