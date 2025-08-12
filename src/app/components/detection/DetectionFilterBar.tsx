import { useState } from "react";
import { Row, Col, DatePicker, Select, Button, Card } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface DetectionFilterBarProps {
  filters: {
    dateRange: [Dayjs | null, Dayjs | null];
    riskLevel: string;
    triageVerdict: string;
    processStatus: string;
    serverIP: string;
  };
  onFilterChange: (filters: any) => void;
  loading?: boolean;
  className?: string;
}

function DetectionFilterBar({
  filters,
  onFilterChange,
  loading = false,
  className,
}: DetectionFilterBarProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Handle local filter changes
  const handleLocalFilterChange = (key: string, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply filters
  const handleApply = () => {
    onFilterChange(localFilters);
  };

  // Reset filters
  const handleReset = () => {
    const resetFilters = {
      dateRange: [null, null] as [Dayjs | null, Dayjs | null],
      riskLevel: "all",
      triageVerdict: "all",
      processStatus: "all",
      serverIP: "all",
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Filter options for Detection screen
  const riskLevelOptions = [
    { label: "All", value: "all" },
    { label: "High (80-100%)", value: "high" },
    { label: "Medium (50-79%)", value: "medium" },
    { label: "Low (0-49%)", value: "low" },
  ];

  const triageVerdictOptions = [
    { label: "All", value: "all" },
    { label: "Malware", value: "malware" },
    { label: "Benign", value: "benign" },
    { label: "Suspicious", value: "suspicious" },
    { label: "Unknown", value: "unknown" },
  ];

  const processStatusOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "No Action", value: "no_action" },
    { label: "Quarantine", value: "quarantine" },
    { label: "Delete", value: "delete" },
  ];

  const serverIPOptions = [
    { label: "All", value: "all" },
    { label: "192.168.1.100", value: "192.168.1.100" },
    { label: "192.168.1.101", value: "192.168.1.101" },
    { label: "10.0.0.50", value: "10.0.0.50" },
    { label: "10.0.0.51", value: "10.0.0.51" },
  ];

  return (
    <Card
      size="small"
      className={`!z-index-0 detection-filter-bar ${className || ""}`}
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border-100)",
        borderRadius: "8px",
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        {/* Time Range Filter */}
        <Col xs={24} sm={12} md={8} lg={4}>
          <div className="filter-item !z-index-0">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              id="date-range-label"
            >
              Time Range
            </label>
            <RangePicker
              value={localFilters.dateRange}
              onChange={(dates) => handleLocalFilterChange("dateRange", dates)}
              placeholder={["Start Time", "End Time"]}
              // showTime={{
              //   format: "HH:mm:ss",
              //   defaultValue: [
              //     dayjs("00:00:00", "HH:mm:ss"),
              //     dayjs("23:59:59", "HH:mm:ss"),
              //   ],
              // }}
              format="YYYY-MM-DD"
              className="w-full"
              size="middle"
              suffixIcon={<CalendarOutlined />}
              aria-labelledby="date-range-label"
              disabled={loading}
            />
          </div>
        </Col>

        {/* Risk Level Filter */}
        <Col xs={24} sm={12} md={6} lg={4}>
          <div className="filter-item">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              id="risk-level-label"
            >
              Risk
            </label>
            <Select
              value={localFilters.riskLevel}
              onChange={(value) => handleLocalFilterChange("riskLevel", value)}
              placeholder="Risk Level"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={riskLevelOptions}
              className="w-full"
              size="middle"
              aria-labelledby="risk-level-label"
              disabled={loading}
            />
          </div>
        </Col>

        {/* Triage Verdict Filter */}
        <Col xs={24} sm={12} md={6} lg={4}>
          <div className="filter-item">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              id="triage-verdict-label"
            >
              Triage Verdict
            </label>
            <Select
              value={localFilters.triageVerdict}
              onChange={(value) =>
                handleLocalFilterChange("triageVerdict", value)
              }
              placeholder="Triage Verdict"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={triageVerdictOptions}
              className="w-full"
              size="middle"
              aria-labelledby="triage-verdict-label"
              disabled={loading}
            />
          </div>
        </Col>

        {/* Process Status Filter */}
        <Col xs={24} sm={12} md={6} lg={4}>
          <div className="filter-item">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              id="process-status-label"
            >
              Process Status
            </label>
            <Select
              value={localFilters.processStatus}
              onChange={(value) =>
                handleLocalFilterChange("processStatus", value)
              }
              placeholder="Process Status"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={processStatusOptions}
              className="w-full"
              size="middle"
              aria-labelledby="process-status-label"
              disabled={loading}
            />
          </div>
        </Col>

        {/* Server IP Filter */}
        <Col xs={24} sm={12} md={6} lg={4}>
          <div className="filter-item">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              id="server-ip-label"
            >
              Server IP
            </label>
            <Select
              value={localFilters.serverIP}
              onChange={(value) => handleLocalFilterChange("serverIP", value)}
              placeholder="Server IP"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={serverIPOptions}
              className="w-full"
              size="middle"
              aria-labelledby="server-ip-label"
              disabled={loading}
            />
          </div>
        </Col>

        {/* Action Buttons */}
        <Col xs={24} sm={24} md={8} lg={4}>
          <div className="filter-actions flex justify-end space-x-2">
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={handleReset}
              disabled={loading}
              size="middle"
            >
              Reset
            </Button>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleApply}
              loading={loading}
              size="middle"
            >
              Apply
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

export default DetectionFilterBar;
