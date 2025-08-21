import React, { useEffect } from "react";
import { Breadcrumb, Card } from "antd";
import ReportListFilterBar from "./components/ReportListFilterBar";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectReportListLoading,
  actionGetReportList,
} from "@/store/reportListSlice";
import ReportListTable from "./components/ReportListTable";

const ReportList: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectReportListLoading);

  useEffect(() => {
    // Set default time range to 1 week
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    dispatch(
      actionGetReportList({
        timeRange: [
          startDate.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0],
        ],
      })
    );
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <Breadcrumb className="text-sm">
              <Breadcrumb.Item>알림 및 리포트</Breadcrumb.Item>
              <Breadcrumb.Item className="font-medium">알림</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-2xl font-semibold text-gray-900 mt-2">
              알림 및 리포트 관리
            </h1>
          </div>

          {/* <div className="flex items-center space-x-4 mt-2">
            <Badge count={unreadCount} showZero={false}>
              <span className="text-sm text-gray-600">
                확인 필요 알림: {unreadCount.toString().padStart(2, "0")}건
              </span>
            </Badge>
          </div> */}
        </div>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-4">
        <Card
          size="small"
          className="report-list-filter-bar"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border-100)",
            borderRadius: "8px",
          }}
        >
          <ReportListFilterBar loading={loading} />
        </Card>

        <ReportListTable loading={loading} />
      </div>
    </div>
  );
};

export default ReportList;
