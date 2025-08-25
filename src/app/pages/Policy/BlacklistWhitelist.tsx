import React, { useState } from "react";
import { Breadcrumb, Tabs, TabsProps } from "antd";
import BlacklistFilterBar from "@/app/components/policy/blacklist/BlacklistFilterBar";
import BlacklistTable from "@/app/components/policy/blacklist/BlacklistTable";
import WhitelistTable from "@/app/components/policy/blacklist/WhitelistTable";
import BulkActionsToolbar from "@/app/components/policy/blacklist/BulkActionsToolbar";
import AddToBlacklistModal from "@/app/components/policy/blacklist/AddToBlacklistModal";
import AddToWhitelistModal from "@/app/components/policy/blacklist/AddToWhitelistModal";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectBlacklistLoading,
  selectActiveTab,
  selectBlacklistSelectedRowKeys,
  setActiveTab,
  clearSelectedRows,
} from "@/store/blacklistSlice";

const BlacklistWhitelist: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectBlacklistLoading);
  const activeTab = useAppSelector(selectActiveTab);
  const selectedRowKeys = useAppSelector(selectBlacklistSelectedRowKeys);

  const [addToBlacklistModalVisible, setAddToBlacklistModalVisible] =
    useState(false);
  const [addToWhitelistModalVisible, setAddToWhitelistModalVisible] =
    useState(false);

  const handleTabChange = (key: string) => {
    dispatch(setActiveTab(key as "blacklist" | "whitelist"));
  };

  const handleBulkMoveToBlacklist = () => {};

  const handleBulkMoveToWhitelist = () => {};

  const handleBulkRemove = () => {};

  const handleDeselectAll = () => {
    dispatch(clearSelectedRows());
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "blacklist",
      label: (
        <span className="text-base font-medium pl-4 px-2">블랙 리스트</span>
      ),
    },
    {
      key: "whitelist",
      label: <span className="text-base font-medium px-2">화이트 리스트</span>,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>Policy</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">
            Blacklist / Whitelist
          </Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          블랙/화이트리스트 관리
        </h1>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-4">
        <div className="bg-white rounded-lg border border-gray-200 !mb-0 overflow-x-auto">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            size="large"
          />
        </div>
        <div className="bg-white rounded-lg border border-gray-200">
          <BlacklistFilterBar loading={loading} />
        </div>

        <div>
          <BulkActionsToolbar
            selectedCount={selectedRowKeys.length}
            activeTab={activeTab}
            onMoveToBlacklist={handleBulkMoveToBlacklist}
            onMoveToWhitelist={handleBulkMoveToWhitelist}
            onRemove={handleBulkRemove}
            onDeselectAll={handleDeselectAll}
            disable={selectedRowKeys.length === 0}
          />
          <div className="bg-white rounded-lg border border-gray-200">
            {activeTab === "blacklist" && <BlacklistTable loading={loading} />}
            {activeTab === "whitelist" && <WhitelistTable loading={loading} />}
          </div>
        </div>
      </div>

      <AddToBlacklistModal
        visible={addToBlacklistModalVisible}
        onCancel={() => setAddToBlacklistModalVisible(false)}
        onConfirm={() => setAddToBlacklistModalVisible(false)}
      />

      <AddToWhitelistModal
        visible={addToWhitelistModalVisible}
        onCancel={() => setAddToWhitelistModalVisible(false)}
        onConfirm={() => setAddToWhitelistModalVisible(false)}
      />
    </div>
  );
};

export default BlacklistWhitelist;
