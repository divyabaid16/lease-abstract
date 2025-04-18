import DataTable from "../ui/DataTable";
import RentScheduleChart from "./RentScheduleChart";

const RentComponents = ({ data }) => {
  // Calculate total rent
  const totalRent = data.lease.rentComponents.reduce(
    (sum, component) => sum + component.amount,
    0
  );

  // Prepare data for the rent components table
  const rentComponentsColumns = [
    { header: "Component", accessor: "type", align: "left" },
    {
      header: "Amount",
      accessor: "amount",
      align: "right",
      format: (value, row) => `$${value.toFixed(2)} ${row.psf ? "PSF" : ""}`,
    },
  ];

  // Add total row to rent components
  const rentComponentsData = [
    ...data.lease.rentComponents,
    { type: "Total", amount: totalRent, psf: true, isTotal: true },
  ];

  // Prepare data for the escalations table
  const escalationsColumns = [
    {
      header: "Year",
      accessor: "year",
      align: "left",
      format: (value) => `Year ${value}`,
    },
    { header: "Increase", accessor: "rate", align: "center" },
    {
      header: "Rent (PSF)",
      accessor: "amount",
      align: "right",
      format: (value) => `$${value.toFixed(2)}`,
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            RENT COMPONENTS
          </h3>
          <DataTable
            columns={rentComponentsColumns}
            data={rentComponentsData}
            rowClassName={(row) =>
              row.isTotal ? "bg-gray-50 font-medium" : ""
            }
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            RENT ESCALATIONS
          </h3>
          <RentScheduleChart escalations={data.lease.escalations} />
          <div className="mt-4">
            <DataTable
              columns={escalationsColumns}
              data={data.lease.escalations}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentComponents;
