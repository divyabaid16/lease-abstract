"use client";

import { formatCurrency, formatDate } from "../../utils/formatters";
import LeaseTimeline from "./LeaseTimeline";
import StaticTimeline from "./StaticTimeline";
import InfoCard from "../ui/InfoCard";

const LeaseSummary = ({ data, onExportPDF, onViewSource }) => {
  // Calculate total rent
  const totalRent = data.lease.rentComponents.reduce(
    (sum, component) => sum + component.amount,
    0
  );

  // Calculate days until expiration
  const daysUntilExpiration = Math.round(
    (new Date(data.lease.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const yearsRemaining = (daysUntilExpiration / 365).toFixed(1);

  // Define sections data for mapping
  const sections = [
    {
      title: "TENANT",
      badge: { text: "Low Risk", type: "low" },
      items: [
        { label: "Name", value: data.tenant.name },
        { label: "Credit Rating", value: data.tenant.creditRating },
        { label: "Industry", value: data.tenant.industry },
        { label: "Parent Company", value: data.tenant.parentCompany },
      ],
    },
    {
      title: "LEASE TERM",
      badge:
        daysUntilExpiration < 365
          ? { text: "Expires Soon", type: "high" }
          : null,
      items: [
        { label: "Start Date", value: formatDate(data.lease.startDate) },
        { label: "Expiry Date", value: formatDate(data.lease.expiryDate) },
        { label: "Term", value: `${data.lease.term} years` },
        { label: "Remaining", value: `${yearsRemaining} years` },
      ],
    },
    {
      title: "RENT",
      badge:
        data.lease.baseRent > 400
          ? { text: "Above Market", type: "success" }
          : null,
      items: [
        { label: "Base Rent", value: `$${data.lease.baseRent} PSF` },
        { label: "Total Rent", value: `$${totalRent.toFixed(2)} PSF` },
        {
          label: "Annual Rent",
          value: formatCurrency(
            data.lease.baseRent * data.property.squareFootage
          ),
        },
        {
          label: "Escalation",
          value: `${data.lease.escalations[0].rate} annually`,
        },
      ],
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Lease Summary</h2>
        <div className="flex items-center space-x-2 pdf-hide">
          <button
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center pdf-hide"
            onClick={onExportPDF}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export PDF
          </button>
          <button
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center pdf-hide"
            onClick={onViewSource}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            View Source
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <InfoCard
              key={index}
              title={section.title}
              badge={section.badge}
              items={section.items}
            />
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            LEASE TIMELINE
          </h3>
          <div className="timeline-container">
            <LeaseTimeline
              startDate={data.lease.startDate}
              expiryDate={data.lease.expiryDate}
              renewalOptions={data.lease.renewalOptions}
            />
            <div className="pdf-only" style={{ display: "none" }}>
              <StaticTimeline
                startDate={data.lease.startDate}
                expiryDate={data.lease.expiryDate}
                renewalOptions={data.lease.renewalOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseSummary;
