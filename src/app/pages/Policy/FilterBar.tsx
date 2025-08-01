import { Row, Col, Select, Button, Space } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";

interface FilterBarProps {
  clusterName: string;
  serverManager: string;
  clusterOptions: Array<{ label: string; value: string }>;
  managerOptions: Array<{ label: string; value: string }>;
  onClusterChange: (value: string) => void;
  onManagerChange: (value: string) => void;
  onReset: () => void;
  onApply: () => void;
  loading?: boolean;
  className?: string;
}

function FilterBar({
  clusterName,
  serverManager,
  clusterOptions,
  managerOptions,
  onClusterChange,
  onManagerChange,
  onReset,
  onApply,
  loading = false,
  className,
}: FilterBarProps) {
  return (
    <div
      className={`filter-bar p-4 rounded-lg mb-4 ${className || ""}`}
      style={{ backgroundColor: "var(--color-grey-5)" }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8} lg={6}>
          <div className="filter-item">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-grey-80)" }}
              id="cluster-label"
            >
              Cluster Name
            </label>
            <Select
              value={clusterName}
              onChange={onClusterChange}
              placeholder="Select cluster"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[{ label: "All", value: "all" }, ...clusterOptions]}
              className="w-full"
              size="middle"
              aria-labelledby="cluster-label"
              disabled={loading}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <div className="filter-item">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-grey-80)" }}
              id="manager-label"
            >
              Server Manager
            </label>
            <Select
              value={serverManager}
              onChange={onManagerChange}
              placeholder="Select manager"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[{ label: "All", value: "all" }, ...managerOptions]}
              className="w-full"
              size="middle"
              aria-labelledby="manager-label"
              disabled={loading}
            />
          </div>
        </Col>

        <Col xs={24} sm={24} md={8} lg={12}>
          <div className="filter-actions flex justify-end">
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={onReset}
                disabled={loading}
                size="middle"
              >
                Reset
              </Button>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={onApply}
                loading={loading}
                size="middle"
              >
                Apply
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default FilterBar;
