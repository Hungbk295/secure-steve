import { useEffect } from "react";
import { Row, Col, Button, Form } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import { DynamicKeyObject } from "@/interfaces/app";
import CustomDatePicker from "../common/CustomDatePicker";
import { useAppDispatch } from "@/store";
import { actionGetDetectionList } from "@/store/detectionSlice";

interface DetectionFilterBarProps {
  loading?: boolean;
  className?: string;
}

const initialFormData = {
  dateRange: null,
  riskLevel: "all",
  triageVerdict: "all",
  processStatus: "all",
  serverIP: "all",
  fileNameOrHash: "",
};

function DetectionFilterBar({ loading = false }: DetectionFilterBarProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  function getPayload(values: DynamicKeyObject) {
    const {
      dateRange,
      riskLevel,
      triageVerdict,
      processStatus,
      serverIP,
      fileNameOrHash,
    } = values;

    const payload = {
      timeRange:
        dateRange && dateRange.length === 2
          ? [
              dateRange[0].format("YYYY-MM-DD"),
              dateRange[1].format("YYYY-MM-DD"),
            ]
          : null,
      risk: riskLevel === "all" ? [] : [riskLevel],
      verdict: triageVerdict === "all" ? [] : [triageVerdict],
      processStatus: processStatus === "all" ? [] : [processStatus],
      serverIP: serverIP === "all" ? "" : serverIP,
      fileNameOrHash: fileNameOrHash || "",
    };
    return payload;
  }

  function onFinish(values: DynamicKeyObject) {
    const payload = getPayload(values);
    dispatch(actionGetDetectionList(payload));
  }

  function onReset() {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    dispatch(actionGetDetectionList(payload));
  }

  useEffect(() => {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    dispatch(actionGetDetectionList(payload));
  }, []);

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

  const processStatusOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "No Action", value: "no_action" },
    { label: "Quarantine", value: "quarantine" },
    { label: "Delete", value: "delete" },
  ];

  const serverIPOptions = [
    { label: "All", value: "all" },
    { label: "192.168.1.100", value: "192.168.1.100" },
    { label: "192.168.1.101", value: "192.168.1.101" },
    { label: "10.0.0.50", value: "10.0.0.50" },
    { label: "10.0.0.51", value: "10.0.0.51" },
  ];

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8} lg={4}>
          <Form.Item label="Time Range" name="dateRange">
            <CustomDatePicker
              form={form}
              name="dateRange"
              showQuickPicker={false}
              placeholder={["Start Time", "End Time"]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label="Risk" name="riskLevel">
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

        <Col xs={24} sm={12} md={6} lg={4}>
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

        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label="Process Status" name="processStatus">
            <Select
              placeholder="Process Status"
              showSearch
              options={processStatusOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6} lg={4}>
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

        <Col xs={24} sm={24} md={8} lg={4}>
          <div className="filter-actions flex justify-end space-x-2">
            <Button
              className="!h-[45px] !w-12"
              type="default"
              icon={<ReloadOutlined />}
              onClick={onReset}
              disabled={loading}
            />
            <Button
              className="!h-[45px]"
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

export default DetectionFilterBar;
