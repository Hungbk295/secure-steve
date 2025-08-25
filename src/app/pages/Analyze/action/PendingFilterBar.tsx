import { useEffect } from "react";
import { Row, Col, Button, Form } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import { DynamicKeyObject } from "@/interfaces/app";
import { useAppDispatch } from "@/store";
import { actionGetPendingList } from "@/store/actionSlice";

interface PendingFilterBarProps {
  loading?: boolean;
  className?: string;
}

const initialFormData = {
  risk: "all",
  triageVerdict: "all",
  serverIP: "all",
};

function PendingFilterBar({
  loading = false,
  className,
}: PendingFilterBarProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  function getPayload(values: DynamicKeyObject) {
    const { risk, triageVerdict, serverIP } = values;

    const payload = {
      risk: risk === "all" ? [] : [risk],
      verdict: triageVerdict === "all" ? [] : [triageVerdict],
      serverIP: serverIP === "all" ? "" : serverIP,
    };
    return payload;
  }

  function onFinish(values: DynamicKeyObject) {
    const payload = getPayload(values);
    dispatch(actionGetPendingList(payload));
  }

  function onReset() {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    dispatch(actionGetPendingList(payload));
  }

  useEffect(() => {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    dispatch(actionGetPendingList(payload));
  }, [dispatch]);

  const riskLevelOptions = [
    { label: "All", value: "all" },
    { label: "High (80-100%)", value: "high" },
    { label: "Medium (50-79%)", value: "medium" },
    { label: "Low (0-49%)", value: "low" },
  ];

  const triageVerdictOptions = [
    { label: "All", value: "all" },
    { label: "Malware", value: "malware" },
    { label: "Benign", value: "benign" },
    { label: "Suspicious", value: "suspicious" },
    { label: "Unknown", value: "unknown" },
  ];

  const serverIPOptions = [
    { label: "All", value: "all" },
    { label: "66.211.75.1", value: "66.211.75.1" },
    { label: "66.211.75.2", value: "66.211.75.2" },
    { label: "192.168.1.100", value: "192.168.1.100" },
    { label: "192.168.1.101", value: "192.168.1.101" },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className={className}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Risk" name="risk">
            <Select
              placeholder="Risk Level"
              showSearch
              options={riskLevelOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Triage Verdict" name="triageVerdict">
            <Select
              placeholder="Triage Verdict"
              showSearch
              options={triageVerdictOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Server IP" name="serverIP">
            <Select
              placeholder="Server IP"
              showSearch
              options={serverIPOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={6} lg={12}>
          <div className="filter-actions flex justify-end space-x-2 flex-1">
            <Button
              className="!h-[45px] !w-12"
              type="default"
              icon={<ReloadOutlined />}
              onClick={onReset}
              disabled={loading}
            />
            <Button
              className="!h-[45px] !w-[240px]"
              type="primary"
              icon={<SearchOutlined />}
              htmlType="submit"
              loading={loading}
            >
              Apply
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default PendingFilterBar;
