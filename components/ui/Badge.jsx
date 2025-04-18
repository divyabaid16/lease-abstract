const Badge = ({ type, text }) => {
  const styles = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-800",
  };

  const badgeStyle = styles[type] || styles.default;

  return (
    <span className={`px-2 py-1 text-xs font-medium ${badgeStyle} rounded`}>
      {text}
    </span>
  );
};

export default Badge;
