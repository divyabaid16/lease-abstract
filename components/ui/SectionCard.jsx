"use client";

const SectionCard = ({ title, children, isOpen, onToggle }) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${
        isOpen ? "" : "h-min"
      }`}
    >
      <div
        className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
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
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <div data-section-content className={isOpen ? "block" : "hidden"}>
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
