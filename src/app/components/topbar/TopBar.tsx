import { useState, useEffect, useCallback, useRef } from "react";
import {
  UserRole,
  getTopBarFeatures,
  CURRENT_USER_ROLE,
} from "@/constants/roleConfig";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  actionFetchLatestAlerts,
  selectAlertsState,
  actionUpdateAlertAction,
  clearError,
} from "@/store/alertsSlice";
import { EAlertProcessStatus } from "@/interfaces/app";
import AlertsPopup from "./AlertsPopup";
import { selectCurrentUser } from "@/store/authSlide";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Button, Dropdown } from "antd";

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
  // userInfo = {
  //   name: "Administrator",
  //   role: "Administrator",
  //   department: "IT Security",
  // },
  userRole = CURRENT_USER_ROLE,
  onAlarmClick,
  onVerificationClick,
}: TopBarProps) {
  const dispatch = useAppDispatch();
  const [showAlarmDropdown, setShowAlarmDropdown] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const alertsState = useAppSelector(selectAlertsState);
  const topBarFeatures = getTopBarFeatures(userRole);
  const currentUser = useAppSelector(selectCurrentUser);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { isMobile } = useScreenWidth();
  console.log("isMobile", isMobile);

  useEffect(() => {
    dispatch(actionFetchLatestAlerts());
  }, [dispatch]);

  useEffect(() => {
    if (alertsState.error) {
      const timeout = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [alertsState.error, dispatch]);

  const handleAlarmClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        if (onAlarmClick) {
          onAlarmClick();
        } else {
          setShowAlarmDropdown((prev) => !prev);
          // Refresh alerts when opening
          if (!showAlarmDropdown) {
            dispatch(actionFetchLatestAlerts());
          }
        }
      }, 200);
    },
    [onAlarmClick, showAlarmDropdown, dispatch]
  );

  const handleVerificationClick = () => {
    if (onVerificationClick) {
      onVerificationClick();
    } else {
      console.log("Navigate to verification page");
    }
  };

  const handleActionConfirm = useCallback(
    async (alertId: string, action: EAlertProcessStatus, memo: string) => {
      try {
        await dispatch(
          actionUpdateAlertAction({
            alertId,
            action,
            memo,
            userId: currentUser?.name || "",
          })
        ).unwrap();

        dispatch(actionFetchLatestAlerts());
      } catch (error) {
        console.error("Failed to update alert action:", error);
      }
    },
    [dispatch, currentUser?.name]
  );

  const handleRefreshAlerts = useCallback(() => {
    dispatch(actionFetchLatestAlerts());
  }, [dispatch]);

  const handleClosePopup = useCallback(() => {
    setShowAlarmDropdown(false);
  }, []);

  const userMenuItems: any["items"] = [
    {
      key: "role",
      label: (
        <div className="flex items-center space-x-2 py-2">
          <i className="ri-user-line text-gray-500" />
          <span className="font-medium">Role:</span>
          <span>{currentUser?.role}</span>
        </div>
      ),
    },
    {
      key: "department",
      label: (
        <div className="flex items-center space-x-2 py-2">
          <i className="ri-building-line text-gray-500" />
          <span className="font-medium">Department:</span>
          <span>{currentUser?.department}</span>
        </div>
      ),
    },
    {
      key: "name",
      label: (
        <div className="flex items-center space-x-2 py-2">
          <i className="ri-account-circle-line text-gray-500" />
          <span className="font-medium">Name:</span>
          <span>{currentUser?.name}</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="top-bar h-[85px] px-6 flex items-center justify-between"
      style={{
        backgroundColor: "var(--color-grey-8)",
        borderBottom: `1px solid var(--color-border-100)`,
      }}
    >
      <div className="flex items-center space-x-4 pl-1">
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
              title={`${alertsState.pendingCount} pending alerts (${alertsState.alertCount} total)`}
            >
              <i className="ri-alarm-warning-line text-lg" />
              {alertsState.pendingCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold"
                  style={{ backgroundColor: "var(--color-error-100)" }}
                >
                  {alertsState.pendingCount > topBarFeatures.maxAlarmCount
                    ? `${topBarFeatures.maxAlarmCount}+`
                    : alertsState.pendingCount}
                </span>
              )}
            </button>

            <AlertsPopup
              isOpen={showAlarmDropdown}
              onClose={handleClosePopup}
              alerts={alertsState.alerts}
              alertCount={alertsState.alertCount}
              loading={alertsState.loading}
              error={alertsState.error}
              onActionConfirm={(alertId, action, memo) =>
                handleActionConfirm(alertId.toString(), action, memo)
              }
              onRefresh={handleRefreshAlerts}
              updatingAlerts={alertsState.updatingAlerts}
            />
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
          <>
            {!isMobile && (
              <div
                className="flex items-center space-x-2 text-sm"
                style={{ color: "var(--color-grey-80)" }}
              >
                <span>
                  {currentUser?.role}/{currentUser?.name}
                </span>
                <span style={{ color: "var(--color-grey-40)" }}>|</span>
                <span>{currentUser?.department}</span>
                <span style={{ color: "var(--color-grey-40)" }}>|</span>
                <span>{currentUser?.name}</span>
              </div>
            )}

            {isMobile && (
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={["click"]}
                open={showUserDropdown}
                onOpenChange={setShowUserDropdown}
                placement="bottomRight"
                overlayClassName="user-menu-dropdown"
              >
                <Button
                  type="text"
                  className="flex items-center space-x-2 px-3 py-2 h-auto min-h-[44px]"
                  style={{ color: "var(--color-grey-80)" }}
                >
                  <i className="ri-user-line text-lg" />
                  <span className="text-sm font-medium">
                    {currentUser?.name}
                  </span>
                  <i
                    className={`ri-arrow-down-s-line text-sm transition-transform ${
                      showUserDropdown ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </Dropdown>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TopBar;
