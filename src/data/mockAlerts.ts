import { Alert } from "@/interfaces/app";

/**
 * Enhanced mock data for security alerts - 5 realistic scenarios
 * This data simulates real-world security threats and responses
 */
export const mockAlertsData: Alert[] = [
  {
    id: "ALT-2025-001",
    file_name: "PayrollUpdate_Q4.exe",
    client_server_ip: "192.168.10.45",
    file_created_at: "2025-01-11T09:35:24Z",
    analysis_time: "09:37",
    malware_status: "detected",
    process_status: "pending",
    risk: 94.7,
    alert_name: "Critical Malware Detection",
    malware_type: "Ransomware",
    verdict: "Malware",
  },
  {
    id: "ALT-2025-003",
    file_name: "document_scanner.bat",
    client_server_ip: "192.168.10.67",
    file_created_at: "2025-01-11T09:22:48Z",
    analysis_time: "09:24",
    malware_status: "suspicious",
    process_status: "pending",
    risk: 73.2,
    alert_name: "Suspicious Script Activity",
    malware_type: "Script/Batch",
    verdict: "Suspicious",
  },
  {
    id: "ALT-2025-004",
    file_name: "system_backup.zip",
    client_server_ip: "192.168.10.91",
    file_created_at: "2025-01-11T09:15:33Z",
    analysis_time: "09:18",
    malware_status: "clean",
    process_status: "quarantine",
    risk: 12.4,
    alert_name: "Policy Violation - Encrypted Archive",
    malware_type: "Archive",
    verdict: "Benign",
  },
  {
    id: "ALT-2025-005",
    file_name: "NetworkTool_cracked.exe",
    client_server_ip: "192.168.10.156",
    file_created_at: "2025-01-11T09:08:17Z",
    analysis_time: "09:12",
    malware_status: "detected",
    process_status: "delete",
    risk: 89.6,
    alert_name: "Malicious Tool Detection",
    malware_type: "Trojan/Tool",
    verdict: "Malware",
  },
];

/**
 * Extended mock data for testing pagination and larger datasets
 */
export const extendedMockAlerts: Alert[] = [
  ...mockAlertsData,
  {
    id: "ALT-2025-006",
    file_name: "office_macro_doc.docx",
    client_server_ip: "192.168.10.201",
    file_created_at: "2025-01-11T08:55:12Z",
    analysis_time: "08:57",
    malware_status: "suspicious",
    process_status: "pending",
    risk: 68.4,
    alert_name: "Suspicious Macro Document",
    malware_type: "Macro/VBA",
    verdict: "Suspicious",
  },
  {
    id: "ALT-2025-007",
    file_name: "windows_update_kb5043.msu",
    client_server_ip: "192.168.10.88",
    file_created_at: "2025-01-11T08:42:30Z",
    analysis_time: "08:44",
    malware_status: "clean",
    process_status: "no_action",
    risk: 1.2,
    alert_name: "System Update Package",
    malware_type: "System File",
    verdict: "Benign",
  },
  {
    id: "ALT-2025-008",
    file_name: "temp_cleaner_pro.exe",
    client_server_ip: "192.168.10.134",
    file_created_at: "2025-01-11T08:38:45Z",
    analysis_time: "08:41",
    malware_status: "detected",
    process_status: "pending",
    risk: 82.7,
    alert_name: "Potentially Unwanted Program",
    malware_type: "PUP/Adware",
    verdict: "Malware",
  },
];

/**
 * Mock response for API simulation
 */
export const mockLatestAlertsResponse = {
  data: mockAlertsData,
  total_count: mockAlertsData.length,
  pending_count: mockAlertsData.filter(
    (alert) => alert.process_status === "pending"
  ).length,
};

/**
 * Utility function to generate random mock alerts for testing
 */
export const generateRandomAlert = (id: string): Alert => {
  const fileNames = [
    "invoice_2025.pdf.exe",
    "system_driver.dll",
    "photo_viewer.scr",
    "backup_tool.bat",
    "game_crack.exe",
    "document.pdf.js",
    "installer.msi",
    "update_patch.exe",
    "media_player.exe",
    "security_scan.vbs",
  ];

  const malwareTypes = [
    "Trojan",
    "Ransomware",
    "Script",
    "PUP",
    "Adware",
    "Rootkit",
    "Worm",
    "Spyware",
  ];
  const verdicts: Array<"Malware" | "Benign" | "Suspicious"> = [
    "Malware",
    "Benign",
    "Suspicious",
  ];
  const processStatuses = [
    "pending",
    "no_action",
    "quarantine",
    "delete",
  ] as const;

  const fileName = fileNames[Math.floor(Math.random() * fileNames.length)];
  const malwareType =
    malwareTypes[Math.floor(Math.random() * malwareTypes.length)];
  const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
  const processStatus =
    processStatuses[Math.floor(Math.random() * processStatuses.length)];
  const risk = Math.random() * 100;

  const now = new Date();
  const createdAt = new Date(now.getTime() - Math.random() * 3600000); // Random time in last hour
  const analysisMinutes = Math.floor(Math.random() * 10) + 2; // 2-12 minutes after creation

  return {
    id,
    file_name: fileName,
    client_server_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
      Math.random() * 255
    )}`,
    file_created_at: createdAt.toISOString(),
    analysis_time:
      String(createdAt.getHours()).padStart(2, "0") +
      ":" +
      String(createdAt.getMinutes() + analysisMinutes).padStart(2, "0"),
    malware_status:
      verdict === "Malware"
        ? "detected"
        : verdict === "Benign"
        ? "clean"
        : "suspicious",
    process_status: processStatus,
    risk: Number(risk.toFixed(1)),
    alert_name: `${verdict} Detection`,
    malware_type: malwareType,
    verdict: verdict,
  };
};

export default mockAlertsData;
