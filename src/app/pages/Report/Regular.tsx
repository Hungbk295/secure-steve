import React, { useEffect } from "react";
import { Breadcrumb, Card } from "antd";
import ReportRegularFilterBar from "./components/ReportRegularFilterBar";
import ReportRegularTable from "./components/ReportRegularTable";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectReportRegularLoading,
  actionGetReportRegularList,
} from "@/store/reportRegularSlice";

const ReportRegular: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectReportRegularLoading);

  useEffect(() => {
    // Set default time range to 1 month
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1);

    dispatch(
      actionGetReportRegularList({
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
              <Breadcrumb.Item className="font-medium">리포트</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-2xl font-semibold text-gray-900 mt-2">
              정기 리포트 관리
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-4">
        <Card
          size="small"
          className="report-regular-filter-bar"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border-100)",
            borderRadius: "8px",
          }}
        >
          <ReportRegularFilterBar loading={loading} />
        </Card>

        <ReportRegularTable loading={loading} />
      </div>
    </div>
  );
};

export default ReportRegular;
