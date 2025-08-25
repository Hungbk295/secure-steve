import React, { useEffect } from "react";
import { Row, Col, Breadcrumb } from "antd";
import LatestAlertCard from "./components/LatestAlertCard";
import PeriodStatsCard from "./components/PeriodStatsCard";
import MalwareFamilyChart from "./components/MalwareFamilyChart";
import ServerStatusCard from "./components/ServerStatusCard";
import ReportsPanel from "./components/ReportsPanel";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectDashboardLoading,
  actionGetDashboardData,
} from "@/store/dashboardSlice";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectDashboardLoading);

  useEffect(() => {
    dispatch(actionGetDashboardData());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">Dashboard</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-6">
        <div className="space-y-6">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={24}>
              <LatestAlertCard loading={loading} />
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <PeriodStatsCard loading={loading} />
            </Col>
            <Col xs={24} lg={12}>
              <MalwareFamilyChart loading={loading} />
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <ServerStatusCard loading={loading} />
            </Col>
            <Col xs={24} lg={12}>
              <ReportsPanel loading={loading} />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
