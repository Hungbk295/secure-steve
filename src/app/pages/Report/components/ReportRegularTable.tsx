import React, { useState } from "react";
import { Button, Tag, Modal, Descriptions } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Table from "@/app/components/common/Table";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectReportRegularItems,
  updatePagination,
  actionGetReportRegularList,
  actionUpdateReportStatus,
  actionGetReportDetail,
  actionDownloadReport,
} from "@/store/reportRegularSlice";

interface ReportRegularItem {
  key: string;
  id: string;
  time: string;
  status: "read" | "unread";
  reportName: string;
  publishBy: string;
}

interface ReportRegularTableProps {
  loading: boolean;
}

interface ReportDetail {
  id: string;
  time: string;
  status: string;
  reportName: string;
  publishBy: string;
  description: string;
  fileSize: string;
  format: string;
  downloadUrl: string;
  content: {
    summary: string;
    threats: number;
    resolved: number;
    pending: number;
    recommendations: string[];
  };
}

const ReportRegularTable: React.FC<ReportRegularTableProps> = ({ loading }) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectReportRegularItems);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(
    null
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null);

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

  const getPublishByTag = (publishBy: string) => {
    // const colorMap: { [key: string]: string } = {
    //   "정기 생성": "blue",
    //   "사용자 요청": "purple",
    //   시스템: "cyan",
    //   보안팀: "orange",
    //   운영팀: "green",
    //   "KISA DB": "red",
    // };

    return <Tag>{publishBy}</Tag>;
  };

  const handleStatusToggle = async (record: ReportRegularItem) => {
    const newStatus = record.status === "read" ? "unread" : "read";
    dispatch(actionUpdateReportStatus({ id: record.id, status: newStatus }));
  };

  const handleReportNameClick = async (record: ReportRegularItem) => {
    setDetailLoading(true);
    setIsDetailModalVisible(true);

    try {
      const result = await dispatch(actionGetReportDetail(record.id)).unwrap();
      setSelectedReport(result);
    } catch (error) {
      console.error("Failed to fetch report detail:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDownload = async (reportId: string) => {
    setDownloadLoading(reportId);
    try {
      await dispatch(actionDownloadReport(reportId)).unwrap();
    } catch (error) {
      console.error("Failed to download report:", error);
    } finally {
      setDownloadLoading(null);
    }
  };

  const handleModalClose = () => {
    setIsDetailModalVisible(false);
    setSelectedReport(null);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<ReportRegularItem> = [
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
      render: (status: "read" | "unread", record: ReportRegularItem) => (
        <div
          className="cursor-pointer"
          onClick={() => handleStatusToggle(record)}
        >
          {getStatusTag(status)}
        </div>
      ),
    },
    {
      title: "Report Name",
      dataIndex: "reportName",
      key: "reportName",
      width: 300,
      render: (reportName: string, record: ReportRegularItem) => (
        <Button
          type="link"
          className="!p-0 !h-auto text-left"
          onClick={() => handleReportNameClick(record)}
        >
          <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
            {reportName}
          </span>
        </Button>
      ),
    },
    {
      title: "Publish by",
      dataIndex: "publishBy",
      key: "publishBy",
      width: 120,
      render: (publishBy: string) => getPublishByTag(publishBy),
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   width: 100,
    //   render: (_, record: ReportRegularItem) => (
    //     <Button
    //       type="primary"
    //       size="small"
    //       icon={<DownloadOutlined />}
    //       loading={downloadLoading === record.id}
    //       onClick={() => handleDownload(record.id)}
    //     >
    //       Download
    //     </Button>
    //   ),
    // },
  ];

  const handleTableChange: TableProps<ReportRegularItem>["onChange"] = (
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
      actionGetReportRegularList({
        ...filters,
        page: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
        sorter,
      })
    );
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="report-regular-table-container">
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          scroll={{ x: 900 }}
          rowKey="key"
          size="middle"
          className="report-regular-table"
        />
      </div>

      {/* Report Detail Modal */}
      <Modal
        title="Report Detail"
        open={isDetailModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloadLoading === selectedReport?.id}
            onClick={() => selectedReport && handleDownload(selectedReport.id)}
          >
            Download
          </Button>,
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
        width={900}
        loading={detailLoading}
      >
        {selectedReport && (
          <div className="space-y-4">
            <Descriptions title="Report Information" bordered column={2}>
              <Descriptions.Item label="Report ID" span={2}>
                {selectedReport.id}
              </Descriptions.Item>
              <Descriptions.Item label="Created Time">
                {formatDateTime(selectedReport.time)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusTag(selectedReport.status as "read" | "unread")}
              </Descriptions.Item>
              <Descriptions.Item label="Report Name" span={2}>
                {selectedReport.reportName}
              </Descriptions.Item>
              <Descriptions.Item label="Published by">
                {getPublishByTag(selectedReport.publishBy)}
              </Descriptions.Item>
              <Descriptions.Item label="File Size">
                {selectedReport.fileSize}
              </Descriptions.Item>
              <Descriptions.Item label="Format" span={2}>
                <Tag color="blue">{selectedReport.format}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Description" bordered>
              <Descriptions.Item label="Summary" span={3}>
                {selectedReport.description}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Report Content" bordered column={2}>
              <Descriptions.Item label="Summary">
                {selectedReport.content.summary}
              </Descriptions.Item>
              <Descriptions.Item label="Total Threats">
                <Tag color="red">{selectedReport.content.threats}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Resolved">
                <Tag color="green">{selectedReport.content.resolved}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Pending">
                <Tag color="orange">{selectedReport.content.pending}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Recommendations" span={2}>
                <div className="space-y-1">
                  {selectedReport.content.recommendations.map((rec, index) => (
                    <div key={index} className="text-sm">
                      • {rec}
                    </div>
                  ))}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportRegularTable;
