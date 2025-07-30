import { Card, Row, Col, Statistic, Progress, Table, Tag } from "antd";

function DashboardPage() {
  const alertsData = [
    {
      key: "1",
      time: "2024-01-29 14:30",
      file: "malware_sample.exe",
      severity: "High",
    },
    {
      key: "2", 
      time: "2024-01-29 14:25",
      file: "suspicious_script.js",
      severity: "Medium",
    },
    {
      key: "3",
      time: "2024-01-29 14:20", 
      file: "unknown_binary.bin",
      severity: "Low",
    },
  ];

  const alertColumns = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "File",
      dataIndex: "file", 
      key: "file",
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity: string) => {
        const color = severity === "High" ? "red" : severity === "Medium" ? "orange" : "green";
        return <Tag color={color}>{severity}</Tag>;
      },
    },
  ];

  return (
    <div className="dashboard-page">
      <Row gutter={[24, 24]}>
        {/* Latest Alerts Card */}
        <Col xs={24} lg={12}>
          <Card title="Latest Alerts" size="small">
            <Table
              dataSource={alertsData}
              columns={alertColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Top Files Card */}
        <Col xs={24} lg={12}>
          <Card title="Top 10 Files" size="small">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">malware_family_1.exe</span>
                <Tag color="red">High Risk</Tag>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">suspicious_app.dll</span>
                <Tag color="orange">Medium Risk</Tag>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">unknown_file.bin</span>
                <Tag color="green">Low Risk</Tag>
              </div>
            </div>
          </Card>
        </Col>

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
                    Increase in network server malware detections in the past month...
                  </p>
                </div>
                <Tag color="blue">Ready</Tag>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">Monthly Security Report</span>
                  <p className="text-sm text-gray-500">
                    The appearance of the Malware family has increased significantly...
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
