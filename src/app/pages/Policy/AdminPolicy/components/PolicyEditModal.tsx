import React, { useState, useEffect } from "react";
import { Modal, Checkbox, Table, Input, Button, Alert } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectImportanceItems,
  selectSelectedImportance,
  selectCategoryItems,
  selectAdminPolicyLoading,
  selectAdminPolicyError,
  toggleImportanceSelection,
  updateCategoryItem,
  addCategoryItem,
  actionSaveImportanceTemplate,
  clearError,
} from "@/store/adminPolicySlice";

interface CategoryItem {
  key: string;
  구분: string;
  확도_가이드: string;
  사용자_입력: string;
}

interface PolicyEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const PolicyEditModal: React.FC<PolicyEditModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  const dispatch = useAppDispatch();
  const importanceItems = useAppSelector(selectImportanceItems);
  const selectedImportance = useAppSelector(selectSelectedImportance);
  const categoryItems = useAppSelector(selectCategoryItems);
  const loading = useAppSelector(selectAdminPolicyLoading);
  const error = useAppSelector(selectAdminPolicyError);

  const [localCategoryItems, setLocalCategoryItems] = useState<CategoryItem[]>(
    []
  );

  useEffect(() => {
    if (visible) {
      setLocalCategoryItems([...categoryItems]);
      dispatch(clearError());
    }
  }, [visible, categoryItems, dispatch]);

  const handleImportanceToggle = (importance: string) => {
    dispatch(toggleImportanceSelection(importance));
  };

  const handleCategoryItemChange = (
    key: string,
    field: string,
    value: string
  ) => {
    const updatedItems = localCategoryItems.map((item) =>
      item.key === key ? { ...item, [field]: value } : item
    );
    setLocalCategoryItems(updatedItems);
  };

  const handleAddCategory = () => {
    const newItem: CategoryItem = {
      key: String(localCategoryItems.length + 1),
      구분: `새 항목 ${localCategoryItems.length + 1}`,
      확도_가이드: "기준 이상 입력",
      사용자_입력: "(default: 기준 rate)",
    };
    setLocalCategoryItems([...localCategoryItems, newItem]);
  };

  const handleSave = async () => {
    try {
      // Save category items to Redux store
      localCategoryItems.forEach((item) => {
        dispatch(
          updateCategoryItem({
            key: item.key,
            field: "구분",
            value: item.구분,
          })
        );
        dispatch(
          updateCategoryItem({
            key: item.key,
            field: "확도_가이드",
            value: item.확도_가이드,
          })
        );
        dispatch(
          updateCategoryItem({
            key: item.key,
            field: "사용자_입력",
            value: item.사용자_입력,
          })
        );
      });

      // Add new category items if any
      if (localCategoryItems.length > categoryItems.length) {
        const newItems = localCategoryItems.slice(categoryItems.length);
        newItems.forEach((item) => {
          dispatch(addCategoryItem({ 구분: item.구분 }));
        });
      }

      // Save importance template
      const result = await dispatch(
        actionSaveImportanceTemplate({
          importanceItems,
          selectedImportance,
        })
      );

      if (actionSaveImportanceTemplate.fulfilled.match(result)) {
        onConfirm();
      }
    } catch (error) {
      console.error("Failed to save importance template:", error);
    }
  };

  const handleCancel = () => {
    setLocalCategoryItems([...categoryItems]);
    dispatch(clearError());
    onCancel();
  };

  const categoryColumns: ColumnsType<CategoryItem> = [
    {
      title: "구분",
      dataIndex: "구분",
      key: "구분",
      width: 150,
      render: (text: string, record: CategoryItem) => (
        <Input
          value={text}
          onChange={(e) =>
            handleCategoryItemChange(record.key, "구분", e.target.value)
          }
          size="small"
          placeholder="항목명을 입력하세요"
        />
      ),
    },
    {
      title: "확도 가이드",
      dataIndex: "확도_가이드",
      key: "확도_가이드",
      width: 150,
      render: (text: string, record: CategoryItem) => (
        <Input
          value={text}
          onChange={(e) =>
            handleCategoryItemChange(record.key, "확도_가이드", e.target.value)
          }
          size="small"
          placeholder="가이드를 입력하세요"
        />
      ),
    },
    {
      title: "사용자 입력",
      dataIndex: "사용자_입력",
      key: "사용자_입력",
      render: (text: string, record: CategoryItem) => (
        <Input
          value={text}
          onChange={(e) =>
            handleCategoryItemChange(record.key, "사용자_입력", e.target.value)
          }
          size="small"
          placeholder="기본값을 입력하세요"
        />
      ),
    },
  ];

  return (
    <Modal
      title={<div className="text-lg font-semibold">Policy Edit</div>}
      open={visible}
      onCancel={handleCancel}
      width={900}
      centered
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          취소
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSave}
          loading={loading}
        >
          저장
        </Button>,
      ]}
      destroyOnClose
      className="policy-edit-modal"
    >
      <div className="py-4 space-y-6">
        {error && (
          <Alert
            message="오류 발생"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => dispatch(clearError())}
            className="mb-4"
          />
        )}

        {/* Importance Selection Section */}
        <div className="border rounded-lg p-4">
          <h3 className="text-base font-semibold mb-3">중요도 선택</h3>
          <div className="grid grid-cols-2 gap-3">
            {importanceItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center p-2 border rounded"
              >
                <Checkbox
                  checked={selectedImportance.includes(item.중요도)}
                  onChange={() => handleImportanceToggle(item.중요도)}
                  disabled={loading}
                >
                  <span className="ml-2 font-medium">{item.중요도}</span>
                </Checkbox>
                <div className="ml-auto text-xs space-x-2">
                  <span>격리: {item.격리_임계치}</span>
                  <span>보고: {item.보고_임계치}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedImportance.length > 0 && (
            <div className="mt-3 p-2 border rounded">
              <div className="text-sm font-medium">
                선택된 중요도: {selectedImportance.join(", ")}
              </div>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <Button
              icon={<PlusOutlined />}
              onClick={handleAddCategory}
              disabled={loading}
              size="small"
            >
              항목 추가
            </Button>
          </div>

          <Table
            columns={categoryColumns}
            dataSource={localCategoryItems}
            loading={loading}
            pagination={false}
            rowKey="key"
            size="small"
            bordered
            className="template-config-table"
            scroll={{ y: 300 }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default PolicyEditModal;
