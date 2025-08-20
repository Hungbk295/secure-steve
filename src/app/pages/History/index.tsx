import React, { useState } from "react";
import { Breadcrumb, Tabs, TabsProps } from "antd";
import ScanHistoryTab from "./components/ScanHistoryTab";
import ActionHistoryTab from "./components/ActionHistoryTab";

const History: React.FC = () => {
  const [activeTab, setActiveTab] = useState("scan-history");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  const tabItems: TabsProps["items"] = [
    {
      key: "scan-history",
      label: <span className="text-base font-medium pl-4 px-2">검사 이력</span>,
    },
    {
      key: "action-history",
      label: <span className="text-base font-medium  px-2">조치 이력</span>,
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>History</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">Inspection</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          검사/조치 이력
        </h1>
      </div>
      <div className="flex-1 py-4 flex flex-col gap-4">
        <div className="bg-white rounded-lg border border-gray-200 !mb-0 overflow-x-auto">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            size="large"
          />
        </div>
        {activeTab === "scan-history" && <ScanHistoryTab />}
        {activeTab === "action-history" && <ActionHistoryTab />}
      </div>
    </div>
  );
};

export default History;
