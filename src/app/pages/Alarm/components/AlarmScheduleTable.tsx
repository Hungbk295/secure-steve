import React from "react";
import { Button, Tag } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Table from "@/app/components/common/Table";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useAppSelector, useAppDispatch } from "@/store";
import Select from "@/app/components/common/Select";
import {
  selectAlarmScheduleItems,
  updatePagination,
  actionGetAlarmScheduleList,
  actionUpdateFilePolicy,
  actionExportCSV,
} from "@/store/alarmScheduleSlice";

interface AlarmScheduleItem {
  key: string;
  id: string;
  time: string;
  userName: string;
  department: string;
  category: string;
  status: string;
  authorityGroup: string;
  action: string;
  processAction: string;
}

interface AlarmScheduleTableProps {
  loading: boolean;
}

const AlarmScheduleTable: React.FC<AlarmScheduleTableProps> = ({ loading }) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectAlarmScheduleItems);

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
      case "보류":
        return <Tag>{status}</Tag>;
      case "삭제(퇴사)":
      case "삭제":
        return <Tag>{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getCategoryTag = (category: string) => {
    switch (category) {
      case "관리자":
        return <Tag>{category}</Tag>;
      case "사용자":
        return <Tag>{category}</Tag>;
      default:
        return <Tag>{category}</Tag>;
    }
  };

  const getActionTag = (action: string) => {
    if (action.includes("승인")) {
      return <Tag>{action}</Tag>;
    } else if (action.includes("삭제")) {
      return <Tag>{action}</Tag>;
    } else if (action.includes("보류") || action.includes("중립")) {
      return <Tag>{action}</Tag>;
    }
    return <Tag>{action}</Tag>;
  };

  const handleProcessActionChange = (
    value: string,
    record: AlarmScheduleItem
  ) => {
    dispatch(actionUpdateFilePolicy({ id: record.id, policy: value }));
  };

  const handleRowClick = (record: AlarmScheduleItem) => {
    console.log("Row clicked - Open detail view for:", record.id);
    // TODO: Navigate to detail page
    // window.open(`/alarm/schedule/${record.id}`, '_blank');
  };

  const columns: ColumnsType<AlarmScheduleItem> = [
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
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      width: 120,
      render: (name: string) => (
        <span className="text-sm font-medium">{name}</span>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 150,
      render: (department: string) => (
        <span className="text-sm">{department}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: string) => getCategoryTag(category),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Authority",
      dataIndex: "authorityGroup",
      key: "authorityGroup",
      width: 130,
      render: (authorityGroup: string) => getCategoryTag(authorityGroup),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 130,
      render: (action: string) => getActionTag(action),
    },
    {
      title: "Process Action",
      dataIndex: "processAction",
      key: "processAction",
      width: 150,
      render: (processAction: string, record: AlarmScheduleItem) => (
        <Select
          value={processAction}
          onChange={(value) => handleProcessActionChange(value, record)}
          placeholder="Select Action"
          className="w-full"
          size="small"
          disabled={loading}
          options={[
            { label: "None", value: "none" },
            { label: "Blacklist", value: "Blacklist" },
            { label: "Whitelist", value: "Whitelist" },
          ]}
        />
      ),
    },
  ];

  const handleTableChange: TableProps<AlarmScheduleItem>["onChange"] = (
    paginationConfig,
    filters
  ) => {
    dispatch(
      updatePagination({
        current: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
      })
    );

    dispatch(
      actionGetAlarmScheduleList({
        ...filters,
        page: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
      })
    );
  };

  const handleCSVDownload = () => {
    dispatch(actionExportCSV(items));
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Header Info */}
      <div className="flex justify-between items-center">
        <div className="flex items-center mx-auto mr-3">
          <Button
            icon={<DownloadOutlined />}
            onClick={handleCSVDownload}
            loading={loading}
            disabled={items.length === 0}
          >
            CSV Download
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="alarm-schedule-table-container">
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          showPagination={true}
          showPageSizeChanger={true}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          rowKey="key"
          size="middle"
          className="alarm-schedule-table"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </div>
  );
};

export default AlarmScheduleTable;
