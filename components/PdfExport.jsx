"use client";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (
  elementId,
  filename = "lease-summary.pdf"
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found");
    return;
  }

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

    // Create a clone of the element to avoid modifying the original
    const clone = element.cloneNode(true);

    // Set fixed width for better PDF quality and consistent layout
    clone.style.width = "800px";
    clone.style.maxWidth = "800px";
    clone.style.padding = "20px";
    clone.style.position = "absolute";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";
    clone.style.backgroundColor = "white";
    document.body.appendChild(clone);

    // Hide buttons in the clone
    const buttons = clone.querySelectorAll(".pdf-hide");
    buttons.forEach((button) => {
      button.style.display = "none";
    });

    // Make sure all sections are expanded in the clone
    const collapsibleSections = clone.querySelectorAll(
      "[data-section-content]"
    );
    collapsibleSections.forEach((section) => {
      section.style.display = "block";
    });

    // Hide all toggle buttons in the clone
    const toggleButtons = clone.querySelectorAll("[data-toggle-button]");
    toggleButtons.forEach((button) => {
      button.style.display = "none";
    });

    // Show fallback images for canvas elements
    const canvasContainers = clone.querySelectorAll(".timeline-container");
    canvasContainers.forEach((container) => {
      const canvas = container.querySelector("canvas");
      const fallbackImg = container.querySelector(".pdf-only");

      if (canvas && fallbackImg) {
        canvas.style.display = "none";
        fallbackImg.style.display = "block";
      }
    });

    // Replace all canvas elements with their image data
    const canvases = clone.querySelectorAll("canvas");
    canvases.forEach((canvas) => {
      try {
        // Try to get the fallback image if it exists
        const parent = canvas.parentNode;
        const fallbackImg = parent.querySelector(".pdf-only");

        if (fallbackImg) {
          canvas.style.display = "none";
          fallbackImg.style.display = "block";
        } else {
          // If no fallback, create a static image from the canvas
          const img = document.createElement("img");
          img.src = canvas.toDataURL("image/png");
          img.style.width = "100%";
          img.style.height = "auto";
          canvas.style.display = "none";
          parent.appendChild(img);
        }
      } catch (e) {
        console.error("Error converting canvas to image:", e);
      }
    });

    // Add a small delay to ensure all replacements are done
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate canvas from the element
    const canvas = await html2canvas(clone, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "white",
    });

    // Remove the clone after capturing
    document.body.removeChild(clone);

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // If the content is longer than one page, add more pages
    let heightLeft = imgHeight;
    let position = 0;
    const pageHeight = 295; // A4 height in mm

    while (heightLeft > pageHeight) {
      position = heightLeft - pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(filename);

    // Remove loading overlay
    document.body.removeChild(loadingOverlay);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("There was an error generating the PDF. Please try again.");
  }
};

export default generatePDF;
