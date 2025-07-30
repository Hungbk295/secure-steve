import { useState, useEffect } from "react";
import {
  UserRole,
  getTopBarFeatures,
  CURRENT_USER_ROLE,
} from "@/constants/roleConfig";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchLatestAlerts, selectAlertCount } from "@/store/alertsSlice";
import LatestAlertsAntd from "./LatestAlertsAntd";

interface TopBarProps {
  verificationCount?: number;
  userInfo?: {
    name: string;
    role: string;
    department: string;
  };
  userRole?: UserRole;
  onAlarmClick?: () => void;
  onVerificationClick?: () => void;
}

function TopBar({
  verificationCount = 0,
  userInfo = {
    name: "Administrator",
    role: "Administrator",
    department: "IT Security",
  },
  userRole = CURRENT_USER_ROLE,
  onAlarmClick,
  onVerificationClick,
}: TopBarProps) {
  const dispatch = useAppDispatch();
  const [showAlarmDropdown, setShowAlarmDropdown] = useState(false);

  // Get alert count from Redux store
  const alertCount = useAppSelector(selectAlertCount);

  const topBarFeatures = getTopBarFeatures(userRole);

  // Fetch alerts on component mount
  useEffect(() => {
    dispatch(fetchLatestAlerts());
  }, [dispatch]);

  const handleAlarmClick = (event: React.MouseEvent) => {
    // Prevent event bubbling to avoid conflicts
    event.stopPropagation();

    if (onAlarmClick) {
      onAlarmClick();
    } else {
      // Toggle dropdown state
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

  return (
    <div className="top-bar h-18 bg-gray-100 border-b border-gray-300 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {topBarFeatures.showAlarmNotifications && (
          <div className="relative">
            <button
              onClick={handleAlarmClick}
              className="relative p-1 text-gray-600 hover:text-gray-900 transition-colors"
              title={`${alertCount} alarm notifications`}
            >
              <i className="ri-alarm-warning-line text-lg" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                  {alertCount > topBarFeatures.maxAlarmCount
                    ? `${topBarFeatures.maxAlarmCount}+`
                    : alertCount}
                </span>
              )}
            </button>

            {showAlarmDropdown && (
              <LatestAlertsAntd
                onClose={() => setShowAlarmDropdown(false)}
                alertCount={alertCount}
              />
            )}
          </div>
        )}
        {topBarFeatures.showVerificationCounter && verificationCount > 0 && (
          <button
            onClick={handleVerificationClick}
            className="flex items-center space-x-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
            title={`${verificationCount} verification requests pending`}
          >
            <span>확인 필요 알림: {verificationCount}건</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-6">
        {topBarFeatures.showUserMenu && (
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span>
              {userInfo.role}/{userInfo.name}
            </span>
            <span className="text-gray-500">|</span>
            <span>{userInfo.department}</span>
            <span className="text-gray-500">|</span>
            <span>{userInfo.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
