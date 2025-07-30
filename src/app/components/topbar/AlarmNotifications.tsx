import { useEffect, useRef } from "react";

interface AlarmNotificationsProps {
  onClose: () => void;
  alarmCount: number;
}

const mockAlarms = [
  {
    id: "1",
    fileName: "malware_sample.exe",
    serverIP: "192.168.1.100",
    riskLevel: "high" as const,
    malwareType: "Trojan",
    createdAt: "2024-01-29 14:30:25",
    completedAt: "2024-01-29 14:35:10"
  },
  {
    id: "2",
    fileName: "suspicious_script.js",
    serverIP: "192.168.1.101",
    riskLevel: "medium" as const,
    malwareType: "Script",
    createdAt: "2024-01-29 14:25:15",
    completedAt: undefined
  },
  {
    id: "3",
    fileName: "unknown_binary.bin",
    serverIP: "192.168.1.102",
    riskLevel: "low" as const,
    malwareType: "Unknown",
    createdAt: "2024-01-29 14:20:05",
    completedAt: "2024-01-29 14:22:30"
  }
];

function AlarmNotifications({ onClose, alarmCount }: AlarmNotificationsProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (completedAt?: string) => {
    return completedAt 
      ? <i className="ri-check-circle-line text-green-500" />
      : <i className="ri-time-line text-orange-500" />;
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Alarm Notifications
          </h3>
          <span className="text-sm text-gray-500">
            {alarmCount} total
          </span>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {mockAlarms.length > 0 ? (
          mockAlarms.map((alarm) => (
            <div key={alarm.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(alarm.completedAt)}
                    <span className="font-medium text-gray-900 text-sm">
                      {alarm.fileName}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    <div>Server IP: {alarm.serverIP}</div>
                    <div>Malware Type: {alarm.malwareType}</div>
                    <div>Created: {alarm.createdAt}</div>
                    {alarm.completedAt && (
                      <div>Completed: {alarm.completedAt}</div>
                    )}
                  </div>
                </div>

                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(alarm.riskLevel)}`}>
                  {alarm.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <i className="ri-notification-off-line text-3xl mb-2" />
            <p>No alarm notifications</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Alarms
        </button>
      </div>
    </div>
  );
}

export default AlarmNotifications;
