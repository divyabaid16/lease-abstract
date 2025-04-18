"use client";

import { useEffect, useRef, useState } from "react";
import { formatDate } from "../../utils/formatters";

const LeaseTimeline = ({ startDate, expiryDate, renewalOptions }) => {
  const canvasRef = useRef(null);
  const [fallbackImage, setFallbackImage] = useState(null);

  // Function to draw the timeline and return a data URL
  const drawTimelineAndGetImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    const startDateObj = new Date(startDate);
    const expiryDateObj = new Date(expiryDate);

    // Calculate total lease term in years
    const primaryTerm =
      (expiryDateObj - startDateObj) / (1000 * 60 * 60 * 24 * 365);

    // Calculate total timeline length including renewal options
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

    // Fill with light gray background
    ctx.fillStyle = "#f9fafb";
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
    renewalOptions.forEach((option) => {
      const optionLength = (option.term / totalTimelineYears) * timelineLength;
      ctx.beginPath();
      ctx.moveTo(currentX, timelineY);
      ctx.lineTo(currentX + optionLength, timelineY);
      ctx.strokeStyle = "#9CA3AF";
      ctx.lineWidth = 8;
      ctx.stroke();

      currentX += optionLength;
    });

    // Draw points and labels
    const points = [
      { x: timelineStartX, label: "Start", date: startDate, primary: true },
      {
        x: timelineStartX + primaryTermLength,
        label: "Expiry",
        date: expiryDate,
        primary: true,
      },
    ];

    // Add renewal option points
    currentX = timelineStartX + primaryTermLength;
    renewalOptions.forEach((option, index) => {
      const optionLength = (option.term / totalTimelineYears) * timelineLength;
      currentX += optionLength;

      const renewalDate = new Date(expiryDate);
      renewalDate.setFullYear(
        renewalDate.getFullYear() + option.term * (index + 1)
      );

      points.push({
        x: currentX,
        label: `Option ${index + 1}`,
        date: renewalDate.toISOString(),
        primary: false,
      });
    });

    // Draw all points and labels
    points.forEach((point) => {
      // Draw point
      ctx.beginPath();
      ctx.arc(point.x, timelineY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = point.primary ? "#4F46E5" : "#9CA3AF";
      ctx.fill();

      // Add labels
      ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.fillStyle = "#6B7280";
      ctx.textAlign = "center";
      ctx.fillText(formatDate(point.date), point.x, timelineY - 20);
      ctx.fillText(point.label, point.x, timelineY + 30);
    });

    // Return the canvas as a data URL
    return canvas.toDataURL("image/png");
  };

  // Effect to draw the timeline on mount and when props change
  useEffect(() => {
    const imageUrl = drawTimelineAndGetImage();
    setFallbackImage(imageUrl);
  }, [startDate, expiryDate, renewalOptions]);

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
