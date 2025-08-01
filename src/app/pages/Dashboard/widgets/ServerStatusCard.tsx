import { Card, Avatar, Typography, Tag, Badge, Statistic, Button, Dropdown, Modal, message } from "antd";
import { useState } from "react";
import { UserOutlined, MoreOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;

interface ServerData {
  id: string;
  serverIp: string;
  manager: string;
  connection: 'normal' | 'abnormal';
  needsAttention: boolean;
  detectionFreq7d: number;
}

interface ServerStatusCardProps {
  data?: ServerData[];
  onServerClick?: (serverId: string) => void;
  onRetryPing?: (serverId: string) => void;
  onCreateTicket?: (serverId: string) => void;
}

const DEFAULT_DATA: ServerData[] = [
  {
    id: "server-001",
    serverIp: "192.168.1.100",
    manager: "김관리자",
    connection: "normal",
    needsAttention: false,
    detectionFreq7d: 0
  },
  {
    id: "server-002", 
    serverIp: "192.168.1.101",
    manager: "이담당자",
    connection: "abnormal",
    needsAttention: true,
    detectionFreq7d: 5
  }
];

function ServerStatusCard({
  data = DEFAULT_DATA,
  onServerClick,
  onRetryPing,
  onCreateTicket
}: ServerStatusCardProps) {
  const [showAttentionOnly, setShowAttentionOnly] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const filteredData = showAttentionOnly 
    ? data.filter(server => server.needsAttention)
    : data;

  const handleServerClick = (server: ServerData) => {
    setSelectedServer(server);
    setIsDetailModalVisible(true);
    onServerClick?.(server.id);
  };

  const handleRetryPing = (server: ServerData) => {
    Modal.confirm({
      title: 'Retry Ping',
      icon: <ExclamationCircleOutlined />,
      content: `서버 ${server.serverIp}에 대해 연결을 재시도하시겠습니까?`,
      onOk() {
        onRetryPing?.(server.id);
        message.success('Ping 재시도가 시작되었습니다.');
      },
    });
  };

  const handleCreateTicket = (server: ServerData) => {
    Modal.confirm({
      title: 'Create Support Ticket',
      icon: <ExclamationCircleOutlined />,
      content: `서버 ${server.serverIp}에 대한 지원 티켓을 생성하시겠습니까?`,
      onOk() {
        onCreateTicket?.(server.id);
        message.success('지원 티켓이 생성되었습니다.');
      },
    });
  };

  const getContextMenuItems = (server: ServerData) => [
    {
      key: 'detail',
      label: '서버 상세 정보',
      onClick: () => handleServerClick(server)
    },
    {
      key: 'retry',
      label: 'Ping 재시도',
      onClick: () => handleRetryPing(server)
    },
    {
      key: 'ticket',
      label: '지원 티켓 생성',
      onClick: () => handleCreateTicket(server)
    }
  ];

  const renderServerItem = (server: ServerData) => (
    <div 
      key={server.id}
      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer"
      onClick={() => handleServerClick(server)}
    >
      <div className="flex items-center space-x-3 flex-1">
        <Badge dot={server.needsAttention} color="red">
          <Avatar 
            size="small" 
            icon={<UserOutlined />}
            className="bg-blue-500"
          />
        </Badge>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Link 
              className="font-medium text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleServerClick(server);
              }}
            >
              {server.serverIp}
            </Link>
            <Tag 
              color={server.connection === 'normal' ? 'green' : 'red'}
              className="text-xs"
            >
              {server.connection === 'normal' ? '정상' : '이상'}
            </Tag>
          </div>
          <Text type="secondary" className="text-xs">
            담당자: {server.manager}
          </Text>
        </div>
        
        <div className="text-right">
          <Statistic
            value={server.detectionFreq7d}
            suffix="건"
            className="text-xs"
            valueStyle={{ fontSize: '12px', color: server.detectionFreq7d > 0 ? '#ff4d4f' : '#52c41a' }}
          />
          <Text type="secondary" className="text-xs">
            최근 1주일 검출 빈도
          </Text>
        </div>
      </div>
      
      <Dropdown
        menu={{ items: getContextMenuItems(server) }}
        trigger={['click']}
        placement="bottomRight"
      >
        <Button 
          type="text" 
          icon={<MoreOutlined />} 
          size="small"
          onClick={(e) => e.stopPropagation()}
        />
      </Dropdown>
    </div>
  );

  return (
    <>
      <Card 
        title="서버 현황" 
        size="small"
        extra={
          <Button
            type={showAttentionOnly ? "primary" : "default"}
            size="small"
            onClick={() => setShowAttentionOnly(!showAttentionOnly)}
          >
            주의 필요만 보기
          </Button>
        }
      >
        <div className="space-y-1">
          {filteredData.length > 0 ? (
            filteredData.map(renderServerItem)
          ) : (
            <div className="text-center py-8 text-gray-500">
              {showAttentionOnly ? '주의가 필요한 서버가 없습니다.' : '서버 데이터가 없습니다.'}
            </div>
          )}
        </div>
      </Card>

      {/* Server Detail Modal */}
      <Modal
        title={`서버 상세 정보 - ${selectedServer?.serverIp}`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            닫기
          </Button>,
          <Button 
            key="retry" 
            type="primary" 
            onClick={() => selectedServer && handleRetryPing(selectedServer)}
          >
            Ping 재시도
          </Button>
        ]}
      >
        {selectedServer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong>서버 IP:</Text>
                <div>{selectedServer.serverIp}</div>
              </div>
              <div>
                <Text strong>담당자:</Text>
                <div>{selectedServer.manager}</div>
              </div>
              <div>
                <Text strong>연결 상태:</Text>
                <div>
                  <Tag color={selectedServer.connection === 'normal' ? 'green' : 'red'}>
                    {selectedServer.connection === 'normal' ? '정상' : '이상'}
                  </Tag>
                </div>
              </div>
              <div>
                <Text strong>주의 필요:</Text>
                <div>
                  <Tag color={selectedServer.needsAttention ? 'orange' : 'green'}>
                    {selectedServer.needsAttention ? '예' : '아니오'}
                  </Tag>
                </div>
              </div>
            </div>
            <div>
              <Text strong>최근 7일 검출 빈도:</Text>
              <div className="mt-2">
                <Statistic
                  value={selectedServer.detectionFreq7d}
                  suffix="건"
                  valueStyle={{ 
                    color: selectedServer.detectionFreq7d > 0 ? '#ff4d4f' : '#52c41a' 
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default ServerStatusCard;
