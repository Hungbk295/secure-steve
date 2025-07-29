import Input from "@/app/components/common/Input";
import Select from "@/app/components/common/Select";
import { Col, Form, Row } from "antd";
import { useAppSelector } from "@/store";
import { selectPersonalInfo } from "@/store/personalSlice";
import { useEffect } from "react";
import RequiredLabel from "@/app/components/common/RequiredLabel";

function UserInfo() {
  const [form] = Form.useForm();
  const personalInfo = useAppSelector(selectPersonalInfo);

  useEffect(() => {
    form.setFieldsValue({
      email: personalInfo.username,
      status: personalInfo.status,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      countryCallingCode: {
        label: `+${personalInfo.countryCallingCode?.slice(1)}`,
        value: personalInfo.countryCallingCode,
      },
      phoneNumber: personalInfo.phoneNumber,
      jobTitle: personalInfo.jobTitle,
      department: personalInfo.department,
    });
  }, [personalInfo]);

  return (
    <>
      <h2 className="text-grey-80 text-xl font-bold">User Info</h2>
      <div className="mt-6">
        <Form form={form} layout="vertical">
          <Row className="text-grey-80" gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Email" name="email">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Status" name="status">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={<RequiredLabel text="Name" />}
                name="firstName"
                rules={[
                  { required: true, message: "Please enter your first name" },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="&nbsp;"
                name="lastName"
                rules={[
                  { required: true, message: "Please enter your last name" },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label={<RequiredLabel text="Phone Number" />}
                name="countryCallingCode"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Select options={[]} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="&nbsp;" name="phoneNumber">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Job title" name="jobTitle">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Department" name="department">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}

export default UserInfo;
