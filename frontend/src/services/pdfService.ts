import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface InvoiceData {
  _id: string;
  invoiceNo: string;
  date: string;
  dueDate?: string;
  customerName: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
    isTaxable: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export class PDFService {
  static async generateInvoicePDF(invoiceData: InvoiceData): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.setFont('helvetica');

      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE', pageWidth / 2, 30, { align: 'center' });

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Invoice #${invoiceData.invoiceNo}`, 20, 50);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Date: ${new Date(invoiceData.date).toLocaleDateString()}`,
        pageWidth - 20,
        50,
        { align: 'right' }
      );

      // Add due date if available
      if (invoiceData.dueDate) {
        pdf.text(
          `Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}`,
          pageWidth - 20,
          60,
          { align: 'right' }
        );
      }

      // Add customer information
      const billToY = invoiceData.dueDate ? 80 : 70;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bill To:', 20, billToY);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(invoiceData.customerName, 20, billToY + 10);

      // Add line separator
      const separatorY = billToY + 20;
      pdf.setLineWidth(0.5);
      pdf.line(20, separatorY, pageWidth - 20, separatorY);

      const recalculatedItems = invoiceData.items.map((item) => {
        const baseTotal = item.quantity * item.price;
        const taxAmount = item.isTaxable
          ? Math.round((baseTotal * 11) / 100)
          : 0;
        const total = baseTotal + taxAmount;
        return {
          ...item,
          total,
          taxAmount
        };
      });

      const subtotal = recalculatedItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      const totalTax = recalculatedItems.reduce(
        (sum, item) => sum + item.taxAmount,
        0
      );
      const grandTotal = recalculatedItems.reduce(
        (sum, item) => sum + item.total,
        0
      );

      let yPosition = separatorY + 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');

      const descriptionWidth = 80;
      const qtyWidth = 20;
      const priceWidth = 30;
      const ppnWidth = 20;

      const descriptionStart = 20;
      const qtyStart = descriptionStart + descriptionWidth;
      const priceStart = qtyStart + qtyWidth;
      const ppnStart = priceStart + priceWidth;
      const totalStart = ppnStart + ppnWidth;

      pdf.text('Description', descriptionStart, yPosition);
      pdf.text('Qty', qtyStart, yPosition);
      pdf.text('Price', priceStart, yPosition);
      pdf.text('PPN', ppnStart, yPosition);
      pdf.text('Total', totalStart, yPosition);

      yPosition += 5;
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      recalculatedItems.forEach((item, index) => {
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = 20;
        }

        const description = item.description;
        const maxDescriptionWidth = descriptionWidth - 5;

        let processedDescription = description;
        if (description.length > 50) {
          processedDescription = description.replace(/(.{40,}?)\s/g, '$1\n');
        }

        const descriptionLines = pdf.splitTextToSize(
          processedDescription,
          maxDescriptionWidth
        );

        const lineHeight = 5;
        const rowHeight = Math.max(descriptionLines.length * lineHeight, 12);

        if (yPosition + rowHeight > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.text(descriptionLines, descriptionStart, yPosition);

        pdf.text(item.quantity.toString(), qtyStart, yPosition);
        pdf.text(
          `$${item.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`,
          priceStart,
          yPosition
        );
        pdf.text(item.isTaxable ? 'Ya' : 'Tidak', ppnStart, yPosition);
        pdf.text(
          `$${item.total.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`,
          totalStart,
          yPosition
        );

        const extraSpacing = descriptionLines.length > 2 ? 2 : 0;
        yPosition += rowHeight + extraSpacing;

        if (
          descriptionLines.length > 2 &&
          index < recalculatedItems.length - 1
        ) {
          yPosition += 2;
          pdf.setLineWidth(0.2);
          pdf.setDrawColor(200, 200, 200);
          pdf.line(20, yPosition, pageWidth - 20, yPosition);
          yPosition += 3;
          pdf.setDrawColor(0, 0, 0);
        }
      });

      yPosition += 10;
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');

      const labelX = 20;
      const valueX = 150;

      pdf.text('Subtotal:', labelX, yPosition);
      pdf.text(
        `$${subtotal.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        valueX,
        yPosition
      );

      yPosition += 8;
      pdf.text('Tax (11%):', labelX, yPosition);
      pdf.text(
        `$${totalTax.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        valueX,
        yPosition
      );

      yPosition += 8;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Grand Total:', labelX, yPosition);
      pdf.text(
        `$${grandTotal.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        valueX,
        yPosition
      );

      yPosition += 8;
      pdf.setLineWidth(1);
      pdf.line(labelX, yPosition, pageWidth - 20, yPosition);
      yPosition += 15;

      yPosition = pageHeight - 40;

      pdf.setLineWidth(0.5);
      pdf.setDrawColor(0, 0, 0);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Thank you for your business!', pageWidth / 2, yPosition, {
        align: 'center'
      });

      yPosition += 8;
      pdf.setFontSize(9);
      pdf.text(
        `Created: ${new Date(invoiceData.createdAt).toLocaleDateString()}`,
        20,
        yPosition
      );
      if (invoiceData.updatedAt !== invoiceData.createdAt) {
        pdf.text(
          `Last Updated: ${new Date(
            invoiceData.updatedAt
          ).toLocaleDateString()}`,
          pageWidth - 20,
          yPosition,
          { align: 'right' }
        );
      }

      const fileName = `Invoice_${invoiceData.invoiceNo}_${
        new Date().toISOString().split('T')[0]
      }.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  static async generatePDFFromElement(
    elementId: string,
    fileName: string = 'invoice.pdf'
  ): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF from element:', error);
      throw new Error('Failed to generate PDF from element');
    }
  }
}

export default PDFService;
