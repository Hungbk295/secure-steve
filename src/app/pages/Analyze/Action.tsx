import React, { useState } from "react";
import { Breadcrumb, Tabs } from "antd";
import type { TabsProps } from "antd";
import PendingTab from "@/app/components/analyze/action/PendingTab";
import CompletedTab from "@/app/components/analyze/action/CompletedTab";

const Action: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("pending");

  const tabItems: TabsProps["items"] = [
    {
      key: "pending",
      label: (
        <span className="text-base font-medium pl-4 px-2">미조치 알림</span>
      ),
    },
    {
      key: "completed",
      label: (
        <span className="text-base font-medium  px-2">조치 이력 조회</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>Analysis</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">조치</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">Tasks</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">미조치 알림</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Analysis Actions & Tasks
        </h1>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 py-4">
        <div className="bg-white rounded-lg border border-gray-200 !mb-0 overflow-x-auto">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
          />
        </div>
        {activeTab === "pending" && <PendingTab />}
        {activeTab === "completed" && <CompletedTab />}
      </div>
    </div>
  );
};

export default Action;
