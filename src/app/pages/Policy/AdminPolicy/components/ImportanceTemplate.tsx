import React, { useState } from "react";
import { Button, Table, Space, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectImportanceItems,
  selectSelectedImportance,
  updateImportanceItem,
  selectSensitivityItems,
  selectSensitivityValues,
  updateSensitivityValue,
} from "@/store/adminPolicySlice";
import DraggableProgress from "./DraggableProgress";
import PolicyEditModal from "./PolicyEditModal";
interface SensitivityItem {
  key: string;
  항목: string;
  기준_확도: number;
  사용자_설정_가능_범위: string;
}
interface ImportanceItem {
  key: string;
  중요도: string;
  격리_임계치: string;
  보고_임계치: string;
}

interface ImportanceTemplateProps {
  loading: boolean;
}

const ImportanceTemplate: React.FC<ImportanceTemplateProps> = ({ loading }) => {
  const dispatch = useAppDispatch();
  const importanceItems = useAppSelector(selectImportanceItems);
  const selectedImportance = useAppSelector(selectSelectedImportance);
  const [isEditing] = useState(false);
  const [policyEditModalVisible, setPolicyEditModalVisible] = useState(false);
  const sensitivityItems = useAppSelector(selectSensitivityItems);
  const sensitivityValues = useAppSelector(selectSensitivityValues);

  const handleImportanceItemChange = (
    key: string,
    field: string,
    value: string
  ) => {
    dispatch(updateImportanceItem({ key, field, value }));
  };

  const handlePolicyEdit = () => {
    setPolicyEditModalVisible(true);
  };

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
  const importanceColumns: ColumnsType<ImportanceItem> = [
    {
      title: "중요도",
      dataIndex: "중요도",
      key: "중요도",
      width: 120,
      render: (text: string) => (
        <div className="font-medium text-center py-2">{text}</div>
      ),
    },
    {
      title: "격리",
      dataIndex: "격리_임계치",
      key: "격리_임계치",
      width: 120,
      render: (text: string, record: ImportanceItem) => (
        <div className="text-center">
          {isEditing ? (
            <Input
              value={text}
              onChange={(e) =>
                handleImportanceItemChange(
                  record.key,
                  "격리_임계치",
                  e.target.value
                )
              }
              className="text-center w-20"
              size="small"
            />
          ) : (
            <span className="font-medium">{text}</span>
          )}
        </div>
      ),
    },
    {
      title: "보고",
      dataIndex: "보고_임계치",
      key: "보고_임계치",
      width: 120,
      render: (text: string, record: ImportanceItem) => (
        <div className="text-center">
          {isEditing ? (
            <Input
              value={text}
              onChange={(e) =>
                handleImportanceItemChange(
                  record.key,
                  "보고_임계치",
                  e.target.value
                )
              }
              className="text-center w-20"
              size="small"
            />
          ) : (
            <span className="font-medium">{text}</span>
          )}
        </div>
      ),
    },
  ];

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
          icon={<EditOutlined />}
          onClick={handlePolicyEdit}
          loading={loading}
          className="min-w-[120px]"
        >
          Policy edit
        </Button>
      </Space>
      <Table
        columns={importanceColumns}
        dataSource={importanceItems}
        loading={loading}
        pagination={false}
        rowKey="key"
        className="importance-table mb-6"
        size="middle"
        bordered
      />

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

      {selectedImportance.length > 0 && (
        <div className="mt-4 p-3 border rounded-lg">
          <div className="text-sm font-medium mb-1">
            선택된 중요도: {selectedImportance.join(", ")}
          </div>
          <div className="text-xs">선택된 중요도에 대한 정책이 적용됩니다</div>
        </div>
      )}

      <PolicyEditModal
        visible={policyEditModalVisible}
        onCancel={() => setPolicyEditModalVisible(false)}
        onConfirm={() => setPolicyEditModalVisible(false)}
      />
    </div>
  );
};

export default ImportanceTemplate;
