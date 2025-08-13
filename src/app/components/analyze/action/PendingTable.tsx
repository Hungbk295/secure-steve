import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Tag, Pagination, Button, Select, message } from "antd";
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
  selectActionPagination,
  selectActionSelectedRowKeys,
  setSelectedRowKeys,
  updatePagination,
  actionBulkProcess,
} from "@/store/actionSlice";
import BulkActionModal from "./BulkActionModal";

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
  const pagination = useAppSelector(selectActionPagination);
  const selectedRowKeys = useAppSelector(selectActionSelectedRowKeys);

  const [selectAll, setSelectAll] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");

  // Update selectAll state when selectedRowKeys changes
  useEffect(() => {
    setSelectAll(selectedRowKeys.length === data.length && data.length > 0);
  }, [selectedRowKeys, data.length]);

  // Handle bulk action selection
  const handleBulkAction = useCallback(
    (action: string) => {
      if (selectedRowKeys.length === 0) return;
      setSelectedAction(action);
      setModalVisible(true);
    },
    [selectedRowKeys.length]
  );

  // Handle bulk action confirm
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
      console.error("Bulk action failed:", error);
    }
  };

  // Row selection configuration
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

  // Table columns
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

  // Page size options
  const pageSizeOptions = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "30", value: 30 },
    { label: "40", value: 40 },
    { label: "50", value: 50 },
  ];

  const hasSelectedItems = selectedRowKeys.length > 0;

  // Create action buttons element
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

  // Pass action buttons to parent if callback provided
  useEffect(() => {
    if (onActionsRender) {
      onActionsRender(actionButtons);
    }
  }, [onActionsRender, actionButtons]);

  return (
    <div className="pending-table-container">
      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        loading={loading}
        pagination={false}
        className="pending-alerts-table"
        scroll={{ x: 800 }}
        size="small"
      />

      {/* Footer with Pagination */}
      <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Total: {pagination.total} records
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Page size:</span>
            <Select
              value={pagination.pageSize}
              onChange={(value) =>
                dispatch(updatePagination({ pageSize: value, current: 1 }))
              }
              size="small"
              className="w-20"
              options={pageSizeOptions}
            />
          </div>

          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={(page) => dispatch(updatePagination({ current: page }))}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            size="small"
          />
        </div>
      </div>

      {/* Bulk Action Modal */}
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
