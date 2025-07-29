import CollapsibleSection from "@/app/components/common/CollapsibleSection";

interface CusUsage {
  ancillaryBalance: number;
  ancillaryQty: number;
  ancillaryUnitPrice: number;
  postHandlingBalance: number;
  postHandlingQty: number;
  postHandlingUnitPrice: number;
  ticketIssuedBalance: number;
  ticketIssuedQty: number;
  ticketIssuedUnitPrice: number;
  usersBalance: number;
  usersQty: number;
  usersUnitPrice: number;
}

interface SubscriptionProps {
  data: {
    status?: string;
    statusnm?: string;
    settlePlan?: string;
    settlePlannm?: string;
    billingUserCount?: number;
    totalUserCount?: number;
    cusUsage?: CusUsage;
    [key: string]: any;
  };
}

const STATUS_COLORS = {
  UR: { bg: "#FFF7E6", text: "#D46B08", border: "#FFCF96" }, // Under Review
  AC: { bg: "#EFFAF6", text: "#1C925F", border: "#B9DDCD" }, // Active
  DN: { bg: "#FFF1F0", text: "#CF1322", border: "#CF1322" }, // Denied
  DR: { bg: "#FFF2F2", text: "#E60000", border: "#FFCDCD" }, // Deletion Request
  AL: { bg: "#FFF7E6", text: "#D46B08", border: "#D46B08" }, // Access Limited
  SO: { bg: "#FFF7E6", text: "#D46B08", border: "#D46B08" }, // SignOff Request
  DE: { bg: "#F5F6F8", text: "#82828A", border: "#E3E3E8" }, // Deleted
  FD: { bg: "#F5F5F5", text: "#8C8C8C", border: "#8C8C8C" }, // Force-Deleted
  DV: { bg: "#F5F6F8", text: "#82828A", border: "#E3E3E8" }, // Deprovisioning Request
  PR: { bg: "#FFF7E6", text: "#D46B08", border: "#D46B08" }, // Provisioning Requested
  RG: { bg: "#F5F6F8", text: "#82828A", border: "#E3E3E8" }, // Register
  FR: { bg: "#F5F6F8", text: "#82828A", border: "#E3E3E8" }, // Force-Deletion Request
} as const;

function Subscription({ data }: SubscriptionProps) {
  const isEditable = !["DE", "FD"].includes(data?.status || "");
  const statusColor =
    STATUS_COLORS[data.status as keyof typeof STATUS_COLORS] ||
    STATUS_COLORS["UR"];

  const columns = [
    { key: "type", label: "Type", flex: 1, align: "center" },
    { key: "unitPrice", label: "Unit Price", flex: 1, align: "center" },
    { key: "qty", label: "QTY", flex: 1, align: "center" },
    { key: "balance", label: "Balance", flex: 1, align: "center" },
  ];

  const transformUsageData = (cusUsage: CusUsage) => {
    return [
      {
        type: "Ticket Issued",
        unitPrice: `$${cusUsage.ticketIssuedUnitPrice.toFixed(2)}`,
        qty: cusUsage.ticketIssuedQty.toString(),
        balance: `$${cusUsage.ticketIssuedBalance.toFixed(2)}`,
      },
      {
        type: "Ancillary",
        unitPrice: `$${cusUsage.ancillaryUnitPrice.toFixed(2)}`,
        qty: cusUsage.ancillaryQty.toString(),
        balance: `$${cusUsage.ancillaryBalance.toFixed(2)}`,
      },
      {
        type: "Post Handling",
        unitPrice: `$${cusUsage.postHandlingUnitPrice.toFixed(2)}`,
        qty: cusUsage.postHandlingQty.toString(),
        balance: `$${cusUsage.postHandlingBalance.toFixed(2)}`,
      },
      {
        type: "Users",
        unitPrice: `$${cusUsage.usersUnitPrice.toFixed(2)}`,
        qty: cusUsage.usersQty.toString(),
        balance: `$${cusUsage.usersBalance.toFixed(2)}`,
      },
    ];
  };

  const usageRows = data.cusUsage ? transformUsageData(data.cusUsage) : [];

  // Get the date range for usage statistics
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <CollapsibleSection title="Subscription">
      <div
        className={`w-full bg-white ${
          !isEditable ? "opacity-70 pointer-events-none" : ""
        }`}
      >
        <div className="flex flex-row justify-between gap-6">
          {/* Current Plan Section */}
          <div
            className="flex-[1] flex flex-col gap-4 bg-[#EFFAF6] p-4 rounded-lg"
            style={{ backgroundColor: statusColor.bg }}
          >
            <div className="h-13.5 ">
              <div className="h-6 flex justify-between items-center">
                <div className="text-lg text-[16px] h-6 font-bold text-[#4B4E59]">
                  Current Plan
                </div>
                <div
                  className="border-[1px] border-solid px-2 py-1 rounded-[8px]"
                  style={{
                    borderColor: statusColor.border,
                  }}
                >
                  <div
                    className="font-medium text-[12px]"
                    style={{
                      backgroundColor: statusColor.bg,
                      color: statusColor.text,
                    }}
                  >
                    {data.statusnm}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center h-13.5 gap-[10px]">
              <div
                className="text-[24px] font-medium"
                style={{ color: statusColor.text }}
              >
                Pay as you go / {data.settlePlannm}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-[14px] font-medium text-[#4B4E59]">
                Users
              </div>
              <div className="text-[14px] font-medium text-[#4B4E59]">
                  {data.billingUserCount}/{data.totalUserCount} Billing User
                </div>
            </div>
          </div>

          {/* Usage Section */}
          <div className="flex-[1.9375] flex flex-col gap-4 px-4">
            <div className="flex items-center">
              <h3 className="text-sm font-medium text-[#4B4E59]">Usage</h3>
              <span className="text-xs text-[#4B4E59] ml-2">
                ({formatDate(firstDayOfMonth)} - {formatDate(yesterday)})
              </span>
            </div>
            <div className="h-full border border-[#E3E3E8] rounded overflow-hidden">
              <div className="flex bg-[#F3F4F6] border-b border-[#E3E3E8]">
                {columns.map((column) => (
                  <div
                    key={column.key}
                    className="flex-1 py-1.5 px-2 text-xs font-medium text-[#4B4E59] border-l border-[#E3E3E8] first:border-l-0"
                  >
                    {column.label}
                  </div>
                ))}
              </div>
              {usageRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex border-b border-[#E3E3E8] last:border-b-0 !h-8"
                >
                  {columns.map((column) => (
                    <div
                      key={`${rowIndex}-${column.key}`}
                      className="flex-1 py-1.5 px-2 text-xs text-[#4B4E59] border-r border-[#E3E3E8] last:border-r-0"
                    >
                      {row[column.key as keyof typeof row]}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}

export default Subscription;
