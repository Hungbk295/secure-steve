import React from "react";
import { Card, Space, Progress } from "antd";
import Select from "@/app/components/common/Select";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectPeriodStats,
  updateTimeRange,
} from "@/store/dashboardSlice";

interface PeriodStatsCardProps {
  loading: boolean;
}

const PeriodStatsCard: React.FC<PeriodStatsCardProps> = ({ loading }) => {
  const dispatch = useAppDispatch();
  const periodStats = useAppSelector(selectPeriodStats);

  const timeRangeOptions = [
    { label: "30days", value: "30days" },
    { label: "7days", value: "7days" },
    { label: "1day", value: "1day" },
  ];

  const handleTimeRangeChange = (value: string) => {
    dispatch(updateTimeRange(value));
  };

  const getProgressColor = (label: string) => {
    switch (label) {
      case "Confirmed Malware":
        return "#ff4d4f";
      case "No Threats":
        return "#52c41a";
      case "Action Completed":
        return "#1890ff";
      default:
        return "#d9d9d9";
    }
  };

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <Card
      loading={loading}
      title="기간별 현황"
      extra={
        <Space>
          <span className="text-sm text-gray-600">Collection</span>
          <Select
            value={periodStats?.timeRange || "30days"}
            onChange={handleTimeRangeChange}
            options={timeRangeOptions}
            size="small"
            style={{ width: 100 }}
          />
        </Space>
      }
      className="period-stats-card h-full"
    >
      <div className="space-y-6">
        {/* Main Total */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">
            {periodStats?.totalScans || 0}
          </div>
          <div className="text-lg text-gray-600 mt-1">Scans</div>
        </div>

        {/* KPI Bars */}
        <div className="space-y-4">
          {periodStats?.kpis?.map((kpi, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {kpi.label}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {kpi.value} Scans
                </span>
              </div>
              <Progress
                percent={calculatePercentage(kpi.value, periodStats?.totalScans || 0)}
                strokeColor={getProgressColor(kpi.label)}
                showInfo={false}
                size="small"
              />
            </div>
          )) || []}
        </div>

        {/* Additional Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            {periodStats?.kpis?.map((kpi, index) => (
              <div key={index} className="space-y-1">
                <div className="text-xs text-gray-500">{kpi.label}</div>
                <div className="text-sm font-semibold text-gray-900">
                  {calculatePercentage(kpi.value, periodStats?.totalScans || 0)}%
                </div>
              </div>
            )) || []}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PeriodStatsCard;