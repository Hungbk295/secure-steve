import { useEffect } from "react";
import { Row, Col, Form, Button as AntdButton } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import Select from "@/app/components/common/Select";
import CustomDatePicker from "@/app/components/common/CustomDatePicker";
import { DynamicKeyObject } from "@/interfaces/app";
import { useAppDispatch } from "@/store";
import { actionGetServerSettingsList } from "@/store/settingServerPolicySlice";
import Input from "../../common/Input";
import Button from "../../common/Button";

interface ServerSettingsFilterBarProps {
  loading?: boolean;
  className?: string;
}

const initialFormData = {
  clusterName: "all",
  serverManager: "all",
  settingType: "all",
  timeRange: null,
  searchText: "",
};

function ServerSettingsFilterBar({
  loading = false,
  className,
}: ServerSettingsFilterBarProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  function getPayload(values: DynamicKeyObject) {
    const { clusterName, serverManager, settingType, timeRange, searchText } =
      values;

    const payload = {
      clusterName: clusterName === "all" ? "" : clusterName,
      serverManager: serverManager === "all" ? "" : serverManager,
      settingType: settingType === "all" ? "" : settingType,
      timeRange:
        timeRange && timeRange.length === 2
          ? [
              timeRange[0].format("YYYY-MM-DD"),
              timeRange[1].format("YYYY-MM-DD"),
            ]
          : null,
      searchText: searchText || "",
    };
    return payload;
  }

  function onFinish(values: DynamicKeyObject) {
    const payload = getPayload(values);
    dispatch(actionGetServerSettingsList(payload));
  }

  function onReset() {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    dispatch(actionGetServerSettingsList(payload));
  }

  useEffect(() => {
    form.setFieldsValue(initialFormData);
    const payload = getPayload(initialFormData);
    dispatch(actionGetServerSettingsList(payload));
  }, [dispatch]);

  const clusterNameOptions = [
    { label: "All", value: "all" },
    { label: "ERP시스템", value: "ERP시스템" },
    { label: "보안관리", value: "보안관리" },
    { label: "내부서비스", value: "내부서비스" },
    { label: "백업시스템", value: "백업시스템" },
    { label: "메인고객서비스", value: "메인고객서비스" },
  ];

  const serverManagerOptions = [
    { label: "All", value: "all" },
    { label: "최상", value: "최상" },
    { label: "높음", value: "높음" },
    { label: "보통", value: "보통" },
    { label: "낮음", value: "낮음" },
  ];

  const settingTypeOptions = [
    { label: "All", value: "all" },
    { label: "Realtime Scan", value: "realtime" },
    { label: "Scheduled Scan", value: "scheduled" },
    { label: "Online Status", value: "online" },
    { label: "Offline Status", value: "offline" },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className={className}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label="Cluster Name" name="clusterName">
            <Select
              placeholder="Cluster Name"
              showSearch
              options={clusterNameOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Server Manager" name="serverManager">
            <Select
              placeholder="Server Manager"
              showSearch
              options={serverManagerOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Setting Type" name="settingType">
            <Select
              placeholder="Setting Type"
              showSearch
              options={settingTypeOptions}
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Form.Item label="Time Range" name="timeRange">
            <CustomDatePicker
              form={form}
              showTime={false}
              name="timeRange"
              showQuickPicker={false}
              placeholder={["Start Time", "End Time"]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} md={6} lg={4}>
          <Form.Item label="Search IP/Text" name="searchText">
            <Input
              placeholder="Search by IP or Text"
              className="w-full"
              size="middle"
              disabled={loading}
            />
          </Form.Item>
        </Col>

        {/* Action Buttons */}
        <Col xs={24} sm={24} md={6} lg={4}>
          <div className="filter-actions flex justify-end space-x-2 flex-1">
            <AntdButton
              className="!h-[45px] !w-12"
              type="default"
              icon={<ReloadOutlined />}
              onClick={onReset}
              disabled={loading}
            />
            <Button
              className="!h-[45px] !w-[240px]"
              type="primary"
              icon={<SearchOutlined />}
              htmlType="submit"
              loading={loading}
            >
              Apply
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default ServerSettingsFilterBar;
