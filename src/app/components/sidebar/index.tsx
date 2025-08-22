import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/libs/utils";
import { getMenuItems, findActiveMenuItem } from "@/utils/sidebar";
import MenuItem from "./MenuItem";
import UserSection from "./UserSection";
import useScreenWidth from "@/hooks/useScreenWidth";
import { useAppSelector } from "@/store";
import { selectUserRole } from "@/store/authSlide";

function Sidebar() {
  const location = useLocation();
  const userRole = useAppSelector(selectUserRole);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeMenuInfo, setActiveMenuInfo] = useState<{
    parentId?: string;
    childId?: string;
  }>({});
  const isScreenWidth = useScreenWidth();

  // Get menu items based on current user role - memoized to prevent infinite re-renders
  const menuItems = useMemo(() => getMenuItems(userRole), [userRole]);

  useEffect(() => {
    const activeInfo = findActiveMenuItem(location.pathname, menuItems);
    setActiveMenuInfo(activeInfo);

    if (activeInfo.parentId && activeInfo.childId) {
      setExpandedMenus((prev) =>
        prev.includes(activeInfo.parentId!)
          ? prev
          : [...prev, activeInfo.parentId!]
      );
    }
  }, [location.pathname, menuItems]);

  const handleToggleExpand = (itemId: string) => {
    setExpandedMenus((prev) => {
      if (prev.includes(itemId)) {
        // If clicking on already expanded item, just close it
        return prev.filter((id) => id !== itemId);
      } else {
        // If opening a new item, close all others and open this one
        // This implements the auto-collapse behavior like albus-fe
        return [itemId];
      }
    });
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);

    if (!isCollapsed) {
      setExpandedMenus([]);
    }
  };

  useEffect(() => {
    if (isScreenWidth.isTablet || isScreenWidth.isMobile) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [isScreenWidth.isTablet, isScreenWidth.isMobile]);

  return (
    <div
      className={cn(
        "security-sidebar h-screen bg-white flex flex-col transition-all duration-300 align-center",
        isCollapsed ? "w-[80px]" : "w-[256px]"
      )}
      style={{
        borderRight: `1px solid var(--color-border-100)`,
      }}
    >
      <div
        className={`security-logo-section ${isCollapsed ? "p-6.5" : "p-6"}`}
        style={{ borderBottom: `1px solid var(--color-border-100)` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center mr-3"
              style={{ backgroundColor: "var(--color-primary-100)" }}
            >
              <i className="ri-shield-check-line text-white text-lg" />
            </div>
            {!isCollapsed && (
              <div>
                <h1
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-grey-100)" }}
                >
                  Security
                </h1>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-grey-40)" }}
                >
                  Dashboard
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={` pt-2 ${
          isCollapsed ? "m-auto" : "ml-auto mr-4 float-right"
        }`}
      >
        <button
          onClick={handleToggleCollapse}
          className="p-1.5 rounded-md transition-colors duration-200"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-grey-5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i
            className={cn(
              "text-lg transition-transform duration-200",
              isCollapsed ? "ri-menu-unfold-line" : "ri-menu-fold-line"
            )}
            style={{ color: "var(--color-grey-40)" }}
          />
        </button>
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
