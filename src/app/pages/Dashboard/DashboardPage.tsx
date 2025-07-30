import { Card, Row, Col, Statistic, Progress, Tag } from "antd";
import AlertNotificationPanel from "@/app/components/dashboard/AlertNotificationPanel";

function DashboardPage() {
  return (
    <div className="dashboard-page">
      {/* Alert Notification Panel - Top Priority */}
      <AlertNotificationPanel />

      <Row gutter={[24, 24]}>
        {/* Malware Trend Chart */}
        <Col xs={24} lg={16}>
          <Card title="Malware Detection Status" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Total Scans" value={312} />
              </Col>
              <Col span={8}>
                <Statistic title="Confirmed Malware" value={211} />
              </Col>
              <Col span={8}>
                <Statistic title="No Threats" value={101} />
              </Col>
            </Row>
            <div className="mt-4">
              <Progress percent={68} status="active" />
              <p className="text-sm text-gray-500 mt-2">Detection Rate</p>
            </div>
          </Card>
        </Col>

        {/* Server Health */}
        <Col xs={24} lg={8}>
          <Card title="Server Status" size="small">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <span>Connection status</span>
                  <Tag color="green">Online</Tag>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Server IP</span>
                  <span className="text-sm">192.168.1.100</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Detection frequency</span>
                  <span className="text-sm">Every 5 min</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Regular Report" size="small">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">2025.06.18</span>
                  <p className="text-sm text-gray-500">
                    Increase in network server malware detections in the past
                    month...
                  </p>
                </div>
                <Tag color="blue">Ready</Tag>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">Monthly Security Report</span>
                  <p className="text-sm text-gray-500">
                    The appearance of the Malware family has increased
                    significantly...
                  </p>
                </div>
                <Tag color="orange">Processing</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
