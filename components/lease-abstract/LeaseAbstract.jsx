"use client";

import { useState } from "react";
import LeaseSummary from "./LeaseSummary";
import RentComponents from "./RentComponents";
import RecoveryTerms from "./RecoveryTerms";
import RiskAnalysis from "./RiskAnalysis";
import SectionCard from "../ui/SectionCard";
import { generateDirectPDF } from "../DirectPdfExport";

const LeaseAbstract = ({ data }) => {
  const [openSections, setOpenSections] = useState({
    rent: true,
    recovery: false,
    risk: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleExportPDF = () => {
    generateDirectPDF(
      data,
      `Lease_Summary_${data.tenant.name}_${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  };

  return (
    <div id="lease-abstract-content" className="space-y-6">
      <LeaseSummary data={data} onExportPDF={handleExportPDF} />

      <SectionCard
        title="Rent Components & Escalations"
        isOpen={openSections.rent}
        onToggle={() => toggleSection("rent")}
      >
        <RentComponents data={data} />
      </SectionCard>

      <SectionCard
        title="Recovery Terms & Options"
        isOpen={openSections.recovery}
        onToggle={() => toggleSection("recovery")}
      >
        <RecoveryTerms data={data} />
      </SectionCard>

      <SectionCard
        title="Risk Analysis"
        isOpen={openSections.risk}
        onToggle={() => toggleSection("risk")}
      >
        <RiskAnalysis data={data} />
      </SectionCard>
    </div>
  );
};

export default LeaseAbstract;
