import React from "react";
import { Card, Space } from "antd";
import { useAppSelector } from "@/store";
import { selectServerStatus } from "@/store/dashboardSlice";

interface ServerStatusCardProps {
  loading: boolean;
}

const ServerStatusCard: React.FC<ServerStatusCardProps> = ({ loading }) => {
  const serverStatus = useAppSelector(selectServerStatus);

  return (
    <Card
      loading={loading}
      title={<Space>서버 현황</Space>}
      className="server-status-card h-full"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">
            주의 필요 서버
          </h4>

          <div className="space-y-3">
            {serverStatus?.attentionServers?.length ? (
              serverStatus.attentionServers.map(
                (server: any, index: number) => (
                  <div
                    key={index}
                    className="bg-orange-50 border border-orange-200 p-3 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          서버 IP: {server.serverIp}
                        </div>
                        <div className="text-sm text-gray-600">
                          담당자: {server.owner}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          최근 1주일 검출 빈도:
                        </div>
                        <div className="text-lg font-bold text-orange-600">
                          {server.detectionsLastWeek}건
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
                <div className="text-sm text-green-700">
                  주의가 필요한 서버가 없습니다
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServerStatusCard;
