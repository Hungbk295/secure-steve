import React, { useState } from "react";
import { Card } from "antd";
import CompletedFilterBar from "./CompletedFilterBar";
import CompletedTable from "./CompletedTable";
import { useAppSelector } from "@/store";
import { selectCompleteLoading } from "@/store/completeSlice";

const CompletedTab: React.FC = () => {
  const loading = useAppSelector(selectCompleteLoading);
  const [csvDownloadButton, setCSVDownloadButton] =
    useState<React.ReactNode>(null);

  const handleCSVDownloadRender = (csvButton: React.ReactNode) => {
    setCSVDownloadButton(csvButton);
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <Card
        size="small"
        className="completed-filter-bar"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border-100)",
          borderRadius: "8px",
        }}
      >
        <CompletedFilterBar loading={loading} />
      </Card>

      <div>
        {csvDownloadButton && (
          <div className="mb-1 flex justify-end mr-3">{csvDownloadButton}</div>
        )}

        <Card size="small" className="completed-table-card">
          <CompletedTable
            loading={loading}
            onCSVDownloadRender={handleCSVDownloadRender}
          />
        </Card>
      </div>
    </div>
  );
};

export default CompletedTab;
