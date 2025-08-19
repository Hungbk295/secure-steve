import React from "react";
import { Button, Table, Select, Tag } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectAuthorityHistoryItems,
  selectAuthorityHistoryPagination,
  updatePagination,
  actionGetAuthorityHistoryList,
  actionExportCSV,
  selectAuthorityHistoryFilters,
} from "@/store/authorityHistorySlice";

const { Option } = Select;

interface AuthorityHistoryItem {
  key: string;
  id: string;
  time: string;
  user_name: string;
  department: string;
  user_type: string;
  status: string;
}

interface AuthorityHistoryTableProps {
  loading: boolean;
}

const AuthorityHistoryTable: React.FC<AuthorityHistoryTableProps> = ({
  loading,
}) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectAuthorityHistoryItems);
  const pagination = useAppSelector(selectAuthorityHistoryPagination);
  const filters = useAppSelector(selectAuthorityHistoryFilters);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "신규 승인":
        return <Tag>{status}</Tag>;
      case "반려":
        return <Tag>{status}</Tag>;
      case "삭제(퇴사)":
        return <Tag>{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getUserTypeTag = (userType: string) => {
    switch (userType) {
      case "관리자":
        return <Tag>{userType}</Tag>;
      case "사용자":
        return <Tag>{userType}</Tag>;
      default:
        return <Tag>{userType}</Tag>;
    }
  };

  const columns: ColumnsType<AuthorityHistoryItem> = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 150,
      sorter: true,
      render: (dateTime: string) => (
        <span className="text-sm font-mono">{formatDateTime(dateTime)}</span>
      ),
    },
    {
      title: "사용자 (User)",
      dataIndex: "user_name",
      key: "user_name",
      width: 120,
      render: (name: string) => (
        <span className="text-sm font-medium">{name}</span>
      ),
    },
    {
      title: "부서 (Department)",
      dataIndex: "department",
      key: "department",
      width: 150,
      render: (department: string) => (
        <span className="text-sm">{department}</span>
      ),
    },
    {
      title: "사용자 구분 (User Type)",
      dataIndex: "user_type",
      key: "user_type",
      width: 150,
      render: (userType: string) => getUserTypeTag(userType),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: string) => getStatusTag(status),
    },
  ];

  const handleTableChange = (paginationConfig: any, filters: any) => {
    dispatch(
      updatePagination({
        current: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
      })
    );

    dispatch(
      actionGetAuthorityHistoryList({
        ...filters,
        page: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
      })
    );
  };

  const handlePageSizeChange = (value: number) => {
    dispatch(
      updatePagination({
        current: 1,
        pageSize: value,
      })
    );

    dispatch(
      actionGetAuthorityHistoryList({
        ...filters,
        page: 1,
        pageSize: value,
      })
    );
  };

  const handleCSVDownload = () => {
    dispatch(actionExportCSV(items));
  };

  const paginationConfig = {
    current: pagination.current,
    total: pagination.total,
    pageSize: pagination.pageSize,
    showSizeChanger: false,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} items`,
    pageSizeOptions: ["10", "20", "30", "50", "100"],
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Total: {pagination.total} records
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            icon={<DownloadOutlined />}
            onClick={handleCSVDownload}
            loading={loading}
            disabled={items.length === 0}
          >
            CSV 다운로드
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="authority-history-table-container">
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={paginationConfig}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
          rowKey="key"
          size="middle"
          className="authority-history-table"
        />
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between items-center pt-2 border-t">
        <div className="text-sm text-gray-600">
          Showing{" "}
          {Math.min(
            (pagination.current - 1) * pagination.pageSize + 1,
            pagination.total
          )}
          -
          {Math.min(pagination.current * pagination.pageSize, pagination.total)}{" "}
          of {pagination.total} entries
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rows per page:</span>
          <Select
            value={pagination.pageSize}
            onChange={handlePageSizeChange}
            size="small"
            style={{ width: 80 }}
            disabled={loading}
          >
            <Option value={10}>10개</Option>
            <Option value={20}>20개</Option>
            <Option value={30}>30개</Option>
            <Option value={50}>50개</Option>
            <Option value={100}>100개</Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AuthorityHistoryTable;
