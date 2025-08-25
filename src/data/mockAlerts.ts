import { Alert } from "@/interfaces/app";

export const MOCK_LatestAlerts: Alert[] = [
  {
    id: 2011,
    client_server_ip: "192.168.1.10",
    file_name: "latest_1.elf",
    file_created_at: "2025-06-11T13:58:00Z",
    analysis_time: "2025-06-11T14:02:17Z",
    malware_status: "malware",
    process_status: "pending",
    risk: "99%",
  },
  {
    id: 2012,
    client_server_ip: "192.168.1.11",
    file_name: "latest_2.bin",
    file_created_at: "2025-06-11T11:11:00Z",
    analysis_time: "2025-06-11T11:15:45Z",
    malware_status: "clean",
    process_status: "no_action",
    risk: "1%",
  },
];

export default MOCK_LatestAlerts;
