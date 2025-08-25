import React from "react";
import Table from "@/app/components/common/Table";
import type { ColumnsType } from "antd/es/table";
import { Tag } from "antd";

interface NotificationData {
  id: string;
  name: string;
  department: string;
  phone: string;
  email: string;
  role: string;
}

interface AlarmNotificationsTableProps {
  loading: boolean;
  dataSource: NotificationData[];
}

const AlarmNotificationsTable: React.FC<AlarmNotificationsTableProps> = ({
  loading,
  dataSource,
}) => {
  const columns: ColumnsType<NotificationData> = [
    {
      title: "성명",
      dataIndex: "name",
      key: "name",
      width: 120,
    },
    {
      title: "부서",
      dataIndex: "department",
      key: "department",
      width: 150,
    },
    {
      title: "전화번호",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "이메일",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "권한",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => {
        return <Tag>{role}</Tag>;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey="id"
      showPagination={true}
    />
  );
};

export default AlarmNotificationsTable;
