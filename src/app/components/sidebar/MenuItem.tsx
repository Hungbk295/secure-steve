import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/libs/utils";
import { MenuItem as MenuItemType } from "@/utils/sidebar";
import MenuPopover from "./MenuPopover";

interface MenuItemProps {
  item: MenuItemType;
  isActive: boolean;
  isChildActive: boolean;
  isExpanded: boolean;
  isCollapsed?: boolean;
  onToggleExpand: (itemId: string) => void;
}

function MenuItem({
  item,
  isActive,
  isChildActive,
  isExpanded,
  isCollapsed = false,
  onToggleExpand,
}: MenuItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (item.children && item.children.length > 0) {
      onToggleExpand(item.id);
    } else {
      navigate(item.route);
    }
  };

  const handleChildClick = (childRoute: string) => {
    navigate(childRoute);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isCollapsed) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }

      const rect = event.currentTarget.getBoundingClientRect();
      setPopoverPosition({
        top: rect.top,
        left: rect.right + 8,
      });

      const timeout = setTimeout(() => {
        setShowPopover(true);
      }, 300);
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setShowPopover(false);
    }
  };

  return (
    <div className="security-menu-item relative">
      <div
        className={cn(
          "flex items-center px-8 py-2 cursor-pointer transition-colors duration-200 group",
          "hover:bg-gray-50",
          isActive && "text-blue-600 font-medium",
          isChildActive && "text-blue-600"
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {item.icon && (
          <div
            className={cn(
              "mr-3 flex-shrink-0",
              isActive || isChildActive ? "text-blue-600" : "text-gray-600"
            )}
          >
            {item.icon}
          </div>
        )}

        {!isCollapsed && <span className="flex-1 text-sm">{item.label}</span>}

        {isActive && (
          <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 flex-shrink-0" />
        )}

        {item.children && item.children.length > 0 && !isCollapsed && (
          <div
            className={cn(
              "ml-2 transition-transform duration-200",
              isExpanded && "rotate-90"
            )}
          >
            <i className="ri-arrow-right-s-line text-gray-400" />
          </div>
        )}
      </div>

      {item.children &&
        item.children.length > 0 &&
        isExpanded &&
        !isCollapsed && (
          <div className="ml-6 border-l border-gray-200">
            {item.children.map((child) => {
              const isChildItemActive = location.pathname === child.route;

              return (
                <div
                  key={child.id}
                  className={cn(
                    "flex items-center pl-4 pr-4 py-1.5 cursor-pointer transition-colors duration-200",
                    "hover:bg-gray-50",
                    isChildItemActive && "text-blue-600 font-medium bg-blue-50"
                  )}
                  onClick={() => handleChildClick(child.route)}
                >
                  <span className="text-sm flex-1">{child.label}</span>

                  {isChildItemActive && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}

      {/* Popover for collapsed state */}
      {showPopover && isCollapsed && (
        <div
          className="fixed z-50"
          style={{
            top: popoverPosition.top,
            left: popoverPosition.left,
          }}
          onMouseEnter={() => setShowPopover(true)}
          onMouseLeave={() => setShowPopover(false)}
        >
          <MenuPopover item={item} onClose={() => setShowPopover(false)} />
        </div>
      )}
    </div>
  );
}

export default MenuItem;
