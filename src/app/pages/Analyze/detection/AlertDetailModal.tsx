import React, { useEffect, useState } from "react";
import { Modal, Tabs, Tag, Button, Spin, message } from "antd";
import type { TabsProps } from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectAlertDetailState,
  actionGetAlertDetail,
  closeModal,
  updateDetailProcessStatus,
  updateDetailException,
} from "@/store/alertDetailSlice";
import {
  getVerdictColor,
  getRiskBadgeColor,
  getTimeDisplay,
  canChangeProcessStatus,
  PROCESS_STATUS_OPTIONS,
  EXCEPTION_OPTIONS,
} from "@/constants/detectionConstants";
import ProcessActionModal from "./ProcessActionModal";
import ExceptionModal from "./ExceptionModal";

const AlertDetailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedId, isOpen, detail, loading, error } = useAppSelector(
    selectAlertDetailState
  );

  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [exceptionModalVisible, setExceptionModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedExceptionType, setSelectedExceptionType] =
    useState<string>("");

  useEffect(() => {
    if (isOpen && selectedId && !detail) {
      dispatch(actionGetAlertDetail(selectedId));
    }
  }, [isOpen, selectedId, detail, dispatch]);

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleProcessStatusChange = (newStatus: string) => {
    if (!canChangeProcessStatus(detail?.process_status)) {
      message.warning("Only pending alerts can be processed");
      return;
    }
    setSelectedAction(newStatus);
    setActionModalVisible(true);
  };

  const handleExceptionChange = (exceptionType: string) => {
    setSelectedExceptionType(exceptionType);
    setExceptionModalVisible(true);
  };

  const handleProcessActionConfirm = async (
    alertId: number,
    action: string,
    memo: string
  ) => {
    try {
      // TODO: Dispatch Redux action
      console.log("Process action:", { alertId, action, memo });

      dispatch(
        updateDetailProcessStatus({ id: alertId, processStatus: action })
      );

      message.success(`Alert ${action} successfully`);
      setActionModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to process alert");
    }
  };

  const handleUpdateException = async (
    record: any,
    exceptionType: string,
    actionType?: string,
    memo?: string
  ) => {
    try {
      // TODO: Dispatch Redux action
      console.log("Exception update:", {
        id: record.id,
        exceptionType,
        actionType,
        memo,
      });

      dispatch(
        updateDetailException({ id: record.id, exception: exceptionType })
      );

      message.success(`Exception ${exceptionType} applied successfully`);
      setExceptionModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to update exception");
    }
  };

  const actionMenuItems = PROCESS_STATUS_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
    disabled: !canChangeProcessStatus(detail?.process_status),
  }));

  const exceptionMenuItems = EXCEPTION_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  const tabItems: TabsProps["items"] = [
    {
      key: "file-info",
      label: "File Info",
      children: (
        <div className="space-y-4">
          {detail && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    File Type
                  </label>
                  <p className="text-sm text-gray-900">
                    {detail.file_type || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    File Size
                  </label>
                  <p className="text-sm text-gray-900">
                    {detail.file_size
                      ? `${(detail.file_size / 1024).toFixed(2)} KB`
                      : "N/A"}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600">
                    File Path
                  </label>
                  <p className="text-sm text-gray-900 font-mono break-all">
                    {detail.file_path || "N/A"}
                  </p>
                </div>
              </div>

              {detail.analysis_result?.file_hash && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    File Hashes
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">
                        MD5
                      </label>
                      <p className="text-xs text-gray-900 font-mono break-all">
                        {detail.analysis_result.file_hash.md5 || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">
                        SHA1
                      </label>
                      <p className="text-xs text-gray-900 font-mono break-all">
                        {detail.analysis_result.file_hash.sha1 || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">
                        SHA256
                      </label>
                      <p className="text-xs text-gray-900 font-mono break-all">
                        {detail.analysis_result.file_hash.sha256 || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      key: "detection",
      label: "Detection",
      children: (
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            Detection rules and signatures will be displayed here.
          </div>
        </div>
      ),
    },
    {
      key: "analysis-result",
      label: "Analysis Result",
      children: (
        <div className="space-y-4">
          {detail?.analysis_result?.prediction && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Prediction
              </h4>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm">
                  <span className="font-medium">Label: </span>
                  {detail.analysis_result.prediction.label?.join(", ") || "N/A"}
                </div>
                {detail.analysis_result.prediction.proba && (
                  <div className="text-sm mt-1">
                    <span className="font-medium">Probability: </span>
                    {Object.entries(
                      detail.analysis_result.prediction.proba
                    ).map(([key, value]) => (
                      <span key={key} className="mr-2">
                        {key}: {((value as number) * 100).toFixed(1)}%
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              YARA Rules
            </h4>
            <div className="text-sm text-gray-500">
              YARA rule matches will be displayed here.
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Analysis Report
            </h4>
            <div className="text-sm text-gray-500">
              Detailed analysis report will be displayed here.
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "related-alerts",
      label: "Related Alerts",
      children: (
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            Related alerts and similar threats will be displayed here.
          </div>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={handleClose}
        footer={null}
        width="50vw"
        style={{ maxWidth: "800px", minWidth: "600px" }}
        className="alert-detail-modal"
        maskClosable={false}
        keyboard
      >
        <div className="flex flex-col h-[80vh]">
          <div className="sticky top-0 bg-white border-b border-gray-200 pb-4 mb-4 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Alert Detail
              </h2>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <ExclamationCircleOutlined className="text-red-500 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            {detail && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-medium text-gray-900 break-all">
                    {detail.file_name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>
                      Created:{" "}
                      {detail.file_created_at
                        ? getTimeDisplay(detail.file_created_at).local
                        : "N/A"}
                    </span>
                    <span>
                      Analyzed:{" "}
                      {detail.analysis_time
                        ? getTimeDisplay(detail.analysis_time).local
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tag
                      className={`${getVerdictColor(
                        detail.malware_status
                      )} border font-medium`}
                    >
                      {detail.malware_status}
                    </Tag>
                    {detail.analysis_result?.prediction?.proba && (
                      <Tag
                        className={`${getRiskBadgeColor(
                          (Object.values(
                            detail.analysis_result.prediction.proba
                          )[0] as number) * 100
                        )} border font-medium`}
                      >
                        {(
                          (Object.values(
                            detail.analysis_result.prediction.proba
                          )[0] as number) * 100
                        ).toFixed(1)}
                        %
                      </Tag>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      options={actionMenuItems}
                      placeholder="Actions"
                      onChange={(value) => handleProcessStatusChange(value)}
                      disabled={!canChangeProcessStatus(detail?.process_status)}
                      className="w-32"
                      size="middle"
                      allowClear
                    />

                    <Select
                      options={exceptionMenuItems}
                      placeholder="Exception"
                      onChange={(value) => handleExceptionChange(value)}
                      className="w-32"
                      size="middle"
                      allowClear
                    />

                    <Button
                      size="middle"
                      icon={<DownloadOutlined />}
                      disabled
                      title="Download feature pending"
                    >
                      Download
                    </Button>

                    <Button
                      size="middle"
                      icon={<FileTextOutlined />}
                      disabled
                      title="Generate report feature pending"
                    >
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-x-auto">
            {loading && (
              <div className="flex justify-center items-center h-32">
                <Spin size="large" />
              </div>
            )}

            {!loading && detail && (
              <Tabs defaultActiveKey="file-info" items={tabItems} />
            )}
          </div>
        </div>
      </Modal>

      <ProcessActionModal
        visible={actionModalVisible}
        onCancel={() => setActionModalVisible(false)}
        onConfirm={handleProcessActionConfirm}
        alert={detail}
        action={selectedAction}
      />

      <ExceptionModal
        visible={exceptionModalVisible}
        onCancel={() => setExceptionModalVisible(false)}
        onConfirm={handleUpdateException}
        alert={detail}
        exceptionType={selectedExceptionType}
      />
    </>
  );
};

export default AlertDetailModal;
