import { jsPDF } from 'jspdf';

interface SubscriptionInvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  subscription: {
    packageName: string;
    duration: number;
    startDate: string;
    endDate: string;
  };
  payment: {
    amount: number;
    status: string;
    paymentMethod?: string;
    razorpayPaymentId?: string;
  };
  seller?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

// Load logo as base64 with proper aspect ratio handling
async function loadLogoAsBase64(): Promise<{ data: string; width: number; height: number } | null> {
  try {
    const response = await fetch('/VenGrow.png');
    if (!response.ok) {
      console.warn('Logo not found, using text fallback');
      return null;
    }
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        
        // Create an image to get natural dimensions
        const img = new Image();
        img.onload = () => {
          resolve({
            data: base64,
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        };
        img.onerror = () => resolve({ data: base64, width: 200, height: 60 });
        img.src = base64;
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Error loading logo:', error);
    return null;
  }
}

export async function generateSubscriptionInvoicePDF(data: SubscriptionInvoiceData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Colors
  const primaryGreen: [number, number, number] = [15, 107, 74];
  const darkText: [number, number, number] = [31, 41, 55];
  const grayText: [number, number, number] = [107, 114, 128];
  const lightGray: [number, number, number] = [156, 163, 175];
  const borderGray: [number, number, number] = [209, 213, 219];
  const headerBg: [number, number, number] = [249, 250, 251];

  // ==================== HEADER ====================
  
  // Logo
  const logoInfo = await loadLogoAsBase64();
  if (logoInfo) {
    try {
      const targetHeight = 22;
      const aspectRatio = logoInfo.width / logoInfo.height;
      const logoWidth = Math.min(targetHeight * aspectRatio, 45);
      const logoHeight = logoWidth / aspectRatio;
      doc.addImage(logoInfo.data, 'PNG', margin, yPos, logoWidth, logoHeight);
    } catch (error) {
      doc.setTextColor(...primaryGreen);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('VenGrow', margin, yPos + 12);
    }
  } else {
    doc.setTextColor(...primaryGreen);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('VenGrow', margin, yPos + 12);
  }

  // Title
  doc.setTextColor(...darkText);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', pageWidth - margin, yPos + 6, { align: 'right' });
  
  // Invoice Number
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  doc.text(`Invoice No: ${data.invoiceNumber}`, pageWidth - margin, yPos + 14, { align: 'right' });
  
  // Status Badge
  const isPaid = data.payment.status === 'completed';
  const badgeColor: [number, number, number] = isPaid ? [34, 197, 94] : [234, 179, 8];
  const badgeText = isPaid ? 'PAID' : 'PENDING';
  const badgeW = 30;
  const badgeH = 7;
  const badgeX = pageWidth - margin - badgeW;
  const badgeY = yPos + 18;
  
  doc.setFillColor(...badgeColor);
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(badgeText, badgeX + badgeW / 2, badgeY + 5, { align: 'center' });

  yPos = 52;

  // ==================== BILL TO & DATE INFO ====================
  
  // Bill To
  doc.setTextColor(...darkText);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', margin, yPos);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  yPos += 5;
  
  if (data.seller?.name) {
    doc.text(data.seller.name, margin, yPos);
    yPos += 4;
  }
  if (data.seller?.email) {
    doc.text(data.seller.email, margin, yPos);
    yPos += 4;
  }
  if (data.seller?.phone) {
    doc.text(data.seller.phone, margin, yPos);
    yPos += 4;
  }
  if (!data.seller?.name && !data.seller?.email && !data.seller?.phone) {
    doc.text('Subscription Payment', margin, yPos);
  }

  // Date info (right side)
  doc.setTextColor(...grayText);
  doc.setFontSize(9);
  doc.text(`Invoice Date: ${data.invoiceDate}`, pageWidth - margin, 57, { align: 'right' });
  doc.text('Place of Supply: Karnataka', pageWidth - margin, 62, { align: 'right' });

  yPos = 78;

  // Divider line
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.4);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 12;

  // ==================== TABLE ====================
  
  const tableLeft = margin;
  const tableRight = pageWidth - margin;
  const tableWidth = tableRight - tableLeft;
  
  // Column definitions (fixed pixel positions)
  const col1Start = tableLeft;
  const col2Start = tableLeft + tableWidth * 0.55;
  const col3Start = tableLeft + tableWidth * 0.75;
  
  const headerHeight = 10;
  const rowHeight = 22;
  const padding = 6;

  // ----- Header Row -----
  doc.setFillColor(...headerBg);
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.3);
  
  // Header background
  doc.rect(tableLeft, yPos, tableWidth, headerHeight, 'FD');
  
  // Header vertical lines
  doc.line(col2Start, yPos, col2Start, yPos + headerHeight);
  doc.line(col3Start, yPos, col3Start, yPos + headerHeight);
  
  // Header text
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkText);
  
  const headerY = yPos + 7;
  doc.text('Description', col1Start + padding, headerY);
  doc.text('SAC Code', col2Start + (col3Start - col2Start) / 2, headerY, { align: 'center' });
  doc.text('Amount', tableRight - padding, headerY, { align: 'right' });
  
  yPos += headerHeight;

  // ----- Data Row -----
  doc.setFillColor(255, 255, 255);
  doc.rect(tableLeft, yPos, tableWidth, rowHeight, 'FD');
  
  // Data row vertical lines
  doc.line(col2Start, yPos, col2Start, yPos + rowHeight);
  doc.line(col3Start, yPos, col3Start, yPos + rowHeight);
  
  // Description content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkText);
  doc.text(`${data.subscription.packageName} Package`, col1Start + padding, yPos + 9);
  
  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  doc.text(`Subscription for ${data.subscription.duration} days`, col1Start + padding, yPos + 15);
  
  // SAC Code (centered in column)
  doc.setFontSize(9);
  doc.setTextColor(...darkText);
  const sacCodeX = col2Start + (col3Start - col2Start) / 2;
  doc.text('997221', sacCodeX, yPos + 12, { align: 'center' });
  
  // Amount (right aligned in column)
  const subtotal = data.payment.amount || 0;
  doc.setFont('helvetica', 'bold');
  doc.text(`₹${subtotal.toLocaleString('en-IN')}`, tableRight - padding, yPos + 12, { align: 'right' });

  yPos += rowHeight + 16;

  // ==================== TOTALS ====================
  
  const gstAmount = Math.round(subtotal * 0.18);
  const cgst = Math.round(gstAmount / 2);
  const sgst = Math.round(gstAmount / 2);
  const total = subtotal + gstAmount;
  
  const labelX = pageWidth - margin - 55;
  const valueX = pageWidth - margin;
  const lineSpacing = 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  
  // Subtotal
  doc.text('Subtotal:', labelX, yPos, { align: 'right' });
  doc.setTextColor(...darkText);
  doc.text(`₹${subtotal.toLocaleString('en-IN')}`, valueX, yPos, { align: 'right' });
  yPos += lineSpacing;

  // CGST
  doc.setTextColor(...grayText);
  doc.text('CGST @ 9%:', labelX, yPos, { align: 'right' });
  doc.setTextColor(...darkText);
  doc.text(`₹${cgst.toLocaleString('en-IN')}`, valueX, yPos, { align: 'right' });
  yPos += lineSpacing;

  // SGST
  doc.setTextColor(...grayText);
  doc.text('SGST @ 9%:', labelX, yPos, { align: 'right' });
  doc.setTextColor(...darkText);
  doc.text(`₹${sgst.toLocaleString('en-IN')}`, valueX, yPos, { align: 'right' });
  yPos += 4;

  // Total divider
  doc.setDrawColor(...darkText);
  doc.setLineWidth(0.5);
  doc.line(labelX - 20, yPos, valueX, yPos);
  yPos += 6;

  // Total
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkText);
  doc.text('Total:', labelX, yPos, { align: 'right' });
  doc.text(`₹${total.toLocaleString('en-IN')}`, valueX, yPos, { align: 'right' });

  yPos += 16;

  // ==================== PAYMENT INFO ====================
  
  if (data.payment.paymentMethod || data.payment.razorpayPaymentId) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayText);
    
    if (data.payment.paymentMethod) {
      doc.text(`Payment Mode: ${data.payment.paymentMethod}`, margin, yPos);
      yPos += 5;
    }
    if (data.payment.razorpayPaymentId) {
      doc.text(`Payment ID: ${data.payment.razorpayPaymentId}`, margin, yPos);
      yPos += 5;
    }
    yPos += 8;
  }

  // ==================== TERMS ====================
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...grayText);
  doc.text('Terms & Conditions:', margin, yPos);
  yPos += 4;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightGray);
  const terms = [
    '1. Payment once made is non-refundable.',
    '2. Invoice valid for accounting & GST purposes.',
    '3. Any disputes subject to Bangalore jurisdiction.',
    '4. Payment should be made on or before the due date.'
  ];
  
  terms.forEach(term => {
    doc.text(term, margin, yPos);
    yPos += 3.5;
  });

  // ==================== FOOTER ====================
  
  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 16, { align: 'center' });
  doc.text('Visit us at: https://vengrow.com | Email: support@vengrow.com', pageWidth / 2, pageHeight - 11, { align: 'center' });

  // Save
  doc.save(`VenGrow-Invoice-${data.invoiceNumber}.pdf`);
}