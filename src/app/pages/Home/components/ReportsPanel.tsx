import React from "react";
import { Card, List, Typography, Space } from "antd";
import { FileTextOutlined, CalendarOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/store";
import { selectReports } from "@/store/dashboardSlice";

const { Text, Paragraph } = Typography;

interface ReportsPanelProps {
  loading: boolean;
}

const ReportsPanel: React.FC<ReportsPanelProps> = ({ loading }) => {
  const reports = useAppSelector(selectReports);

  const handleReportClick = (report: any) => {
    console.log("Navigate to report detail:", report);
  };

  return (
    <Card
      loading={loading}
      title={
        <Space>
          <FileTextOutlined />
          리포트
        </Space>
      }
      className="reports-panel-card h-full"
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center">
            <CalendarOutlined className="mr-2" />
            정기 리포트
          </h4>

          <List
            className="regular-reports-list"
            dataSource={reports?.regular || []}
            renderItem={(report, index) => (
              <List.Item
                key={index}
                className="hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                onClick={() => handleReportClick(report)}
              >
                <div className="w-full">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Text className="text-sm font-medium text-blue-600">
                          {report.date}
                        </Text>
                        <FileTextOutlined className="text-gray-400 text-xs" />
                      </div>
                      <Paragraph
                        className="text-sm text-gray-700 mb-0"
                        ellipsis={{ rows: 2, expandable: false }}
                      >
                        {report.title}
                      </Paragraph>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Text className="text-xs text-gray-400">
                        자세히 보기 →
                      </Text>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
            locale={{
              emptyText: (
                <div className="text-center py-8">
                  <FileTextOutlined className="text-4xl text-gray-300 mb-2" />
                  <div className="text-gray-500">정기 리포트가 없습니다</div>
                </div>
              ),
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ReportsPanel;
