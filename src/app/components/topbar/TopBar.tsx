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

  const alertCount = useAppSelector(selectAlertCount);

  const topBarFeatures = getTopBarFeatures(userRole);

  useEffect(() => {
    dispatch(fetchLatestAlerts());
  }, [dispatch]);

  const handleAlarmClick = (event: React.MouseEvent) => {
    event.stopPropagation();

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

  return (
    <div
      className="top-bar h-19 px-6 flex items-center justify-between"
      style={{
        backgroundColor: "var(--color-grey-8)",
        borderBottom: `1px solid var(--color-border-100)`,
      }}
    >
      <div className="flex items-center space-x-4">
        {topBarFeatures.showAlarmNotifications && (
          <div className="relative">
            <button
              onClick={handleAlarmClick}
              className="relative p-1 transition-colors"
              style={{
                color: "var(--color-grey-40)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-grey-100)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-grey-40)";
              }}
              title={`${alertCount} alarm notifications`}
            >
              <i className="ri-alarm-warning-line text-lg" />
              {alertCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold"
                  style={{ backgroundColor: "var(--color-error-100)" }}
                >
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
            className="flex items-center space-x-2 px-3 py-1 text-white rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--color-error-100)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-error-110)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-error-100)";
            }}
            title={`${verificationCount} verification requests pending`}
          >
            <span>확인 필요 알림: {verificationCount}건</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-6">
        {topBarFeatures.showUserMenu && (
          <div
            className="flex items-center space-x-2 text-sm"
            style={{ color: "var(--color-grey-80)" }}
          >
            <span>
              {userInfo.role}/{userInfo.name}
            </span>
            <span style={{ color: "var(--color-grey-40)" }}>|</span>
            <span>{userInfo.department}</span>
            <span style={{ color: "var(--color-grey-40)" }}>|</span>
            <span>{userInfo.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
