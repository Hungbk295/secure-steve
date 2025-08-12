import React, { useState } from "react";
import { Button, Breadcrumb } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import DetectionTable from "@/app/components/detection/DetectionTable";
import DetectionFilterBar from "@/app/components/detection/DetectionFilterBar";

interface DetectionFilters {
  dateRange: [any, any];
  riskLevel: string;
  triageVerdict: string;
  processStatus: string;
  serverIP: string;
  fileNameOrHash: string;
}

const Detection: React.FC = () => {
  const [filters, setFilters] = useState<DetectionFilters>({
    dateRange: [null, null],
    riskLevel: "all",
    triageVerdict: "all",
    processStatus: "all",
    serverIP: "all",
    fileNameOrHash: "",
  });

  const [loading] = useState(false);

  // Handle filter changes
  const handleFilterChange = (newFilters: DetectionFilters) => {
    console.log("newFilters", newFilters);
    setFilters(newFilters);
  };

  // Handle CSV download
  const handleDownloadCSV = () => {
    // TODO: Implement CSV download when endpoint is ready
    console.log("CSV download requested");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col gap-4">
      {/* Header with Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>Analysis</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">Detection</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Detection List
        </h1>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <DetectionFilterBar
            filters={{
              dateRange: filters.dateRange,
              riskLevel: filters.riskLevel,
              triageVerdict: filters.triageVerdict,
              processStatus: filters.processStatus,
              serverIP: filters.serverIP,
            }}
            onFilterChange={handleFilterChange}
            loading={loading}
          />
        </div>
      </div>

      {/* Main Content - Detection Table */}
      <div className="filter-actions flex justify-end">
        <Button
          icon={<DownloadOutlined />}
          disabled={true} // Disabled until endpoint is ready
          onClick={handleDownloadCSV}
          size="middle"
        >
          CSV Download
        </Button>
      </div>
      <DetectionTable filters={filters} loading={loading} />
    </div>
  );
};

export default Detection;
