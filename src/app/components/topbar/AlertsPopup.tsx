import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, EAlertProcessStatus } from "@/interfaces/app";
import ActionConfirmModal from "./ActionConfirmModal";
import AlertListItem from "./AlertListItem";

interface AlertsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  alertCount: number;
  loading: boolean;
  error: string | null;
  onActionConfirm: (
    alertId: string | number,
    action: EAlertProcessStatus,
    memo: string
  ) => Promise<void>;
  onRefresh: () => void;
  updatingAlerts?: Set<string | number>;
}

function AlertsPopup({
  isOpen,
  onClose,
  alerts,
  alertCount,
  loading,
  error,
  onActionConfirm,
  onRefresh,
  updatingAlerts = new Set(),
}: AlertsPopupProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    alert: Alert | null;
    action: EAlertProcessStatus | null;
    loading: boolean;
  }>({
    isOpen: false,
    alert: null,
    action: null,
    loading: false,
  });

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.closest(".ant-select-dropdown") ||
        target.closest(".custom-select-popup")
      ) {
        return;
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !confirmModal.isOpen &&
        updatingAlerts.size === 0
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, confirmModal.isOpen, updatingAlerts.size]);

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      if (!loading && !confirmModal.isOpen && updatingAlerts.size === 0) {
        onRefresh();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, loading, confirmModal.isOpen, updatingAlerts.size, onRefresh]);

  if (!isOpen) {
    return null;
  }

  const handleItemClick = (alertId: string) => {
    navigate(`/analysis/requests/${alertId}`);
    onClose();
  };

  const handleActionSelect = (
    alertId: string | number,
    action: EAlertProcessStatus
  ) => {
    const alert = alerts.find((a) => a.id == alertId);
    if (!alert) return;

    setConfirmModal({
      isOpen: true,
      alert,
      action,
      loading: false,
    });
  };

  const handleConfirmAction = async (
    alertId: string,
    action: EAlertProcessStatus,
    memo: string
  ) => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));

    try {
      await onActionConfirm(alertId, action, memo);
    } finally {
      setConfirmModal({
        isOpen: false,
        alert: null,
        action: null,
        loading: false,
      });
    }
  };

  const handleCloseConfirmModal = () => {
    if (confirmModal.loading) return;

    setConfirmModal({
      isOpen: false,
      alert: null,
      action: null,
      loading: false,
    });
  };

  const handleViewAll = () => {
    navigate("/analysis/requests?filter=pending");
    onClose();
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRefresh();
  };

  // Show top 10 alerts
  const displayAlerts = alerts.slice(0, 10);
  const pendingCount = alerts.filter(
    (alert) => alert.process_status === EAlertProcessStatus.PENDING
  ).length;

  return (
    <>
      <div
        ref={dropdownRef}
        className="absolute z-index-100 top-full mt-2 w-[600px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] flex flex-col"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Latest Alerts
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Total: {alertCount}</span>
                <span>•</span>
                <span>Pending: {pendingCount}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
                title="Refresh alerts"
              >
                <i
                  className={`ri-refresh-line text-lg ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
                title="Close alerts"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {error ? (
            <div className="p-8 text-center text-red-500">
              <i className="ri-error-warning-line text-3xl mb-3" />
              <p className="font-medium mb-2">Failed to load alerts</p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : displayAlerts.length === 0 && !loading ? (
            <div className="p-8 text-center text-gray-500">
              <i className="ri-notification-off-line text-3xl mb-3" />
              <p className="font-medium mb-1">No alerts available</p>
              <p className="text-sm">All alerts have been processed</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-80">
              {loading && displayAlerts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <i className="ri-loader-2-line text-3xl mb-3 animate-spin" />
                  <p>Loading alerts...</p>
                </div>
              ) : (
                displayAlerts.map((alert) => (
                  <AlertListItem
                    key={alert.id}
                    alert={alert}
                    onItemClick={() => handleItemClick(alert.id)}
                    onActionSelect={handleActionSelect}
                    isUpdating={updatingAlerts.has(alert.id)}
                  />
                ))
              )}

              {loading && displayAlerts.length > 0 && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <i className="ri-loader-2-line animate-spin" />
                    <span className="text-sm">Refreshing...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!error && displayAlerts.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={handleViewAll}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-1 rounded transition-colors hover:bg-blue-50"
            >
              View All Alerts
              {alerts.length > 10 && (
                <span className="ml-1">({alerts.length - 10} more)</span>
              )}
            </button>
          </div>
        )}
      </div>

      <ActionConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmAction}
        alert={confirmModal.alert}
        selectedAction={confirmModal.action}
        loading={confirmModal.loading}
      />
    </>
  );
}

export default AlertsPopup;
