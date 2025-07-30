// Mock API service for dashboard data
export interface StatusByPeriodData {
  total_scans: number;
  confirmed_malware: number;
  no_threats: number;
  action_completed: number;
}

export interface MalwareFamilyData {
  family: string;
  count: number;
}

export interface ServerData {
  id: string;
  serverIp: string;
  manager: string;
  connection: "normal" | "abnormal";
  needsAttention: boolean;
  detectionFreq7d: number;
}

export interface MalwareWhitelistData {
  id: string;
  fileName: string;
  hash: string;
  detectedAt: string;
  riskLevel: "low" | "medium" | "high";
}

export interface DashboardApiParams {
  collection?: string;
  range?: string;
}

// Mock data generators
const generateStatusData = (params: DashboardApiParams): StatusByPeriodData => {
  // Simulate different data based on parameters
  const baseData = {
    total_scans: 312,
    confirmed_malware: 211,
    no_threats: 101,
    action_completed: 200,
  };

  // Adjust data based on time range
  if (params.range === "7d") {
    return {
      total_scans: Math.floor(baseData.total_scans * 0.3),
      confirmed_malware: Math.floor(baseData.confirmed_malware * 0.3),
      no_threats: Math.floor(baseData.no_threats * 0.3),
      action_completed: Math.floor(baseData.action_completed * 0.3),
    };
  } else if (params.range === "24h") {
    return {
      total_scans: Math.floor(baseData.total_scans * 0.1),
      confirmed_malware: Math.floor(baseData.confirmed_malware * 0.1),
      no_threats: Math.floor(baseData.no_threats * 0.1),
      action_completed: Math.floor(baseData.action_completed * 0.1),
    };
  }

  return baseData;
};

const generateMalwareFamilyData = (
  params: DashboardApiParams
): MalwareFamilyData[] => {
  const baseData = [
    { family: "패밀리1", count: 126 },
    { family: "패밀리2", count: 52 },
    { family: "패밀리3", count: 20 },
    { family: "패밀리4", count: 13 },
  ];

  // Adjust data based on collection
  if (params.collection === "collection_b") {
    return [
      { family: "패밀리1", count: 89 },
      { family: "패밀리2", count: 67 },
      { family: "패밀리3", count: 34 },
      { family: "패밀리4", count: 22 },
    ];
  } else if (params.collection === "collection_c") {
    return [
      { family: "패밀리1", count: 156 },
      { family: "패밀리2", count: 43 },
      { family: "패밀리3", count: 28 },
      { family: "패밀리4", count: 15 },
    ];
  }

  return baseData;
};

const generateServerData = (): ServerData[] => {
  return [
    {
      id: "server-001",
      serverIp: "192.168.1.100",
      manager: "김관리자",
      connection: "normal",
      needsAttention: false,
      detectionFreq7d: 0,
    },
    {
      id: "server-002",
      serverIp: "192.168.1.101",
      manager: "이담당자",
      connection: "abnormal",
      needsAttention: true,
      detectionFreq7d: 5,
    },
    {
      id: "server-003",
      serverIp: "192.168.1.102",
      manager: "박시스템",
      connection: "normal",
      needsAttention: false,
      detectionFreq7d: 2,
    },
  ];
};

const generateMalwareWhitelistData = (): MalwareWhitelistData[] => {
  return [
    {
      id: "malware-001",
      fileName: "suspicious_file.exe",
      hash: "a1b2c3d4e5f6789012345678901234567890abcd",
      detectedAt: "2025-01-30T10:30:00Z",
      riskLevel: "high",
    },
    {
      id: "malware-002",
      fileName: "potential_threat.dll",
      hash: "b2c3d4e5f6789012345678901234567890abcdef",
      detectedAt: "2025-01-29T15:45:00Z",
      riskLevel: "medium",
    },
  ];
};

// Mock API functions
export const dashboardService = {
  async getStatusByPeriod(
    params: DashboardApiParams = {}
  ): Promise<StatusByPeriodData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return generateStatusData(params);
  },

  async getMalwareFamilyDistribution(
    params: DashboardApiParams = {}
  ): Promise<MalwareFamilyData[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateMalwareFamilyData(params);
  },

  async getServerStatus(): Promise<ServerData[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    return generateServerData();
  },

  async getMalwareWhitelistData(): Promise<MalwareWhitelistData[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 350));
    return generateMalwareWhitelistData();
  },

  // Server management actions
  async retryServerPing(serverId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Retrying ping for server: ${serverId}`);
  },

  async createSupportTicket(serverId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(`Creating support ticket for server: ${serverId}`);
  },

  // Malware whitelist actions
  async rescanMalwareFile(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.log(`Rescanning malware file: ${id}`);
  },

  async removeFromWhitelist(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log(`Removing from whitelist: ${id}`);
  },

  async ignoreMalwareAlert(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log(`Ignoring malware alert: ${id}`);
  },

  // Navigation handlers for drill-down functionality
  navigateToAnalysisDetectionList(filters: {
    status?: string;
    family?: string;
    range?: string;
    collection?: string;
  }) {
    const queryParams = new URLSearchParams();

    if (filters.status) queryParams.set("status", filters.status);
    if (filters.family) queryParams.set("family", filters.family);
    if (filters.range) queryParams.set("range", filters.range);
    if (filters.collection) queryParams.set("collection", filters.collection);

    const url = `/analysis/detection-list?${queryParams.toString()}`;
    console.log("Navigating to:", url);

    // In a real app, you would use react-router
    // window.location.href = url;
    // or
    // navigate(url);

    return url;
  },
};

export default dashboardService;
