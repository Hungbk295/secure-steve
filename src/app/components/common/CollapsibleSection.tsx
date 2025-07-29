import { useState, ReactNode } from "react";

interface CollapsibleSectionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  isCustom?: boolean;
  className?: string;
  onChange?: (isOpen: boolean) => void;
  isBorder?: boolean;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  onChange,
  isCustom = false,
  isBorder = true,
  className,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
    if (onChange) {
      onChange(open);
    }
  };

  return (
    <div
      className={`mt-6 border border-grey-10 rounded-[8px]  
        ${isOpen && isCustom ? "bg-[#F5F6F8]" : "bg-white"} ${className}`}
    >
      <div className={`pt-4 w-full ${isOpen ? "pb-10" : "pb-4"}`}>
        <div
          className={`px-6 flex justify-between items-center cursor-pointer ${
            isOpen ? "mb-4" : ""
          }`}
          onClick={() => handleToggle(!isOpen)}
        >
          <h2 className="text-xl font-bold text-[#4B4E59]">{title}</h2>
          <img
            src={`data:image/svg+xml;base64,${btoa(
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z" fill="#4B4E59"/></svg>'
            )}`}
            alt={isOpen ? "Collapse section" : "Expand section"}
            className="w-8 h-8 transition-transform duration-100"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
        <div
          className="transition-all duration-300 overflow-hidden"
          style={{
            maxHeight: isOpen ? "2000px" : "0",
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? "visible" : "hidden",
          }}
        >
          {isBorder && (
            <div className="border-b-1 border-gray-300 border-solid" />
          )}
          <div className="px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default CollapsibleSection;
