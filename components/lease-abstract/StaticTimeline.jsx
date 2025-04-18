import { formatDate } from "../../utils/formatters";

const StaticTimeline = ({ startDate, expiryDate, renewalOptions }) => {
  const startDateObj = new Date(startDate);
  const expiryDateObj = new Date(expiryDate);
  const primaryTerm = Math.round(
    (expiryDateObj - startDateObj) / (1000 * 60 * 60 * 24 * 365)
  );

  const renewalDates = renewalOptions.map((option, index) => {
    const date = new Date(expiryDate);
    const previousOptions = renewalOptions.slice(0, index);
    const previousYears = previousOptions.reduce(
      (sum, opt) => sum + opt.term,
      0
    );
    date.setFullYear(date.getFullYear() + previousYears + option.term);
    return {
      date: date,
      term: option.term,
      label: `Option ${index + 1}`,
    };
  });

  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg">
      <div className="relative h-20">
        <div className="absolute top-10 left-0 right-0 h-1 bg-gray-200"></div>

        <div
          className="absolute top-10 left-0 h-1 bg-indigo-600"
          style={{ width: "50%" }}
        ></div>

        <div className="absolute top-8 left-0 w-4 h-4 rounded-full bg-indigo-600"></div>
        <div
          className="absolute top-16 left-0 text-xs text-center"
          style={{ width: "60px", marginLeft: "-30px" }}
        >
          <div className="font-medium">{formatDate(startDate)}</div>
          <div className="text-gray-500">Start</div>
        </div>

        <div className="absolute top-8 left-1/2 w-4 h-4 rounded-full bg-indigo-600"></div>
        <div
          className="absolute top-16 left-1/2 text-xs text-center"
          style={{ width: "60px", marginLeft: "-30px" }}
        >
          <div className="font-medium">{formatDate(expiryDate)}</div>
          <div className="text-gray-500">Expiry</div>
        </div>

        <div
          className="absolute top-10 left-1/2 h-1 bg-gray-400"
          style={{ width: "50%" }}
        ></div>

        <div className="absolute top-8 right-0 w-4 h-4 rounded-full bg-gray-400"></div>
        <div
          className="absolute top-16 right-0 text-xs text-center"
          style={{ width: "60px", marginLeft: "-30px" }}
        >
          <div className="font-medium">
            {formatDate(
              renewalDates[renewalDates.length - 1]?.date || expiryDate
            )}
          </div>
          <div className="text-gray-500">Option {renewalOptions.length}</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <span className="inline-block mr-6">
          <span className="inline-block w-3 h-3 bg-indigo-600 rounded-full mr-1"></span>
          Primary Term: {primaryTerm} years
        </span>
        <span className="inline-block">
          <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-1"></span>
          Renewal Options:{" "}
          {renewalOptions.reduce((sum, option) => sum + option.term, 0)} years
        </span>
      </div>
    </div>
  );
};

export default StaticTimeline;
