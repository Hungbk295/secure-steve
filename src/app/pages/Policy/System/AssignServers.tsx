import React, { useState } from "react";
import { Breadcrumb, Tabs, TabsProps } from "antd";
import AssignServersTable from "@/app/components/policy/system/AssignServersTable";
import AssignClusterModal from "@/app/components/policy/system/AssignClusterModal";
import AssignManagerModal from "@/app/components/policy/system/AssignManagerModal";
import ServerSettingsTable from "@/app/components/policy/system/ServerSettingsTable";
import HoldServersModal from "@/app/components/policy/system/HoldServersModal";
import ScanSettingsModal from "@/app/components/policy/system/ScanSettingsModal";
import QuarantineFolderModal from "@/app/components/policy/system/QuarantineFolderModal";
import { useAppSelector } from "@/store";
import { selectSettingPolicyLoading } from "@/store/settingPolicySlice";
import { selectSettingServerPolicyLoading } from "@/store/settingServerPolicySlice";

const AssignServers: React.FC = () => {
  const assignServersLoading = useAppSelector(selectSettingPolicyLoading);
  const serverSettingsLoading = useAppSelector(
    selectSettingServerPolicyLoading
  );
  const [assignClusterModalVisible, setAssignClusterModalVisible] =
    useState(false);
  const [assignManagerModalVisible, setAssignManagerModalVisible] =
    useState(false);
  const [holdServersModalVisible, setHoldServersModalVisible] = useState(false);
  const [scanSettingsModalVisible, setScanSettingsModalVisible] =
    useState(false);
  const [quarantineFolderModalVisible, setQuarantineFolderModalVisible] =
    useState(false);
  const [activeTab, setActiveTab] = useState<string>("serverSetting");

  const handleAssignCluster = () => {
    setAssignClusterModalVisible(true);
  };

  const handleAssignManager = () => {
    setAssignManagerModalVisible(true);
  };

  const handleHoldServers = () => {
    setHoldServersModalVisible(true);
  };

  const handleScanSettings = () => {
    setScanSettingsModalVisible(true);
  };

  const handleQuarantineFolder = () => {
    setQuarantineFolderModalVisible(true);
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "serverSetting",
      label: (
        <span className="text-base font-medium pl-4 px-2">관리 서버 할당</span>
      ),
    },
    {
      key: "settingCluster",
      label: (
        <span className="text-base font-medium  px-2">관리 서버 설정</span>
      ),
    },
    {
      key: "adminCluster",
      label: (
        <span className="text-base font-medium  px-2">격리 폴더 설정</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>Policy</Breadcrumb.Item>
          <Breadcrumb.Item>System</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">
            Assign Servers
          </Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Server Policy Assignment
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
        {activeTab === "serverSetting" && (
          <AssignServersTable
            loading={assignServersLoading}
            onAssignCluster={handleAssignCluster}
            onAssignManager={handleAssignManager}
          />
        )}
        {activeTab === "settingCluster" && (
          <ServerSettingsTable
            loading={serverSettingsLoading}
            onHoldServers={handleHoldServers}
            onScanSettings={handleScanSettings}
            onQuarantineFolder={handleQuarantineFolder}
          />
        )}
      </div>

      <AssignClusterModal
        visible={assignClusterModalVisible}
        onCancel={() => setAssignClusterModalVisible(false)}
        onConfirm={() => setAssignClusterModalVisible(false)}
      />

      <AssignManagerModal
        visible={assignManagerModalVisible}
        onCancel={() => setAssignManagerModalVisible(false)}
        onConfirm={() => setAssignManagerModalVisible(false)}
      />

      <HoldServersModal
        visible={holdServersModalVisible}
        onCancel={() => setHoldServersModalVisible(false)}
        onConfirm={() => setHoldServersModalVisible(false)}
      />

      <ScanSettingsModal
        visible={scanSettingsModalVisible}
        onCancel={() => setScanSettingsModalVisible(false)}
        onConfirm={() => setScanSettingsModalVisible(false)}
      />

      <QuarantineFolderModal
        visible={quarantineFolderModalVisible}
        onCancel={() => setQuarantineFolderModalVisible(false)}
        onConfirm={() => setQuarantineFolderModalVisible(false)}
      />
    </div>
  );
};

export default AssignServers;
