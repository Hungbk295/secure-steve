import { Tabs } from "antd";
import type { TabsProps } from "antd";

interface TabNavigationProps {
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

function TabNavigation({ activeKey, onChange, className }: TabNavigationProps) {
  const tabItems: TabsProps["items"] = [
    {
      key: "server-assignment",
      label: "관리 서버 할당",
    },
    {
      key: "server-settings",
      label: "관리 서버 설정",
    },
    {
      key: "quarantine-folder",
      label: "격리 폴더 설정",
    },
  ];

  return (
    <Tabs
      activeKey={activeKey}
      onChange={onChange}
      items={tabItems}
      className={className}
      size="large"
      type="line"
    />
  );
}

export default TabNavigation;
