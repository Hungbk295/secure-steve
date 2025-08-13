import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Tag, Pagination, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import {
  DeleteOutlined,
  SafetyOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { MOCK_ActionPending_Analysis } from "@/constants/mockAlert";
import {
  getVerdictColor,
  getRiskBadgeColor,
} from "@/constants/detectionConstants";
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
  filters: any;
  loading: boolean;
  onActionsRender?: (actionsElement: React.ReactNode) => void;
}

const PendingTable: React.FC<PendingTableProps> = ({
  filters,
  loading,
  onActionsRender,
}) => {
  const [data, setData] = useState<PendingItem[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");

  // Load and filter data
  useEffect(() => {
    // Transform mock data to include keys
    const transformedData: PendingItem[] = MOCK_ActionPending_Analysis.map(
      (item, index) => ({
        key: `pending-${index}`,
        time: item.time,
        file_name: item.file_name,
        risk: item.risk,
        verdict: item.verdict,
        server_ip: item.server_ip,
      })
    );

    // Apply filters
    let filteredData = transformedData;

    if (filters.risk && filters.risk.length > 0) {
      filteredData = filteredData.filter((item) => {
        const riskNum = parseFloat(item.risk.replace("%", ""));
        return filters.risk.some((riskLevel: string) => {
          switch (riskLevel) {
            case "high":
              return riskNum >= 80;
            case "medium":
              return riskNum >= 50 && riskNum < 80;
            case "low":
              return riskNum < 50;
            default:
              return true;
          }
        });
      });
    }

    if (filters.verdict && filters.verdict.length > 0) {
      filteredData = filteredData.filter((item) =>
        filters.verdict.includes(item.verdict.toLowerCase())
      );
    }

    if (filters.serverIP) {
      filteredData = filteredData.filter(
        (item) => item.server_ip === filters.serverIP
      );
    }

    setData(filteredData);
    setSelectedRowKeys([]);
    setSelectAll(false);
  }, [filters]);

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
      console.log("Bulk action:", {
        action,
        selectedItems: selectedRowKeys,
        memo,
        count: selectedRowKeys.length,
        selectAll,
      });

      // TODO: Implement API call
      // await bulkActionAPI(selectedRowKeys, action, memo);

      // Reset selections and close modal
      setSelectedRowKeys([]);
      setSelectAll(false);
      setModalVisible(false);

      // TODO: Refresh data or remove processed items
    } catch (error) {
      console.error("Bulk action failed:", error);
    }
  };

  // Row selection configuration
  const rowSelection: TableRowSelection<PendingItem> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setSelectAll(
        newSelectedRowKeys.length === data.length && data.length > 0
      );
    },
    onSelectAll: (selected: boolean) => {
      const keys = selected ? data.map((item) => item.key) : [];
      setSelectedRowKeys(keys);
      setSelectAll(selected);
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
          disabled={!hasSelectedItems}
          onClick={() => handleBulkAction("delete")}
          size="middle"
        >
          삭제 (Delete)
        </Button>

        <Button
          className="!h-[45px]"
          type="default"
          icon={<SafetyOutlined />}
          disabled={!hasSelectedItems}
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
          disabled={!hasSelectedItems}
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
          disabled={!hasSelectedItems}
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
    [hasSelectedItems, handleBulkAction]
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
          Total: {data.length} records
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Page size:</span>
            <Select
              value={pageSize}
              onChange={setPageSize}
              size="small"
              className="w-20"
              options={pageSizeOptions}
            />
          </div>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={data.length}
            onChange={setCurrentPage}
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
