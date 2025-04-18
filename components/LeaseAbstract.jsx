"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "../utils/formatters";
import RentScheduleChart from "./rent-schedule-chart";
import LeaseTimeline from "./lease-timeline";
import RiskIndicator from "./risk-indicator";
import generatePDF from "./pdf-export";
import StaticTimeline from "./static-timeline";

const LeaseAbstract = ({ data }) => {
  const [openSections, setOpenSections] = useState({
    rent: true, // Default open
    recovery: false,
    risk: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isExpanded = (section) => {
    return openSections[section];
  };

  const handleExportPDF = () => {
    setOpenSections({
      rent: true,
      recovery: true,
      risk: true,
    });

    setTimeout(() => {
      document.body.classList.add("pdf-export-in-progress");

      const canvasContainers = document.querySelectorAll(".timeline-container");
      canvasContainers.forEach((container) => {
        const canvas = container.querySelector("canvas");
        const fallbackImg = container.querySelector(".pdf-only");

        if (canvas && fallbackImg) {
          fallbackImg.style.display = "block";
        }
      });

      generatePDF(
        "lease-abstract-content",
        `Lease_Summary_${data.tenant.name}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      setTimeout(() => {
        setOpenSections((prev) => ({ ...prev }));
        document.body.classList.remove("pdf-export-in-progress");

        const fallbackImgs = document.querySelectorAll(".pdf-only");
        fallbackImgs.forEach((img) => {
          img.style.display = "none";
        });
      }, 1000);
    }, 300);
  };

  const totalRent = data.lease.rentComponents.reduce(
    (sum, component) => sum + component.amount,
    0
  );

  const daysUntilExpiration = Math.round(
    (new Date(data.lease.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const yearsRemaining = (daysUntilExpiration / 365).toFixed(1);

  return (
    <div id="lease-abstract-content" className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Lease Summary</h2>
          <div className="flex items-center space-x-2 pdf-hide">
            <button
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center pdf-hide"
              onClick={handleExportPDF}
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
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-500">TENANT</h3>
                <RiskIndicator risk="low" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Name</span>
                  <span className="text-sm font-medium">
                    {data.tenant.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Credit Rating</span>
                  <span className="text-sm font-medium">
                    {data.tenant.creditRating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Industry</span>
                  <span className="text-sm font-medium">
                    {data.tenant.industry}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Parent Company</span>
                  <span className="text-sm font-medium">
                    {data.tenant.parentCompany}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-500">
                  LEASE TERM
                </h3>
                {daysUntilExpiration < 365 && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                    Expires Soon
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Start Date</span>
                  <span className="text-sm font-medium">
                    {formatDate(data.lease.startDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Expiry Date</span>
                  <span className="text-sm font-medium">
                    {formatDate(data.lease.expiryDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Term</span>
                  <span className="text-sm font-medium">
                    {data.lease.term} years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Remaining</span>
                  <span className="text-sm font-medium">
                    {yearsRemaining} years
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-500">RENT</h3>
                {data.lease.baseRent > 400 && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    Above Market
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Base Rent</span>
                  <span className="text-sm font-medium">
                    ${data.lease.baseRent} PSF
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Rent</span>
                  <span className="text-sm font-medium">
                    ${totalRent.toFixed(2)} PSF
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Annual Rent</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(
                      data.lease.baseRent * data.property.squareFootage
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Escalation</span>
                  <span className="text-sm font-medium">
                    {data.lease.escalations[0].rate} annually
                  </span>
                </div>
              </div>
            </div>
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

      <div
        className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${
          isExpanded("rent") ? "" : "h-min"
        }`}
      >
        <div
          className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("rent")}
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Rent Components & Escalations
          </h2>
          <button data-toggle-button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${
                isExpanded("rent") ? "rotate-180" : ""
              }`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        <div
          data-section-content
          className={isExpanded("rent") ? "block" : "hidden"}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">
                  RENT COMPONENTS
                </h3>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Component
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.lease.rentComponents.map((component, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {component.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            ${component.amount.toFixed(2)}{" "}
                            {component.psf ? "PSF" : ""}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Total
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          ${totalRent.toFixed(2)} PSF
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">
                  RENT ESCALATIONS
                </h3>
                <RentScheduleChart escalations={data.lease.escalations} />
                <div className="mt-4 overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Year
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Increase
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Rent (PSF)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.lease.escalations.map((escalation, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Year {escalation.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            {escalation.rate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            ${escalation.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${
          isExpanded("recovery") ? "" : "h-min"
        }`}
      >
        <div
          className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("recovery")}
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Recovery Terms & Options
          </h2>
          <button data-toggle-button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${
                isExpanded("recovery") ? "rotate-180" : ""
              }`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        <div
          data-section-content
          className={isExpanded("recovery") ? "block" : "hidden"}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">
                  RECOVERY TERMS
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">
                      CAM (Common Area Maintenance)
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      {data.lease.recoveryTerms.cam}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Property Taxes</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      {data.lease.recoveryTerms.taxes}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Insurance</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      {data.lease.recoveryTerms.insurance}
                    </p>
                  </div>
                </div>

                <h3 className="text-sm font-medium text-gray-500 mt-6 mb-4">
                  SECURITY & ALLOWANCES
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Security Deposit
                    </span>
                    <span className="text-sm text-gray-700">
                      {data.lease.securityDeposit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">TI Allowance</span>
                    <span className="text-sm text-gray-700">
                      {data.lease.tlAllowance}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">
                  RENEWAL OPTIONS
                </h3>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Option
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Term
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Notice Period
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.lease.renewalOptions.map((option, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Option {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            {option.term} years
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            {option.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {option.notice}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="text-sm font-medium text-gray-500 mt-6 mb-4">
                  SPECIAL PROVISIONS
                </h3>
                <div className="space-y-2">
                  {data.lease.specialProvisions.map((provision, index) => (
                    <div key={index} className="flex items-start">
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
                        className="text-gray-400 mr-2 mt-1"
                      >
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                      <span className="text-sm text-gray-700">{provision}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${
          isExpanded("risk") ? "" : "h-min"
        }`}
      >
        <div
          className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("risk")}
        >
          <h2 className="text-lg font-semibold text-gray-900">Risk Analysis</h2>
          <button data-toggle-button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${
                isExpanded("risk") ? "rotate-180" : ""
              }`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        <div
          data-section-content
          className={isExpanded("risk") ? "block" : "hidden"}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.riskFactors.map((factor, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">{factor.type}</h3>
                    <RiskIndicator risk={factor.risk.toLowerCase()} />
                  </div>
                  <p className="text-sm text-gray-700">{factor.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500 mr-3 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    Market Analysis
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Current rent is approximately 5% above market rate for
                    similar properties in the Brooklyn area. While this presents
                    strong current income, it may pose challenges for renewal
                    negotiations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseAbstract;
