import React, { useEffect } from "react";
import { Modal, Form, Select, Input, Button, Alert } from "antd";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectSelectedApi,
  selectApiDescription,
  selectAdminPolicyLoading,
  selectAdminPolicyError,
  setSelectedApi,
  actionAddPolicy,
  clearError,
} from "@/store/adminPolicySlice";

const { TextArea } = Input;
const { Option } = Select;

interface PolicyAddModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const PolicyAddModal: React.FC<PolicyAddModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const selectedApi = useAppSelector(selectSelectedApi);
  const apiDescription = useAppSelector(selectApiDescription);
  const loading = useAppSelector(selectAdminPolicyLoading);
  const error = useAppSelector(selectAdminPolicyError);

  const apiOptions = [
    { value: "malware-detection-v1", label: "Malware Detection API v1.0" },
    { value: "threat-analysis-v2", label: "Threat Analysis API v2.0" },
    { value: "quarantine-management", label: "Quarantine Management API" },
    { value: "reporting-service", label: "Reporting Service API" },
    { value: "policy-engine-v3", label: "Policy Engine API v3.0" },
  ];

  useEffect(() => {
    if (visible) {
      form.resetFields();
      dispatch(clearError());
    }
  }, [visible, form, dispatch]);

  const handleApiChange = (value: string) => {
    dispatch(setSelectedApi(value));
    form.setFieldsValue({ api_description: apiDescription });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const result = await dispatch(
        actionAddPolicy({
          selectedApi: values.api_selection,
          description: values.api_description,
        })
      );

      if (actionAddPolicy.fulfilled.match(result)) {
        onConfirm();
        form.resetFields();
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    dispatch(setSelectedApi(""));
    dispatch(clearError());
    onCancel();
  };

  return (
    <Modal
      title={<div className="text-lg font-semibold">Policy Add - API 선택</div>}
      open={visible}
      onCancel={handleCancel}
      width={600}
      centered
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          취소
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={!selectedApi}
        >
          완료
        </Button>,
      ]}
      destroyOnClose
      className="policy-add-modal"
    >
      <div className="py-4">
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

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            api_selection: selectedApi,
            api_description: apiDescription,
          }}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-sm font-medium">API 선택 *</span>}
            name="api_selection"
            rules={[
              {
                required: true,
                message: "API를 선택해주세요",
              },
            ]}
          >
            <Select
              placeholder="사용할 API를 선택하세요"
              onChange={handleApiChange}
              size="large"
              showSearch
            >
              {apiOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={<span className="text-sm font-medium">API 설명</span>}
            name="api_description"
          >
            <TextArea
              rows={6}
              placeholder={
                selectedApi
                  ? apiDescription
                  : "API를 선택하면 설명이 표시됩니다"
              }
              disabled={!selectedApi}
              className="resize-none"
            />
          </Form.Item>{" "}
        </Form>
      </div>
    </Modal>
  );
};

export default PolicyAddModal;
