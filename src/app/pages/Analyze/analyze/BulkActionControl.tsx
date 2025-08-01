import { Button, Dropdown, Space, Typography } from "antd";
import { DownOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

interface BulkActionControlProps {
  selectedCount: number;
  onActionSelect: (action: "cluster" | "manager") => void;
  visible?: boolean;
  className?: string;
}

function BulkActionControl({
  selectedCount,
  onActionSelect,
  visible = true,
  className,
}: BulkActionControlProps) {
  if (!visible || selectedCount === 0) {
    return null;
  }

  const actionMenuItems: MenuProps["items"] = [
    {
      key: "cluster",
      label: "(1) ServerCluster",
      icon: <SettingOutlined />,
      onClick: () => onActionSelect("cluster"),
    },
    {
      key: "manager",
      label: "(2) Person in charge",
      icon: <UserOutlined />,
      onClick: () => onActionSelect("manager"),
    },
  ];

  return (
    <div
      className={`bulk-action-control bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Typography.Text strong className="text-blue-700">
            {selectedCount} server{selectedCount > 1 ? "s" : ""} selected
          </Typography.Text>
        </div>

        <Space>
          <Dropdown
            menu={{ items: actionMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button type="primary" icon={<DownOutlined />}>
              Bulk Actions
            </Button>
          </Dropdown>
        </Space>
      </div>
    </div>
  );
}

export default BulkActionControl;
