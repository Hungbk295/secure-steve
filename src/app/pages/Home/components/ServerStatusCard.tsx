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
        {/* Connection Status */}
        {/* <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">연결 현황</h4>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">연결 서버:</span>
              <span className="text-lg font-bold text-gray-900">
                {serverStatus?.connectedServers || 0}개
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">통신 상태:</span>
              <Badge
                status={healthStatus.color as any}
                text={
                  <span
                    className={`text-sm ${
                      healthStatus.color === "green"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {healthStatus.text}
                  </span>
                }
              />
            </div>

            {serverStatus?.health && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <CheckCircleOutlined className="text-green-500" />
                      <span className="text-sm text-gray-600">정상</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {serverStatus.health.normal}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <ExclamationCircleOutlined className="text-red-500" />
                      <span className="text-sm text-gray-600">이상</span>
                    </div>
                    <div className="text-lg font-bold text-red-600">
                      {serverStatus.health.issue}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div> */}

        {/* <Divider className="my-4" /> */}

        {/* Attention Required Servers */}
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
