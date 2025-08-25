import React, { useState } from "react";
import { Table, Radio, Checkbox, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RadioChangeEvent } from "antd";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectOperationItems,
  updateOperationSelection,
} from "@/store/adminPolicySlice";

interface OperationItem {
  key: string;
  구분: string;
  기본값: string;
  옵션?: string[];
  체크박스?: string[];
  selected_option?: string;
  selected_checkboxes?: string[];
}

interface OperationPolicyProps {
  loading: boolean;
}

const OperationPolicy: React.FC<OperationPolicyProps> = ({ loading }) => {
  const dispatch = useAppDispatch();
  const operationItems = useAppSelector(selectOperationItems);
  const [isEditing] = useState(false);

  const handleRadioChange = (key: string, value: string) => {
    dispatch(updateOperationSelection({ key, type: "option", value }));
  };

  const handleCheckboxChange = (key: string, checkedValues: any) => {
    const item = operationItems.find((item) => item.key === key);
    if (item?.selected_checkboxes) {
      item.selected_checkboxes.forEach((value) => {
        dispatch(updateOperationSelection({ key, type: "checkbox", value }));
      });
    }

    checkedValues.forEach((value: any) => {
      dispatch(
        updateOperationSelection({
          key,
          type: "checkbox",
          value: value as string,
        })
      );
    });
  };

  const columns: ColumnsType<OperationItem> = [
    {
      title: "구분",
      dataIndex: "구분",
      key: "구분",
      width: 200,
      render: (text: string) => <div className="font-medium">{text}</div>,
    },
    {
      title: "민감도 정책",
      key: "policy",
      render: (_, record: OperationItem) => {
        if (record.옵션) {
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">기본값:</span>
                <Tag>{record.기본값}</Tag>
              </div>
              {isEditing ? (
                <Radio.Group
                  value={
                    record.selected_option || record.기본값.replace(" ", "")
                  }
                  onChange={(e: RadioChangeEvent) =>
                    handleRadioChange(record.key, e.target.value)
                  }
                  disabled={loading}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {record.옵션.map((option) => (
                      <Radio key={option} value={option} className="text-sm">
                        {option}
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {record.옵션.map((option) => (
                    <Tag key={option}>{option}</Tag>
                  ))}
                </div>
              )}
            </div>
          );
        }

        if (record.체크박스) {
          return (
            <div className="space-y-2">
              <div className="text-sm mb-2">선택 가능한 항목:</div>
              {isEditing ? (
                <Checkbox.Group
                  value={record.selected_checkboxes || []}
                  onChange={(checkedValues) =>
                    handleCheckboxChange(record.key, checkedValues)
                  }
                  disabled={loading}
                  className="w-full"
                >
                  <div className="space-y-2">
                    {record.체크박스.map((option) => (
                      <div key={option} className="flex items-start">
                        <Checkbox
                          value={option}
                          className="text-sm leading-relaxed"
                        >
                          {option}
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </Checkbox.Group>
              ) : (
                <div className="space-y-1">
                  {record.체크박스.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <Tag>{option}</Tag>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return <div>-</div>;
      },
    },
  ];

  const getSelectionSummary = () => {
    const summary: string[] = [];

    operationItems.forEach((item) => {
      if (
        item.selected_option &&
        item.selected_option !== item.기본값.replace(" ", "")
      ) {
        summary.push(`${item.구분}: ${item.selected_option}`);
      }
      if (item.selected_checkboxes && item.selected_checkboxes.length > 0) {
        summary.push(`${item.구분}: ${item.selected_checkboxes.length}개 선택`);
      }
    });

    return summary;
  };

  const selectionSummary = getSelectionSummary();

  return (
    <div className="flex flex-col gap-4">
      <Table
        columns={columns}
        dataSource={operationItems}
        loading={loading}
        pagination={false}
        rowKey="key"
        className="operation-table"
        size="middle"
        bordered
      />

      {selectionSummary.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg">
          <div className="text-sm font-medium mb-2">현재 설정 요약</div>
          <div className="space-y-1">
            {selectionSummary.map((summary, index) => (
              <div key={index} className="text-sm">
                • {summary}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationPolicy;
