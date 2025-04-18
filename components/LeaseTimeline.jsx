"use client";

import { useEffect, useRef, useState } from "react";

const LeaseTimeline = ({ startDate, expiryDate, renewalOptions }) => {
  const canvasRef = useRef(null);
  const [fallbackImage, setFallbackImage] = useState(null);

  const drawTimelineAndGetImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    const startDateObj = new Date(startDate);
    const expiryDateObj = new Date(expiryDate);

    const primaryTerm =
      (expiryDateObj - startDateObj) / (1000 * 60 * 60 * 24 * 365);

    const totalRenewalYears = renewalOptions.reduce(
      (sum, option) => sum + option.term,
      0
    );
    const totalTimelineYears = primaryTerm + totalRenewalYears;

    // Set canvas dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Fill with white background
    ctx.fillStyle = "#f9fafb"; // Light gray background matching the container
    ctx.fillRect(0, 0, width, height);

    // Draw timeline
    const timelineY = height / 2;
    const timelineStartX = 50;
    const timelineEndX = width - 50;
    const timelineLength = timelineEndX - timelineStartX;

    // Draw main timeline line
    ctx.beginPath();
    ctx.moveTo(timelineStartX, timelineY);
    ctx.lineTo(timelineEndX, timelineY);
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw primary term
    const primaryTermLength =
      (primaryTerm / totalTimelineYears) * timelineLength;
    ctx.beginPath();
    ctx.moveTo(timelineStartX, timelineY);
    ctx.lineTo(timelineStartX + primaryTermLength, timelineY);
    ctx.strokeStyle = "#4F46E5";
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw renewal options
    let currentX = timelineStartX + primaryTermLength;
    renewalOptions.forEach((option, index) => {
      const optionLength = (option.term / totalTimelineYears) * timelineLength;
      ctx.beginPath();
      ctx.moveTo(currentX, timelineY);
      ctx.lineTo(currentX + optionLength, timelineY);
      ctx.strokeStyle = "#9CA3AF";
      ctx.lineWidth = 8;
      ctx.stroke();

      currentX += optionLength;
    });

    // Draw start point
    ctx.beginPath();
    ctx.arc(timelineStartX, timelineY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#4F46E5";
    ctx.fill();

    // Draw expiry point
    ctx.beginPath();
    ctx.arc(timelineStartX + primaryTermLength, timelineY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#4F46E5";
    ctx.fill();

    // Draw renewal option points
    currentX = timelineStartX + primaryTermLength;
    renewalOptions.forEach((option, index) => {
      const optionLength = (option.term / totalTimelineYears) * timelineLength;
      currentX += optionLength;

      ctx.beginPath();
      ctx.arc(currentX, timelineY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = "#9CA3AF";
      ctx.fill();
    });

    // Add labels
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.textAlign = "center";

    // Start date label
    ctx.fillText(formatDate(startDate), timelineStartX, timelineY - 20);
    ctx.fillText("Start", timelineStartX, timelineY + 30);

    // Expiry date label
    ctx.fillText(
      formatDate(expiryDate),
      timelineStartX + primaryTermLength,
      timelineY - 20
    );
    ctx.fillText("Expiry", timelineStartX + primaryTermLength, timelineY + 30);

    // Renewal option labels
    currentX = timelineStartX + primaryTermLength;
    renewalOptions.forEach((option, index) => {
      const optionLength = (option.term / totalTimelineYears) * timelineLength;
      currentX += optionLength;

      const renewalDate = new Date(expiryDate);
      renewalDate.setFullYear(
        renewalDate.getFullYear() + option.term * (index + 1)
      );

      ctx.fillText(formatDate(renewalDate), currentX, timelineY - 20);
      ctx.fillText(`Option ${index + 1}`, currentX, timelineY + 30);
    });

    // Return the canvas as a data URL
    return canvas.toDataURL("image/png");
  };

  // Effect to draw the timeline on mount and when props change
  useEffect(() => {
    const imageUrl = drawTimelineAndGetImage();
    setFallbackImage(imageUrl);
  }, [startDate, expiryDate, renewalOptions]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg">
      <canvas
        ref={canvasRef}
        width={800}
        height={100}
        className="w-full h-auto"
      />

      {fallbackImage && (
        <img
          src={fallbackImage || "/placeholder.svg"}
          alt="Lease Timeline"
          className="pdf-only w-full h-auto"
          style={{ display: "none" }}
        />
      )}
    </div>
  );
};

export default LeaseTimeline;
