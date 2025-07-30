import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import {
  UserRole,
  getTopBarFeatures,
  CURRENT_USER_ROLE,
} from "@/constants/roleConfig";
import AlarmNotifications from "./AlarmNotifications";
import ServerStatus from "./ServerStatus";
import UserMenu from "./UserMenu";
import VerificationCounter from "./VerificationCounter";

interface TopBarProps {
  screenTitle: string;
  alarmCount?: number;
  verificationCount?: number;
  userInfo?: {
    name: string;
    role: string;
    department: string;
  };
  serverStatus?: "normal" | "abnormal";
  userRole?: UserRole;
  onLogoClick?: () => void;
  onAlarmClick?: () => void;
  onVerificationClick?: () => void;
  onUserMenuClick?: () => void;
}

function TopBar({
  screenTitle,
  alarmCount = 0,
  verificationCount = 0,
  userInfo = {
    name: "Administrator",
    role: "Administrator",
    department: "IT Security",
  },
  serverStatus = "normal",
  userRole = CURRENT_USER_ROLE,
  // onLogoClick,
  onAlarmClick,
  onVerificationClick,
  onUserMenuClick,
}: TopBarProps) {
  // const navigate = useNavigate();
  const [showAlarmDropdown, setShowAlarmDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const topBarFeatures = getTopBarFeatures(userRole);

  // const handleLogoClick = () => {
  //   if (onLogoClick) {
  //     onLogoClick();
  //   } else {
  //     navigate("/");
  //   }
  // };

  const handleAlarmClick = () => {
    if (onAlarmClick) {
      onAlarmClick();
    } else {
      setShowAlarmDropdown(!showAlarmDropdown);
    }
  };

  const handleVerificationClick = () => {
    if (onVerificationClick) {
      onVerificationClick();
    } else {
      console.log("Navigate to verification page");
    }
  };

  const handleUserMenuClick = () => {
    if (onUserMenuClick) {
      onUserMenuClick();
    } else {
      setShowUserMenu(!showUserMenu);
    }
  };

  return (
    <div className="top-bar h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex-1 flex justify-center">
          <div className="max-w-md">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {screenTitle}
            </h1>
          </div>
        </div>

        {topBarFeatures.showAlarmNotifications && (
          <div className="relative">
            <button
              onClick={handleAlarmClick}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title={`${alarmCount} alarm notifications`}
            >
              <i className="ri-alarm-warning-line text-xl" />
              {alarmCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {alarmCount > topBarFeatures.maxAlarmCount
                    ? `${topBarFeatures.maxAlarmCount}+`
                    : alarmCount}
                </span>
              )}
            </button>

            {showAlarmDropdown && (
              <AlarmNotifications
                onClose={() => setShowAlarmDropdown(false)}
                alarmCount={alarmCount}
              />
            )}
          </div>
        )}

        {topBarFeatures.showVerificationCounter && (
          <VerificationCounter
            count={verificationCount}
            onClick={handleVerificationClick}
          />
        )}
      </div>

      <div className="flex items-center space-x-4">
        {topBarFeatures.showServerStatus && (
          <ServerStatus status={serverStatus} />
        )}

        {topBarFeatures.showUserMenu && (
          <div className="relative">
            <button
              onClick={handleUserMenuClick}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="User menu"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {userInfo.role} / {userInfo.name}
                </div>
                <div className="text-xs text-gray-500">
                  {userInfo.department}
                </div>
              </div>

              <i className="ri-arrow-down-s-line text-gray-400" />
            </button>

            {showUserMenu && (
              <UserMenu
                userInfo={userInfo}
                onClose={() => setShowUserMenu(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
