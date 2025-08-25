import React, { useEffect } from "react";
import { Breadcrumb, Card } from "antd";
import AuthorityHistoryFilterBar from "./components/AuthorityHistoryFilterBar";
import AuthorityHistoryTable from "./components/AuthorityHistoryTable";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectAuthorityHistoryLoading,
  actionGetAuthorityHistoryList,
} from "@/store/authorityHistorySlice";

const AuthorityHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthorityHistoryLoading);

  useEffect(() => {
    dispatch(actionGetAuthorityHistoryList({}));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>History</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">
            Authority History
          </Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Authority History Management
        </h1>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-4">
        <Card
          size="small"
          className="authority-history-filter-bar"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border-100)",
            borderRadius: "8px",
          }}
        >
          <AuthorityHistoryFilterBar loading={loading} />
        </Card>

        <AuthorityHistoryTable loading={loading} />
      </div>
    </div>
  );
};

export default AuthorityHistory;