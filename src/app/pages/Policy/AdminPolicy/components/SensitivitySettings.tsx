import React from "react";
import { Button, Table, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectSensitivityItems,
  selectSensitivityValues,
  updateSensitivityValue,
} from "@/store/adminPolicySlice";
import DraggableProgress from "./DraggableProgress";

interface SensitivityItem {
  key: string;
  항목: string;
  기준_확도: number;
  사용자_설정_가능_범위: string;
}

interface SensitivitySettingsProps {
  loading: boolean;
  onPolicyAdd: () => void;
}

const SensitivitySettings: React.FC<SensitivitySettingsProps> = ({
  loading,
  onPolicyAdd,
}) => {
  const dispatch = useAppDispatch();
  const sensitivityItems = useAppSelector(selectSensitivityItems);
  const sensitivityValues = useAppSelector(selectSensitivityValues);

  const handleValueChange = (항목: string, value: number) => {
    let key: string;
    switch (항목) {
      case "멀웨어 정의":
        key = "멀웨어정의";
        break;
      case "격리":
        key = "격리";
        break;
      case "보고(알림)":
        key = "보고알림";
        break;
      case "정기 리포트":
        key = "정기리포트";
        break;
      default:
        return;
    }
    dispatch(updateSensitivityValue({ key, value }));
  };

  const columns: ColumnsType<SensitivityItem> = [
    {
      title: "항목",
      dataIndex: "항목",
      key: "항목",
      width: 120,
      render: (text: string) => (
        <div className="font-medium text-center py-2">{text}</div>
      ),
    },
    {
      title: "기준 확도",
      dataIndex: "기준_확도",
      key: "기준_확도",
      width: 120,
      render: (value: number, record: SensitivityItem) => (
        <div className="py-4">
          <DraggableProgress
            value={value}
            min={0}
            max={100}
            onChange={(newValue) => handleValueChange(record.항목, newValue)}
            disabled={loading}
            className="w-full"
          />
        </div>
      ),
    },
    {
      title: "사용자 설정 가능 범위",
      dataIndex: "사용자_설정_가능_범위",
      key: "사용자_설정_가능_범위",
      width: 120,
      render: (text: string, record: SensitivityItem) => {
        const currentValue =
          sensitivityValues[
            record.항목.replace(/[\s()]/g, "") as keyof typeof sensitivityValues
          ] || record.기준_확도;

        return (
          <div className="text-sm leading-relaxed">
            {text.replace("(기준확도)", `${currentValue}%`)}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-1">
      <Space className="ml-auto mr-2">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onPolicyAdd}
          loading={loading}
          className="min-w-[120px]"
        >
          Policy add
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={sensitivityItems.map((item) => ({
          ...item,
          항목: item.항목,
        }))}
        loading={loading}
        pagination={false}
        rowKey="key"
        size="middle"
      />
    </div>
  );
};

export default SensitivitySettings;
