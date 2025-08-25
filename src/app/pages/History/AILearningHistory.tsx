import React, { useState } from "react";
import { Breadcrumb, Card } from "antd";
import AILearningHistoryFilterBar from "./components/AILearningHistoryFilterBar";
import AILearningHistoryTable from "./components/AILearningHistoryTable";

const AILearningHistory: React.FC = () => {
  const [loading] = useState(false);
  const [csvDownloadButton, setCSVDownloadButton] = useState<React.ReactNode>(null);

  const handleCSVDownloadRender = (csvButton: React.ReactNode) => {
    setCSVDownloadButton(csvButton);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>History</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">AI Learning</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          AI 학습 이력
        </h1>
      </div>
      
      <div className="flex-1 py-4 flex flex-col gap-4">
        <Card
          size="small"
          className="ai-learning-history-filter-bar"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border-100)",
            borderRadius: "8px",
          }}
        >
          <AILearningHistoryFilterBar loading={loading} />
        </Card>

        <div>
          {csvDownloadButton && (
            <div className="mb-1 flex justify-end mr-3">{csvDownloadButton}</div>
          )}

          <Card size="small" className="ai-learning-history-table-card">
            <AILearningHistoryTable
              loading={loading}
              onCSVDownloadRender={handleCSVDownloadRender}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AILearningHistory;