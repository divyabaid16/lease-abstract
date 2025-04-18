const RecoveryTerms = ({ data }) => {
  // Recovery terms data
  const recoveryTerms = [
    {
      title: "CAM (Common Area Maintenance)",
      value: data.lease.recoveryTerms.cam,
    },
    { title: "Property Taxes", value: data.lease.recoveryTerms.taxes },
    { title: "Insurance", value: data.lease.recoveryTerms.insurance },
  ];

  // Security and allowances data
  const securityAllowances = [
    { label: "Security Deposit", value: data.lease.securityDeposit },
    { label: "TI Allowance", value: data.lease.tlAllowance },
  ];

  // Renewal options table columns
  const renewalColumns = [
    {
      header: "Option",
      accessor: "index",
      align: "left",
      format: (value) => `Option ${value + 1}`,
    },
    {
      header: "Term",
      accessor: "term",
      align: "center",
      format: (value) => `${value} years`,
    },
    { header: "Type", accessor: "type", align: "center" },
    { header: "Notice Period", accessor: "notice", align: "right" },
  ];

  // Add index to renewal options for display
  const renewalOptionsData = data.lease.renewalOptions.map((option, index) => ({
    ...option,
    index,
  }));

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            RECOVERY TERMS
          </h3>
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            {recoveryTerms.map((term, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium">{term.title}</h4>
                <p className="text-sm text-gray-700 mt-1">{term.value}</p>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-medium text-gray-500 mt-6 mb-4">
            SECURITY & ALLOWANCES
          </h3>
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            {securityAllowances.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-gray-700">{item.value}</span>
              </div>
            ))}
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
                  {renewalColumns.map((column, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={`px-6 py-3 text-${column.align} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {renewalOptionsData.map((option, rowIndex) => (
                  <tr key={rowIndex}>
                    {renewalColumns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-${column.align}`}
                      >
                        {column.format
                          ? column.format(option[column.accessor], option)
                          : option[column.accessor]}
                      </td>
                    ))}
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
  );
};

export default RecoveryTerms;
