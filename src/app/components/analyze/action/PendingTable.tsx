import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Tag, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import {
  DeleteOutlined,
  SafetyOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  getVerdictColor,
  getRiskBadgeColor,
} from "@/constants/detectionConstants";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectActionPendingItems,
  selectActionLoading,
  selectActionBulkLoading,
  selectActionSelectedRowKeys,
  setSelectedRowKeys,
  actionBulkProcess,
} from "@/store/actionSlice";
import BulkActionModal from "./BulkActionModal";
import Table from "../../common/Table";

interface PendingItem {
  key: string;
  time: string;
  file_name: string;
  risk: string;
  verdict: string;
  server_ip: string;
}

interface PendingTableProps {
  loading: boolean;
  onActionsRender?: (actionsElement: React.ReactNode) => void;
}

const PendingTable: React.FC<PendingTableProps> = ({
  loading: externalLoading,
  onActionsRender,
}) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectActionPendingItems);
  const loading = useAppSelector(selectActionLoading) || externalLoading;
  const bulkActionLoading = useAppSelector(selectActionBulkLoading);
  const selectedRowKeys = useAppSelector(selectActionSelectedRowKeys);

  const [selectAll, setSelectAll] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");

  useEffect(() => {
    setSelectAll(selectedRowKeys.length === data.length && data.length > 0);
  }, [selectedRowKeys, data.length]);

  const handleBulkAction = useCallback(
    (action: string) => {
      if (selectedRowKeys.length === 0) return;
      setSelectedAction(action);
      setModalVisible(true);
    },
    [selectedRowKeys.length]
  );

  const handleBulkActionConfirm = async (action: string, memo: string) => {
    try {
      await dispatch(
        actionBulkProcess({
          selectedIds: selectedRowKeys as string[],
          action: action as "delete" | "quarantine" | "no_action" | "pending",
          memo,
          userId: "current_user", // TODO: Get from auth state
        })
      ).unwrap();

      message.success(`${selectedRowKeys.length} items processed successfully`);
      setModalVisible(false);
    } catch (error) {
      message.error("Failed to process bulk action");
      console.error("Bulk action failed:", error, selectAll);
    }
  };

  const rowSelection: TableRowSelection<PendingItem> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      dispatch(setSelectedRowKeys(newSelectedRowKeys as string[]));
    },
    onSelectAll: (selected: boolean) => {
      const keys = selected ? data.map((item) => item.key) : [];
      dispatch(setSelectedRowKeys(keys));
    },
    getCheckboxProps: (record: PendingItem) => ({
      name: record.file_name,
    }),
  };

  const columns: ColumnsType<PendingItem> = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 200,
      sorter: true,
      render: (time: string) => (
        <span className="text-sm font-mono">{time}</span>
      ),
    },
    {
      title: "File Name",
      dataIndex: "file_name",
      key: "file_name",
      width: 250,
      sorter: true,
      render: (fileName: string) => (
        <span className="text-sm text-blue-600 hover:text-blue-800 truncate">
          {fileName}
        </span>
      ),
    },
    {
      title: "Risk",
      dataIndex: "risk",
      key: "risk",
      width: 120,
      sorter: true,
      render: (risk: string) => (
        <Tag
          className={`${getRiskBadgeColor(risk)} border font-medium text-xs`}
        >
          {risk}
        </Tag>
      ),
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      key: "verdict",
      width: 120,
      render: (verdict: string) => (
        <Tag
          className={`${getVerdictColor(verdict)} border font-medium text-xs`}
        >
          {verdict}
        </Tag>
      ),
    },
    {
      title: "Server IP",
      dataIndex: "server_ip",
      key: "server_ip",
      width: 150,
      render: (ip: string) => <span className="font-mono text-sm">{ip}</span>,
    },
  ];

  const hasSelectedItems = selectedRowKeys.length > 0;

  const actionButtons = useMemo(
    () => (
      <div className="flex items-center gap-2 justify-end">
        <Button
          className="!h-[45px]"
          type="primary"
          danger
          icon={<DeleteOutlined />}
          disabled={!hasSelectedItems || bulkActionLoading}
          loading={bulkActionLoading && selectedAction === "delete"}
          onClick={() => handleBulkAction("delete")}
          size="middle"
        >
          삭제 (Delete)
        </Button>

        <Button
          className="!h-[45px]"
          type="default"
          icon={<SafetyOutlined />}
          disabled={!hasSelectedItems || bulkActionLoading}
          loading={bulkActionLoading && selectedAction === "quarantine"}
          onClick={() => handleBulkAction("quarantine")}
          size="middle"
          style={{
            borderColor: hasSelectedItems ? "#fa8c16" : undefined,
            color: hasSelectedItems ? "#fa8c16" : undefined,
          }}
        >
          격리 (Quarantine)
        </Button>

        <Button
          className="!h-[45px]"
          type="default"
          icon={<CheckOutlined />}
          disabled={!hasSelectedItems || bulkActionLoading}
          loading={bulkActionLoading && selectedAction === "no_action"}
          onClick={() => handleBulkAction("no_action")}
          size="middle"
          style={{
            borderColor: hasSelectedItems ? "#52c41a" : undefined,
            color: hasSelectedItems ? "#52c41a" : undefined,
          }}
        >
          이상없음 (No Action)
        </Button>

        <Button
          className="!h-[45px]"
          type="default"
          icon={<ClockCircleOutlined />}
          disabled={!hasSelectedItems || bulkActionLoading}
          loading={bulkActionLoading && selectedAction === "pending"}
          onClick={() => handleBulkAction("pending")}
          size="middle"
          style={{
            borderColor: hasSelectedItems ? "#1890ff" : undefined,
            color: hasSelectedItems ? "#1890ff" : undefined,
          }}
        >
          보류 (Pending)
        </Button>
      </div>
    ),
    [hasSelectedItems, bulkActionLoading, selectedAction, handleBulkAction]
  );

  useEffect(() => {
    if (onActionsRender) {
      onActionsRender(actionButtons);
    }
  }, [onActionsRender, actionButtons]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        loading={loading}
        pagination={false}
        scroll={{ x: 800 }}
      />

      <BulkActionModal
        visible={modalVisible}
        action={selectedAction}
        selectedCount={selectedRowKeys.length}
        selectedItems={data.filter((item) =>
          selectedRowKeys.includes(item.key)
        )}
        onConfirm={handleBulkActionConfirm}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
};

export default PendingTable;
