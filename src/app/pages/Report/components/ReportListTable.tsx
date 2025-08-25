import React, { useState } from "react";
import { Button, Tag } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import Table from "@/app/components/common/Table";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectReportListItems,
  updatePagination,
  actionGetReportList,
  actionUpdateAlertStatus,
} from "@/store/reportListSlice";

interface ReportListItem {
  key: string;
  id: string;
  time: string;
  status: "read" | "unread";
  alertName: string;
  actionedBy: string;
}

interface ReportListTableProps {
  loading: boolean;
}

const ReportListTable: React.FC<ReportListTableProps> = ({ loading }) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectReportListItems);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("ko-KR", { month: "short" });
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const getStatusTag = (status: "read" | "unread") => {
    return status === "unread" ? (
      <Tag icon={<EyeInvisibleOutlined />}>안읽음</Tag>
    ) : (
      <Tag icon={<EyeOutlined />}>읽음</Tag>
    );
  };

  const getActionedByTag = (actionedBy: string) => {
    return <Tag>{actionedBy}</Tag>;
  };

  const handleStatusToggle = async (record: ReportListItem) => {
    const newStatus = record.status === "read" ? "unread" : "read";
    dispatch(actionUpdateAlertStatus({ id: record.id, status: newStatus }));
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<ReportListItem> = [
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      sorter: true,
      render: (status: "read" | "unread", record: ReportListItem) => (
        <div
          className="cursor-pointer"
          onClick={() => handleStatusToggle(record)}
        >
          {getStatusTag(status)}
        </div>
      ),
    },
    {
      title: "Alert Name",
      dataIndex: "alertName",
      key: "alertName",
      width: 200,
      render: (alertName: string) => (
        <Button type="link" className="!p-0 !h-auto text-left">
          <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
            {alertName}
          </span>
        </Button>
      ),
    },
    {
      title: "Actioned by",
      dataIndex: "actionedBy",
      key: "actionedBy",
      width: 120,
      render: (actionedBy: string) => getActionedByTag(actionedBy),
    },
  ];

  const handleTableChange: TableProps<ReportListItem>["onChange"] = (
    paginationConfig,
    filters,
    sorter
  ) => {
    const newPagination = {
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    };

    dispatch(updatePagination(newPagination));

    dispatch(
      actionGetReportList({
        ...filters,
        page: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
        sorter,
      })
    );
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="report-list-table-container">
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          rowSelection={rowSelection}
          showPagination={true}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  );
};

export default ReportListTable;
