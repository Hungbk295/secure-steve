import React, { useState } from "react";
import { Breadcrumb, Tabs, TabsProps } from "antd";
import SensitivitySettings from "./components/SensitivitySettings";
import ImportanceTemplate from "./components/ImportanceTemplate";
import OperationPolicy from "./components/OperationPolicy";
import PolicyAddModal from "./components/PolicyAddModal";
import { useAppSelector } from "@/store";
import { selectAdminPolicyLoading } from "@/store/adminPolicySlice";

const AdminPolicy: React.FC = () => {
  const loading = useAppSelector(selectAdminPolicyLoading);
  const [activeTab, setActiveTab] = useState<string>("sensitivity");
  const [policyAddModalVisible, setPolicyAddModalVisible] = useState(false);

  const handlePolicyAdd = () => {
    setPolicyAddModalVisible(true);
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "sensitivity",
      label: (
        <span className="text-base font-medium pl-4 px-2">민감도 설정</span>
      ),
    },
    {
      key: "importance",
      label: <span className="text-base font-medium px-2">중요도 템플릿</span>,
    },
    {
      key: "operation",
      label: <span className="text-base font-medium px-2">운영 정책</span>,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>Policy</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">
            Admin Policy
          </Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Policy Management
        </h1>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-4">
        <div className="bg-white rounded-lg border border-gray-200 !mb-0 overflow-x-auto">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
          />
        </div>

        {activeTab === "sensitivity" && (
          <SensitivitySettings
            loading={loading}
            onPolicyAdd={handlePolicyAdd}
          />
        )}

        {activeTab === "importance" && <ImportanceTemplate loading={loading} />}

        {activeTab === "operation" && <OperationPolicy loading={loading} />}
      </div>

      <PolicyAddModal
        visible={policyAddModalVisible}
        onCancel={() => setPolicyAddModalVisible(false)}
        onConfirm={() => setPolicyAddModalVisible(false)}
      />
    </div>
  );
};

export default AdminPolicy;
