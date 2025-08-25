import React, { useState } from "react";
import { Button, Tag, Modal, Input } from "antd";
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
const { TextArea } = Input;

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<AlarmScheduleItem | null>(null);
  const [selectedActionLabel, setSelectedActionLabel] = useState<string>("");
  const [reason, setReason] = useState<string>("");

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

  const handleProcessActionChange = (
    value: string,
    record: AlarmScheduleItem
  ) => {
    dispatch(actionUpdateFilePolicy({ id: record.id, policy: value }));
  };
  const handleProcessActionProcessChange = (
    value: string,
    record: AlarmScheduleItem
  ) => {
    setSelectedRecord(record);
    setSelectedActionLabel(value);
    setReason("");
    setIsModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedRecord && selectedActionLabel) {
      dispatch(
        actionUpdateFilePolicy({
          id: selectedRecord.id,
          policy: selectedActionLabel,
        })
      );
    }
    setIsModalOpen(false);
    setSelectedRecord(null);
    setSelectedActionLabel("");
    setReason("");
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setSelectedActionLabel("");
    setReason("");
  };

  const handleRowClick = (record: AlarmScheduleItem) => {
    console.log("Row clicked - Open detail view for:", record.id);
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
      render: (processAction: string, record: AlarmScheduleItem) => (
        <Select
          value={processAction}
          onChange={(value) => handleProcessActionChange(value, record)}
          placeholder="Select Action"
          className="w-full"
          size="small"
          disabled={loading}
          options={[
            { label: "사용자", value: "사용자" },
            { label: "관리자", value: "관리자" },
          ]}
        />
      ),
    },
    {
      title: "Process Action",
      dataIndex: "processAction",
      key: "processAction",
      width: 150,
      render: (processAction: string, record: AlarmScheduleItem) => (
        <Select
          value={processAction}
          onChange={(value) => handleProcessActionProcessChange(value, record)}
          placeholder="Select Action"
          className="w-full"
          size="small"
          disabled={loading}
          options={[
            { label: "승인", value: "승인" },
            { label: "잠금", value: "잠금" },
            { label: "잠금해제", value: "잠금해제" },
            { label: "삭제", value: "삭제" },
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
      <Modal
        title="Confirm Action"
        open={isModalOpen}
        onOk={handleConfirmAction}
        onCancel={handleCancelModal}
        okButtonProps={{ loading: loading, disabled: !selectedActionLabel }}
        cancelButtonProps={{ disabled: loading }}
      >
        <div className="space-y-3 mb-8">
          <div className="text-sm text-gray-800">
            {selectedActionLabel
              ? `${selectedActionLabel} 사유 입력 하십시오.`
              : "사유를 입력 하십시오."}
          </div>
          <TextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={
              selectedActionLabel
                ? `${selectedActionLabel} 사유 입력 하십시오.`
                : "사유 입력"
            }
            rows={4}
            maxLength={500}
            showCount
            disabled={loading}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AlarmScheduleTable;
