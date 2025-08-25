import React, { useState } from "react";
import { Card } from "antd";
import ScanHistoryFilterBar from "./ScanHistoryFilterBar";
import ScanHistoryTable from "./ScanHistoryTable";

const ScanHistoryTab: React.FC = () => {
  const [loading] = useState(false);
  const [csvDownloadButton, setCSVDownloadButton] = useState<React.ReactNode>(null);

  const handleCSVDownloadRender = (csvButton: React.ReactNode) => {
    setCSVDownloadButton(csvButton);
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <Card
        size="small"
        className="scan-history-filter-bar"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border-100)",
          borderRadius: "8px",
        }}
      >
        <ScanHistoryFilterBar loading={loading} />
      </Card>

      <div>
        {csvDownloadButton && (
          <div className="mb-1 flex justify-end mr-3">{csvDownloadButton}</div>
        )}

        <Card size="small" className="scan-history-table-card">
          <ScanHistoryTable
            loading={loading}
            onCSVDownloadRender={handleCSVDownloadRender}
          />
        </Card>
      </div>
    </div>
  );
};

export default ScanHistoryTab;