"use client";

import { useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RentScheduleChart = ({ escalations }) => {
  // Transform the escalations data for the chart
  const chartData = escalations.map((escalation) => ({
    year: `Year ${escalation.year}`,
    rent: escalation.amount,
    increase: escalation.rate,
  }));

  // Effect to handle PDF export preparation
  useEffect(() => {
    const handlePdfPrepare = () => {
      // Force chart redraw if needed for PDF export
      // This is a placeholder - Recharts may need specific handling
      console.log("Preparing chart for PDF export");
    };

    document.addEventListener("pdfExportPrepare", handlePdfPrepare);
    return () => {
      document.removeEventListener("pdfExportPrepare", handlePdfPrepare);
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md text-xs">
          <p className="font-medium">{label}</p>
          <p className="text-gray-700">
            Rent: ${payload[0].value.toFixed(2)} PSF
          </p>
          <p className="text-gray-700">
            Increase: {chartData.find((item) => item.year === label)?.increase}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} tickLine={false} />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="rent"
            fill="#4F46E5"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RentScheduleChart;
