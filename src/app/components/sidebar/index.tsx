import { useEffect, useState } from "react";
import { Avatar, Menu, Layout, Popover } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import LogoAlbusWithText from "@/assets/svgs/albus-logo-txt-black.svg";
import LogoAlbus from "@/assets/svgs/albus-logo.svg";
import { cn } from "@/libs/utils";
import { getSideBarListByAction } from "@/utils/sidebar";
import { DynamicKeyObject } from "@/interfaces/app";
import { getSelectedKeySidebar } from "@/utils/app";
import PopUser from "@/app/components/sidebar/PopUser";
import { actionUpdateNavCollapsed } from "@/store/appSlide";
import { useAppDispatch, useAppSelector } from "@/store";
import URL from "@/constants/url";
import { selectPersonalInfo } from "@/store/personalSlice";
const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

function Sidebar(props: SidebarProps) {
  const { collapsed } = props;
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<DynamicKeyObject>({
    parentKey: "",
    childKey: "",
  });
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const personalInfo = useAppSelector(selectPersonalInfo);

  function toggleCollapsed() {
    dispatch(actionUpdateNavCollapsed(!collapsed));
  }

  function onClickMenuItem(item: DynamicKeyObject) {
    const { key } = item;
    navigate(key);
  }

  useEffect(() => {
    if (!location.pathname) return;

    const pathName = location.pathname;
    const { parentKey = "", childKey = "" } = getSelectedKeySidebar(pathName);
    setActiveKey({ parentKey, childKey });
  }, [location.pathname]);

  return (
    <Sider
      collapsible
      theme="light"
      collapsed={collapsed}
      width={256}
      trigger={null}
      className={cn(
        "border-r border-border-100 max-h-screen overflow-y-auto flex flex-col !sticky top-0 left-0 hidden-scrollbar",
        collapsed ? "sidebar-collapsed" : "sidebar-expanded"
      )}
    >
      <div
        className={cn(
          "flex pt-10 pb-2 flex-col gap-4",
          collapsed ? "items-center" : "px-8"
        )}
      >
        {collapsed ? <LogoAlbus /> : <LogoAlbusWithText />}
        <div className="text-end">
          <i
            className={cn(
              "ri-arrow-drop-left-line text-2xl bg-grey-5 text-grey-40 rounded-full cursor-pointer",
              collapsed ? "ri-arrow-drop-right-line" : ""
            )}
            onClick={toggleCollapsed}
          />
        </div>
      </div>
      <Menu
        key={`${activeKey.parentKey}-${activeKey.childKey}`}
        defaultSelectedKeys={[activeKey.childKey]}
        defaultOpenKeys={[activeKey.parentKey]}
        mode="inline"
        items={getSideBarListByAction(collapsed, activeKey.parentKey)}
        onClick={onClickMenuItem}
      />
      <div
        className={cn(
          "flex-1 flex items-end pt-6 pb-10",
          collapsed ? "" : "px-8"
        )}
      >
        <div
          className="w-full"
          onMouseEnter={() => setIsOpenPopover(true)}
          onMouseLeave={() => setIsOpenPopover(false)}
        >
          <Popover
            arrow={false}
            placement="rightBottom"
            rootClassName="custom-popover-content"
            content={<PopUser onClose={() => setIsOpenPopover(false)} />}
            open={isOpenPopover}
          >
            <div
              className={cn(
                "flex items-center gap-2 px-2 py-2 hover:bg-primary-5 cursor-pointer rounded-[8px] w-fit",
                collapsed ? "justify-center" : "",
                location.pathname.includes(URL.PersonalSettings) &&
                  "bg-primary-5"
              )}
            >
              <div className="w-10">
                <Avatar size={40}>USER</Avatar>
              </div>
              {!collapsed && (
                <div className="!w-[145px]">
                  <p className="text-grey-80 font-medium text-sm">
                  {personalInfo.firstName ?? "User"} {personalInfo.lastName ?? "Name"}
                  </p>
                  <p className="text-grey-40 text-xs break-all">
                    {personalInfo.username}
                  </p>
                </div>
              )}
            </div>
          </Popover>
        </div>
      </div>
    </Sider>
  );
}

export default Sidebar;
