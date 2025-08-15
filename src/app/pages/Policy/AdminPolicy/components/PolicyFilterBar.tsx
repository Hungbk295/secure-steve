import { useEffect } from "react";
import { Row, Col, Button, Form } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import { DynamicKeyObject } from "@/interfaces/app";

interface PolicyFilterBarProps {
  loading?: boolean;
  className?: string;
  onFilterChange?: (filters: DynamicKeyObject) => void;
}

const initialFormData = {
  cluster_name: "all",
  server_manager: "all",
};

function PolicyFilterBar({
  loading = false,
  className,
  onFilterChange,
}: PolicyFilterBarProps) {
  const [form] = Form.useForm();

  function getPayload(values: DynamicKeyObject) {
    const { cluster_name, server_manager } = values;

    const payload = {
      cluster_name: cluster_name === "all" ? "" : cluster_name,
      server_manager: server_manager === "all" ? "" : server_manager,
    };
    return payload;
  }

  function onFinish(values: DynamicKeyObject) {
    const payload = getPayload(values);
    console.log("Policy Filter:", payload);
    onFilterChange?.(payload);
  }

  function onReset() {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    console.log("Reset Policy Filter:", payload);
    onFilterChange?.(payload);
  }

  useEffect(() => {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    console.log("Initialize Policy Filter:", payload);
    onFilterChange?.(payload);
  }, []);

  // Mock data for cluster names (user-entered values)
  const clusterNameOptions = [
    { label: "All", value: "all" },
    { label: "Production-Cluster-A", value: "Production-Cluster-A" },
    { label: "Development-Cluster-B", value: "Development-Cluster-B" },
    { label: "Testing-Cluster-C", value: "Testing-Cluster-C" },
    { label: "Security-Cluster-D", value: "Security-Cluster-D" },
  ];

  // Mock data for server managers (User Name|Department format)
  const serverManagerOptions = [
    { label: "All", value: "all" },
    { label: "김철수|개발팀", value: "김철수|개발팀" },
    { label: "이영희|보안팀", value: "이영희|보안팀" },
    { label: "박민수|운영팀", value: "박민수|운영팀" },
    { label: "최지연|인프라팀", value: "최지연|인프라팀" },
    { label: "정한솔|데이터팀", value: "정한솔|데이터팀" },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className={className}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Cluster Name" name="cluster_name">
            <Select
              placeholder="Select Cluster"
              showSearch
              options={clusterNameOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Server Manager" name="server_manager">
            <Select
              placeholder="Select Manager"
              showSearch
              options={serverManagerOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={12}>
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
              Apply Filter
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default PolicyFilterBar;