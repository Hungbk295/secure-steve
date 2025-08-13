import React, { useState } from "react";
import { Card } from "antd";
import PendingFilterBar from "./PendingFilterBar";
import PendingTable from "./PendingTable";
import { useAppSelector } from "@/store";
import { selectActionLoading } from "@/store/actionSlice";

const PendingTab: React.FC = () => {
  const loading = useAppSelector(selectActionLoading);
  const [actionButtons, setActionButtons] = useState<React.ReactNode>(null);

  // Handle action buttons render
  const handleActionsRender = (actionsElement: React.ReactNode) => {
    setActionButtons(actionsElement);
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Filter Bar */}
      <Card
        size="small"
        className="pending-filter-bar"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border-100)",
          borderRadius: "8px",
        }}
      >
        <PendingFilterBar
          loading={loading}
        />
      </Card>

      <div>
        {actionButtons && <div className="mb-1">{actionButtons}</div>}

        {/* Pending Table */}
        <Card size="small" className="pending-table-card">
          <PendingTable
            loading={loading}
            onActionsRender={handleActionsRender}
          />
        </Card>
      </div>
    </div>
  );
};

export default PendingTab;
