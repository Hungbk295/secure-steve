// Mock data for testing the server assignment functionality
export const mockServers = [
  {
    id: '1',
    serverIP: '192.168.1.100',
    serverCluster: 'Production-A',
    serverOwner: 'Hong Gil-dong',
    recentMalwareDetections: 16,
    department: 'IT Department',
    lastDetectionDate: '2025-01-30',
  },
  {
    id: '2',
    serverIP: '192.168.1.101',
    serverCluster: 'Development',
    serverOwner: 'Kim Cheol-su',
    recentMalwareDetections: 0,
    department: 'Development',
    lastDetectionDate: null,
  },
  {
    id: '3',
    serverIP: '192.168.1.102',
    serverCluster: 'Production-B',
    serverOwner: 'Lee Young-hee',
    recentMalwareDetections: 3,
    department: 'Operations',
    lastDetectionDate: '2025-01-29',
  },
  {
    id: '4',
    serverIP: '192.168.1.103',
    serverCluster: 'Testing',
    serverOwner: 'Park Min-jun',
    recentMalwareDetections: 0,
    department: 'QA',
    lastDetectionDate: null,
  },
  {
    id: '5',
    serverIP: '192.168.1.104',
    serverCluster: 'Production-A',
    serverOwner: 'Choi Soo-jin',
    recentMalwareDetections: 8,
    department: 'IT Department',
    lastDetectionDate: '2025-01-30',
  },
];

export const mockClusters = [
  { label: 'Production-A', value: 'production-a' },
  { label: 'Production-B', value: 'production-b' },
  { label: 'Development', value: 'development' },
  { label: 'Testing', value: 'testing' },
  { label: 'Staging', value: 'staging' },
];

export const mockManagers = [
  {
    id: 'mgr-1',
    name: 'Hong Gil-dong',
    department: 'IT Department',
    role: 'Administrator',
    currentServerCount: 12,
  },
  {
    id: 'mgr-2',
    name: 'Kim Cheol-su',
    department: 'Development',
    role: 'User',
    currentServerCount: 8,
  },
  {
    id: 'mgr-3',
    name: 'Lee Young-hee',
    department: 'Operations',
    role: 'Administrator',
    currentServerCount: 15,
  },
  {
    id: 'mgr-4',
    name: 'Park Min-jun',
    department: 'QA',
    role: 'User',
    currentServerCount: 5,
  },
  {
    id: 'mgr-5',
    name: 'Choi Soo-jin',
    department: 'Security',
    role: 'Administrator',
    currentServerCount: 20,
  },
];

// Mock API responses
export const mockApiResponses = {
  servers: {
    data: {
      servers: mockServers,
      total: mockServers.length,
    },
  },
  clusters: {
    data: {
      clusters: mockClusters,
    },
  },
  managers: {
    data: {
      managers: mockManagers,
    },
  },
  clusterCheck: {
    data: {
      exists: false,
    },
  },
  assignSuccess: {
    data: {
      success: true,
      message: 'Assignment completed successfully',
    },
  },
};
