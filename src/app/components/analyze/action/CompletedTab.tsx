import React from "react";
import { Card, Empty } from "antd";

const CompletedTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 py-4">
      <Card size="small" className="completed-actions-card">
        <div className="flex items-center justify-center py-16">
          <Empty
            description={
              <span className="text-gray-500">
                조치 이력 조회 (Completed actions) will be implemented here
              </span>
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default CompletedTab;