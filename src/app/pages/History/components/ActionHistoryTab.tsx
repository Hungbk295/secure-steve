import React, { useState } from "react";
import { Card } from "antd";
import ActionHistoryFilterBar from "./ActionHistoryFilterBar";
import ActionHistoryTable from "./ActionHistoryTable";

const ActionHistoryTab: React.FC = () => {
  const [loading] = useState(false);
  const [csvDownloadButton, setCSVDownloadButton] = useState<React.ReactNode>(null);

  const handleCSVDownloadRender = (csvButton: React.ReactNode) => {
    setCSVDownloadButton(csvButton);
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <Card
        size="small"
        className="action-history-filter-bar"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border-100)",
          borderRadius: "8px",
        }}
      >
        <ActionHistoryFilterBar loading={loading} />
      </Card>

      <div>
        {csvDownloadButton && (
          <div className="mb-1 flex justify-end mr-3">{csvDownloadButton}</div>
        )}

        <Card size="small" className="action-history-table-card">
          <ActionHistoryTable
            loading={loading}
            onCSVDownloadRender={handleCSVDownloadRender}
          />
        </Card>
      </div>
    </div>
  );
};

export default ActionHistoryTab;