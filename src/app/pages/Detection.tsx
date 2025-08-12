import React, { useState } from "react";
import { DatePicker, Select, Input, Button, Space, Breadcrumb } from "antd";
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
import DetectionTable from "@/app/components/detection/DetectionTable";
import {
  TRIAGE_VERDICT_OPTIONS,
  RISK_LEVEL_OPTIONS,
  PROCESS_STATUS_OPTIONS,
  TIME_RANGE_PRESETS,
} from "@/constants/detectionConstants";

const { RangePicker } = DatePicker;

interface DetectionFilters {
  timeRange: [string, string] | null;
  risk: string[];
  riskMin?: number;
  riskMax?: number;
  verdict: string[];
  processStatus: string[];
  serverIP: string;
  fileNameOrHash: string;
}

const Detection: React.FC = () => {
  const [filters, setFilters] = useState<DetectionFilters>({
    timeRange: null,
    risk: [],
    verdict: [],
    processStatus: [],
    serverIP: "",
    fileNameOrHash: "",
  });
  
  const [loading, setLoading] = useState(false);

  // Handle time range preset selection
  const handleTimeRangePreset = (preset: string) => {
    const now = new Date();
    let fromDate: Date;
    
    switch (preset) {
      case "24h":
        fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return;
    }
    
    setFilters(prev => ({
      ...prev,
      timeRange: [fromDate.toISOString(), now.toISOString()]
    }));
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof DetectionFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset all filters
  const handleReset = () => {
    setFilters({
      timeRange: null,
      risk: [],
      verdict: [],
      processStatus: [],
      serverIP: "",
      fileNameOrHash: "",
    });
  };

  // Apply filters (with debounce logic would be added here)
  const handleApply = () => {
    setLoading(true);
    // TODO: Dispatch Redux action to fetch filtered data
    console.log("Applied filters:", filters);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Handle CSV download
  const handleDownloadCSV = () => {
    // TODO: Implement CSV download when endpoint is ready
    console.log("CSV download requested");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>Analysis</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">Detection</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">Detection List</h1>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="space-y-4">
            {/* Row 1: Time Range */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                  Time Range:
                </label>
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  className="w-80"
                  placeholder={["From", "To"]}
                  onChange={(dates, dateStrings) => 
                    handleFilterChange("timeRange", dates ? [dateStrings[0], dateStrings[1]] : null)
                  }
                />
                <div className="flex gap-1">
                  {TIME_RANGE_PRESETS.map(preset => (
                    <Button
                      key={preset.value}
                      size="small"
                      type={filters.timeRange ? "default" : "text"}
                      onClick={() => handleTimeRangePreset(preset.value)}
                      className="text-xs"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Risk and Verdict */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                  Risk:
                </label>
                <Select
                  mode="multiple"
                  placeholder="Select risk levels"
                  options={RISK_LEVEL_OPTIONS}
                  className="w-48"
                  value={filters.risk}
                  onChange={(value) => handleFilterChange("risk", value)}
                />
                <span className="text-xs text-gray-500">or</span>
                <Input
                  placeholder="Min %"
                  type="number"
                  min={0}
                  max={100}
                  className="w-20"
                  onChange={(e) => handleFilterChange("riskMin", parseFloat(e.target.value))}
                />
                <span className="text-xs text-gray-500">-</span>
                <Input
                  placeholder="Max %"
                  type="number"
                  min={0}
                  max={100}
                  className="w-20"
                  onChange={(e) => handleFilterChange("riskMax", parseFloat(e.target.value))}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                  Verdict:
                </label>
                <Select
                  mode="multiple"
                  placeholder="Select verdicts"
                  options={TRIAGE_VERDICT_OPTIONS}
                  className="w-64"
                  value={filters.verdict}
                  onChange={(value) => handleFilterChange("verdict", value)}
                />
              </div>
            </div>

            {/* Row 3: Process Status and Server IP */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                  Status:
                </label>
                <Select
                  mode="multiple"
                  placeholder="Select process status"
                  options={PROCESS_STATUS_OPTIONS}
                  className="w-64"
                  value={filters.processStatus}
                  onChange={(value) => handleFilterChange("processStatus", value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                  Server IP:
                </label>
                <Input
                  placeholder="Enter IPv4/IPv6 address"
                  value={filters.serverIP}
                  onChange={(e) => handleFilterChange("serverIP", e.target.value)}
                  className="w-64"
                />
              </div>
            </div>

            {/* Row 4: File Name/Hash and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                  File/Hash:
                </label>
                <Input
                  placeholder="Enter file name or SHA256 hash"
                  value={filters.fileNameOrHash}
                  onChange={(e) => handleFilterChange("fileNameOrHash", e.target.value)}
                  className="w-80"
                  prefix={<SearchOutlined className="text-gray-400" />}
                />
              </div>

              <Space size="middle">
                <Button onClick={handleReset} icon={<ReloadOutlined />}>
                  Reset
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleApply}
                  loading={loading}
                  className="bg-blue-600"
                >
                  Apply
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  disabled={true} // Disabled until endpoint is ready
                  onClick={handleDownloadCSV}
                >
                  CSV Download
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Detection Table */}
      <div className="p-6">
        <DetectionTable filters={filters} loading={loading} />
      </div>
    </div>
  );
};

export default Detection;