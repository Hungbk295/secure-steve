import { Card, Select, Row, Col } from "antd";
import { useState, useMemo } from "react";
import CustomBarChart from "@/app/components/common/CustomBarChart";

interface StatusByPeriodData {
  total_scans: number;
  confirmed_malware: number;
  no_threats: number;
  action_completed: number;
}

interface StatusByPeriodCardProps {
  data?: StatusByPeriodData;
  onCollectionChange?: (collection: string) => void;
  onRangeChange?: (range: string) => void;
  onBarClick?: (category: string) => void;
}

const COLLECTION_OPTIONS = [
  { label: "Collection A", value: "collection_a" },
  { label: "Collection B", value: "collection_b" },
  { label: "Collection C", value: "collection_c" },
];

const RANGE_OPTIONS = [
  { label: "30 days", value: "30d" },
  { label: "7 days", value: "7d" },
  { label: "24 hours", value: "24h" },
];

const DEFAULT_DATA: StatusByPeriodData = {
  total_scans: 312,
  confirmed_malware: 211,
  no_threats: 101,
  action_completed: 200,
};

function StatusByPeriodCard({
  data = DEFAULT_DATA,
  onCollectionChange,
  onRangeChange,
  onBarClick,
}: StatusByPeriodCardProps) {
  const [selectedCollection, setSelectedCollection] = useState("collection_a");
  const [selectedRange, setSelectedRange] = useState("30d");

  const chartData = useMemo(() => {
    const labels = ["Confirmed Malware", "No Threats", "Action Completed"];
    const chartValues = [
      data.confirmed_malware,
      data.no_threats,
      data.action_completed,
    ];

    return {
      labels,
      datasets: [
        {
          label: "Status Count",
          data: chartValues,
          backgroundColor: ["#ff4d4f", "#52c41a", "#1890ff"],
          borderWidth: 0,
          borderRadius: { topLeft: 4, topRight: 4 },
        },
      ],
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed.x;
            const total = data.total_scans;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0 && onBarClick) {
        const index = elements[0].index;
        const categories = ["malware", "no_threats", "action_completed"];
        onBarClick(categories[index]);
      }
    },
  };

  const handleCollectionChange = (value: string) => {
    setSelectedCollection(value);
    onCollectionChange?.(value);
  };

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
    onRangeChange?.(value);
  };

  return (
    <Card
      title="기간별 현황"
      size="small"
      extra={
        <div className="flex gap-2">
          <Select
            value={selectedCollection}
            onChange={handleCollectionChange}
            options={COLLECTION_OPTIONS}
            style={{ width: 120 }}
            size="small"
          />
          <Select
            value={selectedRange}
            onChange={handleRangeChange}
            options={RANGE_OPTIONS}
            style={{ width: 100 }}
            size="small"
          />
        </div>
      }
    >
      <div className="mb-4">
        <Row gutter={16}>
          <Col span={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {data.total_scans}
              </div>
              <div className="text-sm text-gray-500">Total Scans</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {data.confirmed_malware}
              </div>
              <div className="text-sm text-gray-500">Confirmed Malware</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {data.no_threats}
              </div>
              <div className="text-sm text-gray-500">No Threats</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {data.action_completed}
              </div>
              <div className="text-sm text-gray-500">Action Completed</div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="h-[200px]">
        <CustomBarChart
          labels={chartData.labels}
          datasets={chartData.datasets}
          options={chartOptions}
        />
      </div>
    </Card>
  );
}

export default StatusByPeriodCard;
