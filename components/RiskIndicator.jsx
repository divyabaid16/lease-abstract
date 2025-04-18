const RiskIndicator = ({ risk }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";

  if (risk === "low") {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
  } else if (risk === "medium") {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-800";
  } else if (risk === "high") {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
  }

  return (
    <span
      className={`px-2 py-1 text-xs font-medium ${bgColor} ${textColor} rounded`}
    >
      {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
    </span>
  );
};

export default RiskIndicator;
