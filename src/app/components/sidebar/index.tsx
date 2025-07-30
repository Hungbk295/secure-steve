import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/libs/utils";
import { getMenuItems, findActiveMenuItem } from "@/utils/sidebar";
import MenuItem from "./MenuItem";
import UserSection from "./UserSection";

function Sidebar() {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeMenuInfo, setActiveMenuInfo] = useState<{
    parentId?: string;
    childId?: string;
  }>({});

  const menuItems = getMenuItems();

  useEffect(() => {
    const activeInfo = findActiveMenuItem(location.pathname);
    setActiveMenuInfo(activeInfo);

    if (activeInfo.parentId && activeInfo.childId) {
      setExpandedMenus((prev) =>
        prev.includes(activeInfo.parentId!)
          ? prev
          : [...prev, activeInfo.parentId!]
      );
    }
  }, [location.pathname]);

  const handleToggleExpand = (itemId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);

    if (!isCollapsed) {
      setExpandedMenus([]);
    }
  };

  return (
    <div
      className={cn(
        "security-sidebar h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-[88px]" : "w-[220px]"
      )}
    >
      <div className="security-logo-section p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
              <i className="ri-shield-check-line text-white text-lg" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-sm font-semibold text-gray-900">
                  Security
                </h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            )}
          </div>

          <button
            onClick={handleToggleCollapse}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i
              className={cn(
                "text-gray-500 text-lg transition-transform duration-200",
                isCollapsed ? "ri-menu-unfold-line" : "ri-menu-fold-line"
              )}
            />
          </button>
        </div>
      </div>

      <div className="security-navigation flex-1 overflow-y-auto py-2">
        {menuItems.map((item) => {
          const isActive =
            activeMenuInfo.parentId === item.id && !activeMenuInfo.childId;
          const isChildActive =
            activeMenuInfo.parentId === item.id && !!activeMenuInfo.childId;
          const isExpanded = expandedMenus.includes(item.id);

          return (
            <MenuItem
              key={item.id}
              item={item}
              isActive={isActive}
              isChildActive={isChildActive}
              isExpanded={isExpanded}
              isCollapsed={isCollapsed}
              onToggleExpand={handleToggleExpand}
            />
          );
        })}
      </div>

      <UserSection />
    </div>
  );
}

export default Sidebar;
