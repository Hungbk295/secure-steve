import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/libs/utils";
import { MenuItem as MenuItemType } from "@/utils/sidebar";

interface MenuPopoverProps {
  item: MenuItemType;
  onClose: () => void;
}

function MenuPopover({ item, onClose }: MenuPopoverProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (route: string) => {
    navigate(route);
    onClose();
  };

  const handleParentClick = () => {
    if (!item.children || item.children.length === 0) {
      handleItemClick(item.route);
    }
  };

  if (!item.children || item.children.length === 0) {
    return (
      <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-md shadow-lg whitespace-nowrap">
        {item.label}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
      <div
        className={cn(
          "px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100 cursor-pointer hover:bg-gray-50",
          location.pathname === item.route && "text-blue-600 bg-blue-50"
        )}
        onClick={handleParentClick}
      >
        <div className="flex items-center">
          {item.icon && <div className="mr-3 flex-shrink-0">{item.icon}</div>}
          <span>{item.label}</span>
        </div>
      </div>

      <div className="py-1">
        {item.children.map((child) => {
          const isChildActive = location.pathname === child.route;

          return (
            <div
              key={child.id}
              className={cn(
                "px-4 py-2 text-sm cursor-pointer transition-colors duration-200 hover:bg-gray-50",
                isChildActive && "text-blue-600 bg-blue-50 font-medium"
              )}
              onClick={() => handleItemClick(child.route)}
            >
              <div className="flex items-center justify-between">
                <span>{child.label}</span>
                {isChildActive && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MenuPopover;
