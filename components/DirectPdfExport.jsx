"use client";

import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

export const generateDirectPDF = async (
  data,
  filename = "lease-summary.pdf"
) => {
  try {
    // Show loading state

    const loadingOverlay = document.createElement("div");
    loadingOverlay.style.position = "fixed";
    loadingOverlay.style.top = "0";
    loadingOverlay.style.left = "0";
    loadingOverlay.style.width = "100%";
    loadingOverlay.style.height = "100%";
    loadingOverlay.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
    loadingOverlay.style.display = "flex";
    loadingOverlay.style.justifyContent = "center";
    loadingOverlay.style.alignItems = "center";
    loadingOverlay.style.zIndex = "9999";
    loadingOverlay.innerHTML = "<div>Generating PDF...</div>";
    document.body.appendChild(loadingOverlay);

    // Create PDF document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add fonts if needed
    pdf.setFont("helvetica");

    // Set initial position
    let y = 20;
    const margin = 15;
    const pageWidth = 210;
    const contentWidth = pageWidth - 2 * margin;

    // Helper function to add a new page if needed
    const checkPageBreak = (height) => {
      if (y + height > 280) {
        pdf.addPage();
        y = 20;
        return true;
      }
      return false;
    };

    // Helper function to add a section title
    const addSectionTitle = (title) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text(title, margin, y);
      y += 8;
    };

    // Helper function to add a subsection title
    const addSubsectionTitle = (title) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      pdf.text(title, margin, y);
      y += 6;
    };

    // Helper function to add a table
    const addTable = (headers, rows, columnStyles = {}) => {
      checkPageBreak(10 + rows.length * 8);
      pdf.autoTable({
        head: [headers],
        body: rows,
        startY: y,
        margin: { left: margin, right: margin },
        columnStyles: columnStyles,
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [60, 60, 60],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250],
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
      });
      y = pdf.lastAutoTable.finalY + 10;
    };

    // Helper function to add a key-value section
    const addKeyValueSection = (items, columns = 1) => {
      const itemsPerColumn = Math.ceil(items.length / columns);
      const columnWidth = contentWidth / columns;

      for (let i = 0; i < items.length; i += itemsPerColumn) {
        const columnItems = items.slice(i, i + itemsPerColumn);
        const startX = margin + (i / itemsPerColumn) * columnWidth;

        let localY = y;
        columnItems.forEach((item, index) => {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(item.label, startX, localY);

          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text(item.value, startX + columnWidth - 40, localY);

          localY += 6;
        });
      }

      y += itemsPerColumn * 6 + 5;
    };

    // Add title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Lease Summary", margin, y);
    y += 15;

    // Add tenant information
    addSectionTitle("Tenant Information");
    const tenantItems = [
      { label: "Name:", value: data.tenant.name },
      { label: "Credit Rating:", value: data.tenant.creditRating },
      { label: "Industry:", value: data.tenant.industry },
      { label: "Parent Company:", value: data.tenant.parentCompany },
    ];
    addKeyValueSection(tenantItems);

    // Add lease term information
    addSectionTitle("Lease Term");
    const daysUntilExpiration = Math.round(
      (new Date(data.lease.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    const yearsRemaining = (daysUntilExpiration / 365).toFixed(1);

    const leaseTermItems = [
      {
        label: "Start Date:",
        value: new Date(data.lease.startDate).toLocaleDateString(),
      },
      {
        label: "Expiry Date:",
        value: new Date(data.lease.expiryDate).toLocaleDateString(),
      },
      { label: "Term:", value: `${data.lease.term} years` },
      { label: "Remaining:", value: `${yearsRemaining} years` },
    ];
    addKeyValueSection(leaseTermItems);

    // Add rent information
    addSectionTitle("Rent Information");
    const totalRent = data.lease.rentComponents.reduce(
      (sum, component) => sum + component.amount,
      0
    );

    const rentItems = [
      { label: "Base Rent:", value: `$${data.lease.baseRent} PSF` },
      { label: "Total Rent:", value: `$${totalRent.toFixed(2)} PSF` },
      {
        label: "Annual Rent:",
        value: `$${(
          data.lease.baseRent * data.property.squareFootage
        ).toLocaleString()}`,
      },
      {
        label: "Escalation:",
        value: data.lease.escalations[0].rate + " annually",
      },
    ];
    addKeyValueSection(rentItems);

    // Add rent components table
    checkPageBreak(50);
    addSectionTitle("Rent Components");

    const rentComponentsHeaders = ["Component", "Amount"];
    const rentComponentsRows = data.lease.rentComponents.map((component) => [
      component.type,
      `$${component.amount.toFixed(2)} ${component.psf ? "PSF" : ""}`,
    ]);

    // Add total row
    rentComponentsRows.push(["Total", `$${totalRent.toFixed(2)} PSF`]);

    addTable(rentComponentsHeaders, rentComponentsRows, {
      0: { halign: "left" },
      1: { halign: "right" },
    });

    // Add rent escalations table
    checkPageBreak(50);
    addSectionTitle("Rent Escalations");

    const escalationsHeaders = ["Year", "Increase", "Rent (PSF)"];
    const escalationsRows = data.lease.escalations.map((escalation) => [
      `Year ${escalation.year}`,
      escalation.rate,
      `$${escalation.amount.toFixed(2)}`,
    ]);

    addTable(escalationsHeaders, escalationsRows, {
      0: { halign: "left" },
      1: { halign: "center" },
      2: { halign: "right" },
    });

    // Add renewal options table
    checkPageBreak(50);
    addSectionTitle("Renewal Options");

    const renewalHeaders = ["Option", "Term", "Type", "Notice Period"];
    const renewalRows = data.lease.renewalOptions.map((option, index) => [
      `Option ${index + 1}`,
      `${option.term} years`,
      option.type,
      option.notice,
    ]);

    addTable(renewalHeaders, renewalRows);

    // Add recovery terms
    checkPageBreak(50);
    addSectionTitle("Recovery Terms");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("CAM (Common Area Maintenance)", margin, y);
    y += 6;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(data.lease.recoveryTerms.cam, margin, y);
    y += 10;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Property Taxes", margin, y);
    y += 6;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(data.lease.recoveryTerms.taxes, margin, y);
    y += 10;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Insurance", margin, y);
    y += 6;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(data.lease.recoveryTerms.insurance, margin, y);
    y += 15;

    // Add risk factors
    checkPageBreak(60);
    addSectionTitle("Risk Analysis");

    data.riskFactors.forEach((factor, index) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);

      // Set color based on risk level
      if (factor.risk.toLowerCase() === "low") {
        pdf.setTextColor(22, 101, 52); // green
      } else if (factor.risk.toLowerCase() === "medium") {
        pdf.setTextColor(133, 77, 14); // yellow/orange
      } else {
        pdf.setTextColor(153, 27, 27); // red
      }

      pdf.text(`${factor.type} (${factor.risk} Risk)`, margin, y);
      y += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(factor.description, margin, y);
      y += 10;
    });

    // Add footer with date
    const today = new Date().toLocaleDateString();
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Generated on ${today}`, margin, 285);

    // Save the PDF
    pdf.save(filename);

    // Remove loading overlay
    document.body.removeChild(loadingOverlay);

    return true;
  } catch (error) {
    console.error("Error generating direct PDF:", error);
    alert("There was an error generating the PDF. Please try again.");

    // Remove loading overlay if it exists
    const overlay = document.querySelector("div[style*='position: fixed']");
    if (overlay) {
      document.body.removeChild(overlay);
    }

    return false;
  }
};

export default generateDirectPDF;
