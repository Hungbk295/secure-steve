import React from "react";
import { Button, message } from "antd";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  actionBulkMoveFilePolicy,
  actionBulkRemoveFilePolicy,
  actionGetFilePolicies,
  selectBlacklistSelectedRowKeys,
  selectBulkMoveLoading,
  selectBulkRemoveLoading,
  clearSelectedRows,
} from "@/store/blacklistSlice";

interface BulkActionsToolbarProps {
  selectedCount: number;
  activeTab: "blacklist" | "whitelist";
  onMoveToBlacklist: () => void;
  onMoveToWhitelist: () => void;
  onRemove: () => void;
  onDeselectAll: () => void;
  disable: boolean;
}

const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  activeTab,
  disable,
  // onMoveToBlacklist,
  // onMoveToWhitelist,
  // onRemove,
  // onDeselectAll,
}) => {
  const dispatch = useAppDispatch();
  const selectedRowKeys = useAppSelector(selectBlacklistSelectedRowKeys);
  const bulkMoveLoading = useAppSelector(selectBulkMoveLoading);
  const bulkRemoveLoading = useAppSelector(selectBulkRemoveLoading);

  const handleMoveToBlacklist = async () => {
    try {
      await dispatch(
        actionBulkMoveFilePolicy({
          selectedIds: selectedRowKeys,
          targetPolicy: "blacklist",
          comments: "Bulk move to blacklist",
        })
      ).unwrap();

      message.success(`${selectedCount}개 항목이 블랙리스트로 이동되었습니다.`);

      // Refresh both lists
      dispatch(actionGetFilePolicies({ type: "blacklist" }));
      dispatch(actionGetFilePolicies({ type: "whitelist" }));
    } catch (error) {
      console.error("Failed to move to blacklist:", error);
      message.error("블랙리스트 이동에 실패했습니다.");
    }
  };

  const handleMoveToWhitelist = async () => {
    try {
      await dispatch(
        actionBulkMoveFilePolicy({
          selectedIds: selectedRowKeys,
          targetPolicy: "whitelist",
          comments: "Bulk move to whitelist",
        })
      ).unwrap();

      message.success(
        `${selectedCount}개 항목이 화이트리스트로 이동되었습니다.`
      );

      // Refresh both lists
      dispatch(actionGetFilePolicies({ type: "blacklist" }));
      dispatch(actionGetFilePolicies({ type: "whitelist" }));
    } catch (error) {
      console.error("Failed to move to whitelist:", error);
      message.error("화이트리스트 이동에 실패했습니다.");
    }
  };

  const handleBulkRemove = async () => {
    try {
      await dispatch(
        actionBulkRemoveFilePolicy({
          selectedIds: selectedRowKeys,
          comments: "Bulk remove from list",
        })
      ).unwrap();

      message.success(`${selectedCount}개 항목이 리스트에서 제거되었습니다.`);

      // Refresh current list
      dispatch(actionGetFilePolicies({ type: activeTab }));
    } catch (error) {
      console.error("Failed to remove from list:", error);
      message.error("리스트 제거에 실패했습니다.");
    }
  };

  const handleDeselectAll = () => {
    dispatch(clearSelectedRows());
  };

  const isLoading = bulkMoveLoading || bulkRemoveLoading || disable;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 mr-4 mb-1">
      {activeTab === "blacklist" && (
        <Button
          size="middle"
          className="min-w-[120px]"
          loading={bulkMoveLoading}
          disabled={isLoading}
          onClick={handleMoveToWhitelist}
        >
          화이트리스트 이동
        </Button>
      )}

      {activeTab === "whitelist" && (
        <Button
          size="middle"
          className="min-w-[120px]"
          loading={bulkMoveLoading}
          disabled={isLoading}
          onClick={handleMoveToBlacklist}
        >
          블랙리스트 이동
        </Button>
      )}

      <Button
        size="middle"
        className="min-w-[120px]"
        loading={bulkRemoveLoading}
        disabled={isLoading}
        onClick={handleBulkRemove}
      >
        리스트 해제
      </Button>

      <Button
        className="min-w-[120px]"
        size="middle"
        disabled={isLoading}
        onClick={handleDeselectAll}
      >
        선택안함
      </Button>
    </div>
  );
};

export default BulkActionsToolbar;
