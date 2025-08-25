import React from "react";
import { Button, Breadcrumb, Card } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import DetectionTable from "@/app/pages/Analyze/detection/DetectionTable";
import DetectionFilterBar from "@/app/pages/Analyze/detection/DetectionFilterBar";

const Detection: React.FC = () => {
  const loading = false;

  const handleDownloadCSV = () => {
    console.log("CSV download requested");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col gap-4">
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>Analysis</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">Detection</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Detection List
        </h1>
      </div>

      <Card
        size="small"
        className={`detection-filter-bar`}
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border-100)",
          borderRadius: "8px",
        }}
      >
        <DetectionFilterBar loading={loading} />
      </Card>

      <div className="flex flex-col gap-1">
        <div className="flex justify-end mr-3">
          <Button
            icon={<DownloadOutlined />}
            disabled={true}
            onClick={handleDownloadCSV}
            size="middle"
          >
            CSV Download
          </Button>
        </div>
        <DetectionTable filters={{}} loading={loading} />
      </div>
    </div>
  );
};

export default Detection;
