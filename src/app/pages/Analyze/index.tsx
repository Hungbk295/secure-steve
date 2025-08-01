import { useState, useEffect } from "react";
import { Card } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import TabNavigation from "@/app/pages/Analyze/TabNavigation";
import ServerAssignmentTab from "@/app/pages/Analyze/ServerAssignmentTab";

function AnalyzeDetectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("server-assignment");

  // Initialize active tab from URL hash
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (
      hash &&
      ["server-assignment", "server-settings", "quarantine-folder"].includes(
        hash
      )
    ) {
      setActiveTab(hash);
    } else {
      // Default to server-assignment if no valid hash
      setActiveTab("server-assignment");
      navigate(`${location.pathname}#server-assignment`, { replace: true });
    }
  }, [location.hash, location.pathname, navigate]);

  // Handle tab change with hash routing
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(`${location.pathname}#${key}`, { replace: true });
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "server-assignment":
        return <ServerAssignmentTab />;
      case "server-settings":
        return (
          <div className="p-6">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--color-grey-100)" }}
            >
              관리 서버 설정
            </h3>
            <p style={{ color: "var(--color-grey-40)" }}>
              Server settings functionality will be implemented here.
            </p>
          </div>
        );
      case "quarantine-folder":
        return (
          <div className="p-6">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--color-grey-100)" }}
            >
              격리 폴더 설정
            </h3>
            <p style={{ color: "var(--color-grey-40)" }}>
              Quarantine folder settings will be implemented here.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="analyze-detection-page">
      <Card
        className="w-full"
        style={{
          backgroundColor: "white",
          border: `1px solid var(--color-border-100)`,
          borderRadius: "8px",
        }}
      >
        <TabNavigation
          activeKey={activeTab}
          onChange={handleTabChange}
          className="mb-6"
        />
        {renderTabContent()}
      </Card>
    </div>
  );
}

export default AnalyzeDetectionPage;
