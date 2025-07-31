import { useState, useEffect, useCallback } from "react";
import { Row, Col } from "antd";
import AlertNotificationPanel from "@/app/pages/Dashboard/dashboard/AlertNotificationPanel";
import StatusByPeriodCard from "./widgets/StatusByPeriodCard";
import MalwareDetectionStatusCard from "./widgets/MalwareDetectionStatusCard";
import ServerStatusCard from "./widgets/ServerStatusCard";
import MalwareOnWhitelistCard from "./widgets/MalwareOnWhitelistCard";
import {
  dashboardService,
  StatusByPeriodData,
  MalwareFamilyData,
  ServerData,
  MalwareWhitelistData,
} from "@/app/services/dashboardService";

function DashboardPage() {
  const [statusData, setStatusData] = useState<StatusByPeriodData>();
  const [malwareFamilyData, setMalwareFamilyData] =
    useState<MalwareFamilyData[]>();
  const [serverData, setServerData] = useState<ServerData[]>();
  const [malwareWhitelistData, setMalwareWhitelistData] =
    useState<MalwareWhitelistData[]>();
  const [statusFilters, setStatusFilters] = useState({
    collection: "collection_a",
    range: "30d",
  });
  const [malwareFilters, setMalwareFilters] = useState({
    collection: "collection_a",
    range: "30d",
  });

  const loadStatusData = useCallback(async () => {
    try {
      const data = await dashboardService.getStatusByPeriod(statusFilters);
      setStatusData(data);
    } catch (error) {
      console.error("Failed to load status data:", error);
    }
  }, [statusFilters]);

  const loadMalwareFamilyData = useCallback(async () => {
    try {
      const data = await dashboardService.getMalwareFamilyDistribution(
        malwareFilters
      );
      setMalwareFamilyData(data);
    } catch (error) {
      console.error("Failed to load malware family data:", error);
    }
  }, [malwareFilters]);

  const loadServerData = useCallback(async () => {
    try {
      const data = await dashboardService.getServerStatus();
      setServerData(data);
    } catch (error) {
      console.error("Failed to load server data:", error);
    }
  }, []);

  const loadMalwareWhitelistData = useCallback(async () => {
    try {
      const data = await dashboardService.getMalwareWhitelistData();
      setMalwareWhitelistData(data);
    } catch (error) {
      console.error("Failed to load malware whitelist data:", error);
    }
  }, []);

  useEffect(() => {
    loadStatusData();
    loadMalwareFamilyData();
    loadServerData();
    loadMalwareWhitelistData();
  }, [
    loadStatusData,
    loadMalwareFamilyData,
    loadServerData,
    loadMalwareWhitelistData,
  ]);

  const handleCollectionChange = (collection: string) => {
    setStatusFilters((prev) => ({ ...prev, collection }));
  };

  const handleRangeChange = (range: string) => {
    setStatusFilters((prev) => ({ ...prev, range }));
  };

  const handleBarClick = (category: string) => {
    const url = dashboardService.navigateToAnalysisDetectionList({
      status: category,
      range: statusFilters.range,
      collection: statusFilters.collection,
    });
    console.log("Would navigate to:", url);
  };

  const handleFamilyClick = (family: string) => {
    const url = dashboardService.navigateToAnalysisDetectionList({
      family: family,
      range: malwareFilters.range,
      collection: malwareFilters.collection,
    });
    console.log("Would navigate to:", url);
  };

  const handleServerClick = (serverId: string) => {
    console.log("Server clicked:", serverId);
  };

  const handleRetryPing = async (serverId: string) => {
    try {
      await dashboardService.retryServerPing(serverId);
    } catch (error) {
      console.error("Failed to retry ping:", error);
    }
  };

  const handleCreateTicket = async (serverId: string) => {
    try {
      await dashboardService.createSupportTicket(serverId);
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  const handleRescan = async (id: string) => {
    try {
      await dashboardService.rescanMalwareFile(id);
    } catch (error) {
      console.error("Failed to rescan:", error);
    }
  };

  const handleRemoveFromWhitelist = async (id: string) => {
    try {
      await dashboardService.removeFromWhitelist(id);
      loadMalwareWhitelistData();
    } catch (error) {
      console.error("Failed to remove from whitelist:", error);
    }
  };

  const handleIgnore = async (id: string) => {
    try {
      await dashboardService.ignoreMalwareAlert(id);
      loadMalwareWhitelistData();
    } catch (error) {
      console.error("Failed to ignore alert:", error);
    }
  };

  const handleFileClick = (fileName: string) => {
    console.log("File clicked:", fileName);
  };
  return (
    <div className="dashboard-page" style={{ padding: "24px" }}>
      <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
        <Col span={24}>
          <div style={{ height: "100%" }}>
            <AlertNotificationPanel />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
        <Col span={12}>
          <div style={{ height: "400px" }}>
            <StatusByPeriodCard
              data={statusData}
              onCollectionChange={handleCollectionChange}
              onRangeChange={handleRangeChange}
              onBarClick={handleBarClick}
            />
          </div>
        </Col>
        <Col span={12}>
          <div style={{ height: "400px" }}>
            <MalwareDetectionStatusCard
              data={malwareFamilyData}
              onFamilyClick={handleFamilyClick}
            />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div style={{ height: "400px" }}>
            <ServerStatusCard
              data={serverData}
              onServerClick={handleServerClick}
              onRetryPing={handleRetryPing}
              onCreateTicket={handleCreateTicket}
            />
          </div>
        </Col>
        <Col span={12}>
          <div style={{ height: "400px" }}>
            <MalwareOnWhitelistCard
              data={malwareWhitelistData}
              onRescan={handleRescan}
              onRemoveFromWhitelist={handleRemoveFromWhitelist}
              onIgnore={handleIgnore}
              onFileClick={handleFileClick}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
