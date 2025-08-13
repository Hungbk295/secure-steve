import React, { useEffect, useMemo } from "react";
import { Button, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectSettingPolicyServers,
  selectSettingPolicyLoading,
  selectSettingPolicySelectedRowKeys,
  setSelectedRowKeys,
  selectSettingPolicyAssignClusterLoading,
  selectSettingPolicyAssignManagerLoading,
} from "@/store/settingPolicySlice";
import Table from "../../common/Table";
import AssignServersFilterBar from "./AssignServersFilterBar";

interface PolicyServerItem {
  key: string;
  server_id: string;
  server_ip: string;
  server_cluster: string;
  manager: {
    id: string;
    name: string;
    dept: string;
  };
  last_malware_detected_at: string;
}

interface AssignServersTableProps {
  loading: boolean;
  onActionButtonsRender?: (actionButtons: React.ReactNode) => void;
  onAssignCluster?: () => void;
  onAssignManager?: () => void;
}

const AssignServersTable: React.FC<AssignServersTableProps> = ({
  loading: externalLoading,
  onActionButtonsRender,
  onAssignCluster,
  onAssignManager,
}) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectSettingPolicyServers);
  const loading = useAppSelector(selectSettingPolicyLoading) || externalLoading;
  const selectedRowKeys = useAppSelector(selectSettingPolicySelectedRowKeys);
  const assignClusterLoading = useAppSelector(
    selectSettingPolicyAssignClusterLoading
  );
  const assignManagerLoading = useAppSelector(
    selectSettingPolicyAssignManagerLoading
  );

  const hasSelectedItems = selectedRowKeys.length > 0;

  const handleRowSelectionChange = (selectedKeys: React.Key[]) => {
    dispatch(setSelectedRowKeys(selectedKeys as string[]));
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} | ${hours}:${minutes}`;
  };

  const columns: ColumnsType<PolicyServerItem> = [
    {
      title: "Server IP",
      dataIndex: "server_ip",
      key: "server_ip",
      width: 150,
      sorter: true,
      render: (ip: string) => <span className="font-mono text-sm">{ip}</span>,
    },
    {
      title: "Server Cluster",
      dataIndex: "server_cluster",
      key: "server_cluster",
      width: 150,
      sorter: true,
      render: (cluster: string) => <span className="text-sm">{cluster}</span>,
    },
    {
      title: "Server Manager",
      dataIndex: "manager",
      key: "manager",
      width: 200,
      render: (manager: PolicyServerItem["manager"]) => (
        <div className="text-sm">
          <div className="font-medium">{manager.name}</div>
          <div className="text-gray-500 text-xs">{manager.dept}</div>
        </div>
      ),
    },
    {
      title: "Last Malware Detection",
      dataIndex: "last_malware_detected_at",
      key: "last_malware_detected_at",
      width: 200,
      sorter: true,
      render: (dateTime: string) => (
        <span className="text-sm font-mono">{formatDateTime(dateTime)}</span>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectionChange,
    getCheckboxProps: (record: PolicyServerItem) => ({
      disabled: loading,
      name: record.server_id,
    }),
  };

  const actionButtons = useMemo(
    () => (
      <div className="flex items-center gap-2 justify-end">
        <Button
          type="primary"
          disabled={!hasSelectedItems}
          loading={assignClusterLoading}
          onClick={onAssignCluster}
        >
          클러스터 할당 (Assign Cluster)
        </Button>
        <Button
          disabled={!hasSelectedItems}
          loading={assignManagerLoading}
          onClick={onAssignManager}
        >
          매니저 할당 (Assign Manager)
        </Button>
      </div>
    ),
    [
      hasSelectedItems,
      assignClusterLoading,
      assignManagerLoading,
      onAssignCluster,
      onAssignManager,
    ]
  );

  useEffect(() => {
    if (onActionButtonsRender) {
      onActionButtonsRender(actionButtons);
    }
  }, [onActionButtonsRender, actionButtons]);

  return (
    <div className="flex flex-col gap-4">
      <Card
        size="small"
        className="assign-servers-filter-bar"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border-100)",
          borderRadius: "8px",
        }}
      >
        <AssignServersFilterBar loading={loading} />
      </Card>
      <div className="assign-servers-table-container">
        <div className="mb-1 flex justify-end mr-3">{actionButtons}</div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
          rowSelection={rowSelection}
          rowKey="server_id"
        />
      </div>
    </div>
  );
};

export default AssignServersTable;
