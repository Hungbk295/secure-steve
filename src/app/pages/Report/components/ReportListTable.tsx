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

// interface AlertDetail {
//   id: string;
//   time: string;
//   status: string;
//   alertName: string;
//   actionedBy: string;
//   description: string;
//   severity: string;
//   source: string;
//   target: string;
//   details: {
//     sourceIP: string;
//     targetIP: string;
//     protocol: string;
//     port: string;
//     attempts: number;
//   };
// }

const ReportListTable: React.FC<ReportListTableProps> = ({ loading }) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectReportListItems);
  console.log("items", items);
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
    // const colorMap: { [key: string]: string } = {
    //   시스템: "blue",
    //   "KISA DB": "purple",
    //   관리자: "red",
    //   보안팀: "orange",
    //   운영팀: "cyan",
    // };

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

      {/* Alert Detail Modal */}
      {/* <Modal
        title="Alert Detail"
        open={isDetailModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
        width={800}
        loading={detailLoading}
      >
        {selectedAlert && (
          <div className="space-y-4">
            <Descriptions title="Alert Information" bordered column={2}>
              <Descriptions.Item label="Alert ID" span={2}>
                {selectedAlert.id}
              </Descriptions.Item>
              <Descriptions.Item label="Time">
                {formatDateTime(selectedAlert.time)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusTag(selectedAlert.status as "read" | "unread")}
              </Descriptions.Item>
              <Descriptions.Item label="Alert Name" span={2}>
                {selectedAlert.alertName}
              </Descriptions.Item>
              <Descriptions.Item label="Actioned by">
                {getActionedByTag(selectedAlert.actionedBy)}
              </Descriptions.Item>
              <Descriptions.Item label="Severity">
                <Tag
                  color={selectedAlert.severity === "high" ? "red" : "orange"}
                >
                  {selectedAlert.severity.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Description" bordered>
              <Descriptions.Item label="Details" span={3}>
                {selectedAlert.description}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Technical Details" bordered column={2}>
              <Descriptions.Item label="Source IP">
                {selectedAlert.details.sourceIP}
              </Descriptions.Item>
              <Descriptions.Item label="Target IP">
                {selectedAlert.details.targetIP}
              </Descriptions.Item>
              <Descriptions.Item label="Protocol">
                {selectedAlert.details.protocol}
              </Descriptions.Item>
              <Descriptions.Item label="Port">
                {selectedAlert.details.port}
              </Descriptions.Item>
              <Descriptions.Item label="Attempts" span={2}>
                {selectedAlert.details.attempts}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal> */}
    </div>
  );
};

export default ReportListTable;
