import { useState, useEffect } from "react";
import { Table, Radio, List, Typography, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import CustomModal from "@/app/components/common/CustomModal";
import { EModalMode } from "@/interfaces/app";
import type { ColumnsType } from "antd/es/table";

export interface ManagerData {
  id: string;
  name: string;
  department: string;
  role: string;
  currentServerCount: number;
}

interface ManagerPopupProps {
  visible: boolean;
  selectedServerIPs: string[];
  managers: ManagerData[];
  selectedManagerId?: string;
  onCancel: () => void;
  onConfirm: (managerId: string) => void;
  onManagerSelect?: (managerId: string) => void;
  loading?: boolean;
}
function ManagerPopup({
  visible,
  selectedServerIPs,
  managers,
  selectedManagerId,
  onCancel,
  onConfirm,
  onManagerSelect,
  loading = false,
}: ManagerPopupProps) {
  const [selectedManager, setSelectedManager] = useState<string | undefined>(
    selectedManagerId
  );

  useEffect(() => {
    if (visible) {
      setSelectedManager(selectedManagerId);
    }
  }, [visible, selectedManagerId]);

  const handleManagerSelect = (managerId: string) => {
    setSelectedManager(managerId);
    if (onManagerSelect) {
      onManagerSelect(managerId);
    }
  };

  const handleOk = () => {
    if (selectedManager) {
      onConfirm(selectedManager);
    }
  };

  const getSelectedManagerInfo = () => {
    return managers.find((manager) => manager.id === selectedManager);
  };

  const columns: ColumnsType<ManagerData> = [
    {
      title: "Select",
      key: "select",
      width: 60,
      render: (_, record) => (
        <Radio
          checked={selectedManager === record.id}
          onChange={() => handleManagerSelect(record.id)}
        />
      ),
    },
    {
      title: "성명 (Name)",
      dataIndex: "name",
      key: "name",
      width: 120,
      render: (name: string) => (
        <div className="flex items-center space-x-2">
          <UserOutlined className="text-gray-500" />
          <span className="font-medium">{name}</span>
        </div>
      ),
    },
    {
      title: "부서 (Department)",
      dataIndex: "department",
      key: "department",
      width: 150,
      render: (department: string) => <Tag color="blue">{department}</Tag>,
    },
    {
      title: "권한 (Role)",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => (
        <Tag color={role === "Administrator" ? "red" : "green"}>{role}</Tag>
      ),
    },
    {
      title: "현재 담당서버 (Current Servers)",
      dataIndex: "currentServerCount",
      key: "currentServerCount",
      width: 150,
      render: (count: number) => (
        <span
          className={`font-semibold ${
            count > 10 ? "text-orange-600" : "text-green-600"
          }`}
        >
          {count} servers
        </span>
      ),
    },
  ];

  if (!visible) return null;

  return (
    <CustomModal
      title="Manager Assignment"
      mode={EModalMode.MULTIPLE}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Assign"
      cancelText="Cancel"
      width={800}
      onClose={onCancel}
      className="manager-popup"
    >
      <div className="space-y-6">
        <div>
          <Typography.Title level={5} className="mb-3">
            Select Manager
          </Typography.Title>
          <Table<ManagerData>
            columns={columns}
            dataSource={managers}
            rowKey="id"
            loading={loading}
            pagination={false}
            size="middle"
            scroll={{ y: 300 }}
            className="border border-gray-200 rounded-lg"
            onRow={(record) => ({
              onClick: () => handleManagerSelect(record.id),
              className: selectedManager === record.id ? "bg-blue-50" : "",
            })}
          />
        </div>

        {selectedManager && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <Typography.Title level={5} className="mb-2 text-blue-700">
              Selected Manager
            </Typography.Title>
            {(() => {
              const manager = getSelectedManagerInfo();
              return manager ? (
                <div className="space-y-1">
                  <div>
                    <strong>Name:</strong> {manager.name}
                  </div>
                  <div>
                    <strong>Department:</strong> {manager.department}
                  </div>
                  <div>
                    <strong>Role:</strong> {manager.role}
                  </div>
                  <div>
                    <strong>Current Servers:</strong>{" "}
                    {manager.currentServerCount}
                  </div>
                  <div>
                    <strong>After Assignment:</strong>{" "}
                    {manager.currentServerCount + selectedServerIPs.length}{" "}
                    servers
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}

        <div>
          <Typography.Title level={5} className="mb-3">
            Servers to Assign ({selectedServerIPs.length})
          </Typography.Title>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
            <List
              size="small"
              dataSource={selectedServerIPs}
              renderItem={(ip) => (
                <List.Item className="px-4 py-2">
                  <Typography.Text code>{ip}</Typography.Text>
                </List.Item>
              )}
              locale={{ emptyText: "No servers selected" }}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
}

export default ManagerPopup;
