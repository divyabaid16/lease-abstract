import Badge from "../ui/Badge";

const RiskAnalysis = ({ data }) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.riskFactors.map((factor, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">{factor.type}</h3>
              <Badge
                type={factor.risk.toLowerCase()}
                text={`${factor.risk} Risk`}
              />
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
              Current rent is approximately 5% above market rate for similar
              properties in the Brooklyn area. While this presents strong
              current income, it may pose challenges for renewal negotiations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
