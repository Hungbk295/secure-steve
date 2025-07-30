import { useState, useEffect, useCallback } from "react";
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
  const [currentFilters, setCurrentFilters] = useState({
    collection: "collection_a",
    range: "30d",
  });

  const loadStatusData = useCallback(async () => {
    try {
      const data = await dashboardService.getStatusByPeriod(currentFilters);
      setStatusData(data);
    } catch (error) {
      console.error("Failed to load status data:", error);
    }
  }, [currentFilters]);

  const loadMalwareFamilyData = useCallback(async () => {
    try {
      const data = await dashboardService.getMalwareFamilyDistribution(
        currentFilters
      );
      setMalwareFamilyData(data);
    } catch (error) {
      console.error("Failed to load malware family data:", error);
    }
  }, [currentFilters]);

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

  // Load initial data
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
    setCurrentFilters((prev) => ({ ...prev, collection }));
  };

  const handleRangeChange = (range: string) => {
    setCurrentFilters((prev) => ({ ...prev, range }));
  };

  const handleBarClick = (category: string) => {
    const url = dashboardService.navigateToAnalysisDetectionList({
      status: category,
      range: currentFilters.range,
      collection: currentFilters.collection,
    });
    console.log("Would navigate to:", url);
  };

  const handleFamilyClick = (family: string) => {
    const url = dashboardService.navigateToAnalysisDetectionList({
      family: family,
      range: currentFilters.range,
      collection: currentFilters.collection,
    });
    console.log("Would navigate to:", url);
  };

  // Server status handlers
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

  // Malware whitelist handlers
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
      // Reload data after removal
      loadMalwareWhitelistData();
    } catch (error) {
      console.error("Failed to remove from whitelist:", error);
    }
  };

  const handleIgnore = async (id: string) => {
    try {
      await dashboardService.ignoreMalwareAlert(id);
      // Reload data after ignoring
      loadMalwareWhitelistData();
    } catch (error) {
      console.error("Failed to ignore alert:", error);
    }
  };

  const handleFileClick = (fileName: string) => {
    console.log("File clicked:", fileName);
    // Navigate to whitelist page with anchor to file
  };
  return (
    <div className="dashboard-page flex flex-col gap-6">
      <AlertNotificationPanel />
      <StatusByPeriodCard
        data={statusData}
        onCollectionChange={handleCollectionChange}
        onRangeChange={handleRangeChange}
        onBarClick={handleBarClick}
      />
      <MalwareDetectionStatusCard
        data={malwareFamilyData}
        onFamilyClick={handleFamilyClick}
      />

      <ServerStatusCard
        data={serverData}
        onServerClick={handleServerClick}
        onRetryPing={handleRetryPing}
        onCreateTicket={handleCreateTicket}
      />

      <MalwareOnWhitelistCard
        data={malwareWhitelistData}
        onRescan={handleRescan}
        onRemoveFromWhitelist={handleRemoveFromWhitelist}
        onIgnore={handleIgnore}
        onFileClick={handleFileClick}
      />
    </div>
  );
}

export default DashboardPage;
