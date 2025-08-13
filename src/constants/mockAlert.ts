// mock/analysis.mock.ts
// ============================================================
// 1) LIST (Analysis > Detection List)
// API: GET /analysis/requests   (API-ANSI-02)
// Bảng: Time | File name | Risk | Verdict | Server IP | Process status | Exception
// ============================================================
export const MOCK_AnalysisDetectionList = [
  {
    id: 1011,
    time: "2025-06-19T23:23:00Z",
    file_name: "test.elf",
    risk: "99.5%",
    verdict: "Malware",
    server_ip: "66.211.75.1",
    process_status: "pending", // pending | no_action | quarantine | delete
    exception: "none", // none | blacklist | whitelist
  },
  {
    id: 1012,
    time: "2025-06-19T21:49:02Z",
    file_name: "benign.bin",
    risk: "0.5%",
    verdict: "Benign",
    server_ip: "66.211.75.1",
    process_status: "no_action",
    exception: "none",
  },
  {
    id: 1013,
    time: "2025-06-19T19:53:00Z",
    file_name: "trojan.elf",
    risk: "97.3%",
    verdict: "Malware",
    server_ip: "66.211.75.2",
    process_status: "pending",
    exception: "blacklist",
  },
];

// ============================================================
// 2) DETAIL (Alert Detail / Popup nửa trang)
// API: GET /analysis/requests/:id   (API-ANSI-03)
// Trả chi tiết: file info, hashes, prediction, flags…
// ============================================================
export const MOCK_AlertDetail = {
  id: 1011,
  file_name: "test.elf",
  file_type: "elf",
  file_size: 70264,
  file_path: "/srv/inbox/test.elf",
  file_created_at: "2025-06-19T23:20:00Z",
  temp_file_name: "UUID_test.elf",
  malware_status: "malware",
  analysis_time: "2025-06-19T23:23:45Z",
  analysis_result: {
    file_hash: { md5: "ab12..", sha1: "cd34..", sha256: "ef56.." },
    prediction: { label: ["malware"], proba: { malware: 0.999 } },
    similar_malware: {},
    report: {},
    yara: {},
  },
  blacklist_flag: false,
  whitelist_flag: false,
  read_flag: false,
  updated_at: "2025-06-19T23:24:30Z",
};

// Thêm vài item để test luân chuyển detail:
export const MOCK_AlertDetail_AltItems = [
  {
    id: 1012,
    file_name: "benign.bin",
    file_type: "bin",
    file_size: 12048,
    file_path: "/srv/inbox/benign.bin",
    file_created_at: "2025-06-19T21:45:00Z",
    temp_file_name: "UUID_benign.bin",
    malware_status: "clean",
    analysis_time: "2025-06-19T21:49:30Z",
    analysis_result: {
      file_hash: { md5: "11aa..", sha1: "22bb..", sha256: "33cc.." },
      prediction: { label: ["clean"], proba: { clean: 0.995 } },
      similar_malware: {},
      report: {},
      yara: {},
    },
    blacklist_flag: false,
    whitelist_flag: true,
    read_flag: true,
    updated_at: "2025-06-19T21:50:00Z",
  },
  {
    id: 1013,
    file_name: "trojan.elf",
    file_type: "elf",
    file_size: 53422,
    file_path: "/srv/inbox/trojan.elf",
    file_created_at: "2025-06-19T19:49:00Z",
    temp_file_name: "UUID_trojan.elf",
    malware_status: "malware",
    analysis_time: "2025-06-19T19:53:30Z",
    analysis_result: {
      file_hash: { md5: "aa00..", sha1: "bb11..", sha256: "cc22.." },
      prediction: { label: ["malware"], proba: { malware: 0.982 } },
      similar_malware: {},
      report: {},
      yara: {},
    },
    blacklist_flag: true,
    whitelist_flag: false,
    read_flag: false,
    updated_at: "2025-06-19T19:54:00Z",
  },
];

// ============================================================
// 3) ACTION (Process status)
// API: PUT /analysis/requests/:id/action   (API-ANSI-04)
// Body: { process_status, user_id, comments }
// ============================================================
export const MOCK_ActionRequest_Sample = {
  id: 1011,
  body: {
    process_status: "quarantined", // quarantined | deleted | no_action | pending
    user_id: 7,
    comments: "Quarantine due to high risk.",
  },
};

export const MOCK_ActionResponse_Sample = {
  id: 1011,
  file_name: "test.elf",
  process_status: "quarantined",
  updated_at: "2025-06-19T23:25:00Z",
};

// ============================================================
// 4) PENDING / COMPLETED (Tasks)
// API: GET /analysis/requests/pending   (API-ANSI-05)
// API: GET /analysis/requests/completed (API-ANSI-07)
// ============================================================
export const MOCK_TasksPending = [
  {
    id: 1014,
    time: "2025-06-19T15:25:00Z",
    file_name: "scanA.elf",
    risk: "99.2%",
    verdict: "Malware",
    server_ip: "66.211.75.1",
    process_status: "pending",
  },
  {
    id: 1015,
    time: "2025-06-19T11:13:00Z",
    file_name: "scanB.elf",
    risk: "98.1%",
    verdict: "Malware",
    server_ip: "66.211.75.1",
    process_status: "pending",
  },
];

export const MOCK_TasksCompleted = [
  {
    id: 1001,
    time: "2025-06-16T23:23:00Z",
    file_name: "done1.elf",
    risk: "99.5%",
    verdict: "Malware",
    server_ip: "66.211.75.1",
    process_status: "delete",
    actioned_by: "홍길동",
  },
  {
    id: 1002,
    time: "2025-06-16T21:49:00Z",
    file_name: "done2.bin",
    risk: "0.5%",
    verdict: "Benign",
    server_ip: "66.211.75.1",
    process_status: "no_action",
    actioned_by: "김철수",
  },
];

// ============================================================
// 5) LATEST / TOP / STATS (Topbar & Dashboard)
// API: GET /analysis/requests/latest   (API-DASH-01)
// API: GET /analysis/requests/top      (API-DASH-02)
// API: GET /analysis/requests/stats/scans (API-DASH-03)
// ============================================================
export const MOCK_LatestAlerts = [
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

export const MOCK_TopAlerts = [
  {
    id: 3011,
    client_server_ip: "192.168.1.20",
    file_name: "top_1.elf",
    file_created_at: "2025-06-10T10:00:00Z",
    analysis_time: "2025-06-10T10:05:10Z",
    malware_status: "malware",
    process_status: "pending",
    risk: "98%",
  },
  {
    id: 3012,
    client_server_ip: "192.168.1.21",
    file_name: "top_2.exe",
    file_created_at: "2025-06-09T09:30:00Z",
    analysis_time: "2025-06-09T09:34:55Z",
    malware_status: "malware",
    process_status: "pending",
    risk: "97%",
  },
];

export const MOCK_ScanStats_30d = {
  // Time Range (30 days) widget
  // scanned / suspicious / no_threat / action_completed
  scanned: 312,
  suspicious: 211,
  no_threat: 101,
  action_completed: 200,
};

// ============================================================
// 6) FILE POLICIES (Exception: Blacklist/Whitelist)
// API: POST /file-policies   (API-POL-01)
// - Blacklist cần chọn action_type: delete | quarantine
// - Whitelist không cần action_type, implicitly no_action
// ============================================================
export const MOCK_FilePolicyRequest_Blacklist = {
  analysis_request_id: 1013,
  file_policy: "blacklist",
  action_type: "quarantine", // hoặc "delete"
  comments: "Skip future analysis and quarantine on detection.",
};

export const MOCK_FilePolicyRequest_Whitelist = {
  analysis_request_id: 1012,
  file_policy: "whitelist",
  comments: "Trusted source; skip future analysis.",
};

export const MOCK_FilePolicyResponse_Sample = {
  file_name: "trojan.elf",
  hash_sha256: "9be97782db221e7b90b53725b...",
  policy: "blacklist",
  action_type: "quarantine",
  applied_at: "2025-06-19T20:00:00Z",
};

export const MOCK_ActionPending_Analysis = [
  {
    time: "19 June 25 | 23:23",
    file_name: "invoice2025.exe",
    risk: "99.5%",
    verdict: "Malware",
    server_ip: "66.211.75.1",
  },
  {
    time: "19 June 25 | 21:49",
    file_name: "readme.txt",
    risk: "0.5%",
    verdict: "Benign",
    server_ip: "66.211.75.1",
  },
  {
    time: "19 June 25 | 19:53",
    file_name: "clientdata.elf",
    risk: "97.3%",
    verdict: "Malware",
    server_ip: "66.211.75.1",
  },
  {
    time: "19 June 25 | 15:25",
    file_name: "update_patch.bin",
    risk: "99.2%",
    verdict: "Malware",
    server_ip: "66.211.75.1",
  },
  {
    time: "19 June 25 | 11:13",
    file_name: "config.yml",
    risk: "98.1%",
    verdict: "Malware",
    server_ip: "66.211.75.1",
  },
  {
    time: "19 June 25 | 09:59",
    file_name: "manual_v2.pdf",
    risk: "3.2%",
    verdict: "Benign",
    server_ip: "66.211.75.1",
  },
  {
    time: "19 June 25 | 00:11",
    file_name: "core_dump.log",
    risk: "72.3%",
    verdict: "Malware",
    server_ip: "66.211.75.2",
  },
  {
    time: "18 June 25 | 22:05",
    file_name: "setup.exe",
    risk: "97.3%",
    verdict: "Malware",
    server_ip: "66.211.75.2",
  },
  {
    time: "18 June 25 | 04:03",
    file_name: "debug_info.dat",
    risk: "87.3%",
    verdict: "Malware",
    server_ip: "66.211.75.2",
  },
  {
    time: "17 June 25 | 14:01",
    file_name: "presentation.pptx",
    risk: "81.3%",
    verdict: "Malware",
    server_ip: "66.211.75.2",
  },
];

export const MOCK_ActionCompleted_Analysis = [
  {
    time: "16 June 25 | 23:23",
    file_name: "invoice2025.exe",
    risk: "99.5%",
    verdict: "Malware",
    server_ip: "66.211.75.1",
    process_status: "delete",
    actioned_by: "Hong Gil-dong",
  },
  {
    time: "16 June 25 | 21:49",
    file_name: "readme.txt",
    risk: "0.5%",
    verdict: "Benign",
    server_ip: "66.211.75.1",
    process_status: "no_action",
    actioned_by: "Hong Gil-dong",
  },
  {
    time: "16 June 25 | 19:53",
    file_name: "clientdata.elf",
    risk: "97.3%",
    verdict: "Malware",
    server_ip: "66.211.75.1",
    process_status: "delete",
    actioned_by: "Kim Chul-soo",
  },
  {
    time: "16 June 25 | 09:59",
    file_name: "manual_v2.pdf",
    risk: "3.2%",
    verdict: "Benign",
    server_ip: "66.211.75.1",
    process_status: "no_action",
    actioned_by: "Hong Gil-dong",
  },
  {
    time: "16 June 25 | 00:11",
    file_name: "core_dump.log",
    risk: "72.3%",
    verdict: "Malware",
    server_ip: "66.211.75.2",
    process_status: "quarantine",
    actioned_by: "Hong Gil-dong",
  },
  {
    time: "15 June 25 | 22:05",
    file_name: "setup.exe",
    risk: "97.3%",
    verdict: "Malware",
    server_ip: "66.211.75.2",
    process_status: "delete",
    actioned_by: "Kim Chul-soo",
  },
  {
    time: "15 June 25 | 04:03",
    file_name: "debug_info.dat",
    risk: "87.3%",
    verdict: "Malware",
    server_ip: "66.211.75.2",
    process_status: "pending",
    actioned_by: "Kim Chul-soo",
  },
  {
    time: "14 June 25 | 14:01",
    file_name: "presentation.pptx",
    risk: "81.3%",
    verdict: "Malware",
    server_ip: "66.211.75.2",
    process_status: "no_action",
    actioned_by: "Hong Gil-dong",
  },
  {
    time: "14 June 25 | 10:12",
    file_name: "upgrade_patch.bin",
    risk: "65.0%",
    verdict: "Suspicious",
    server_ip: "66.211.75.3",
    process_status: "quarantine",
    actioned_by: "Kim Chul-soo",
  },
  {
    time: "13 June 25 | 18:30",
    file_name: "service.dll",
    risk: "92.6%",
    verdict: "Malware",
    server_ip: "66.211.75.3",
    process_status: "delete",
    actioned_by: "Hong Gil-dong",
  },
  {
    time: "13 June 25 | 08:45",
    file_name: "notes.md",
    risk: "1.1%",
    verdict: "Benign",
    server_ip: "66.211.75.1",
    process_status: "no_action",
    actioned_by: "System",
  },
  {
    time: "12 June 25 | 20:05",
    file_name: "agent_update.pkg",
    risk: "54.2%",
    verdict: "Suspicious",
    server_ip: "66.211.75.4",
    process_status: "pending",
    actioned_by: "System",
  },
];

export const MOCK_SettingPolicy_1 = [
  {
    server_id: "srv-001",
    server_ip: "66.211.75.1",
    server_cluster: "미지정",
    manager: { id: "u001", name: "홍길동", dept: "보안" },
    last_malware_detected_at: "2025-06-16T20:23:00",
  },
  {
    server_id: "srv-002",
    server_ip: "66.211.75.2",
    server_cluster: "네트워크",
    manager: { id: "u002", name: "김철수", dept: "서비스" },
    last_malware_detected_at: "2025-06-16T17:23:00",
  },
  {
    server_id: "srv-003",
    server_ip: "66.211.75.3",
    server_cluster: "서비스",
    manager: { id: "u003", name: "아무개", dept: "시스템 운영팀" },
    last_malware_detected_at: "2025-06-16T14:23:00",
  },
  {
    server_id: "srv-004",
    server_ip: "66.211.75.4",
    server_cluster: "ERP",
    manager: { id: "u001", name: "홍길동", dept: "보안" },
    last_malware_detected_at: "2025-06-16T11:23:00",
  },
  {
    server_id: "srv-005",
    server_ip: "66.211.75.5",
    server_cluster: "CRM",
    manager: { id: "u002", name: "김철수", dept: "서비스" },
    last_malware_detected_at: "2025-06-16T08:23:00",
  },
  {
    server_id: "srv-006",
    server_ip: "66.211.75.6",
    server_cluster: "보안",
    manager: { id: "u003", name: "아무개", dept: "시스템 운영팀" },
    last_malware_detected_at: "2025-06-16T05:23:00",
  },
  {
    server_id: "srv-007",
    server_ip: "66.211.75.7",
    server_cluster: "내부 서비스",
    manager: { id: "u001", name: "홍길동", dept: "보안" },
    last_malware_detected_at: "2025-06-16T02:23:00",
  },
  {
    server_id: "srv-008",
    server_ip: "66.211.75.8",
    server_cluster: "미지정",
    manager: { id: "u002", name: "김철수", dept: "서비스" },
    last_malware_detected_at: "2025-06-15T23:23:00",
  },
  {
    server_id: "srv-009",
    server_ip: "66.211.75.9",
    server_cluster: "네트워크",
    manager: { id: "u003", name: "아무개", dept: "시스템 운영팀" },
    last_malware_detected_at: "2025-06-15T20:23:00",
  },
  {
    server_id: "srv-010",
    server_ip: "66.211.75.10",
    server_cluster: "서비스",
    manager: { id: "u001", name: "홍길동", dept: "보안" },
    last_malware_detected_at: "2025-06-15T17:23:00",
  },
];
