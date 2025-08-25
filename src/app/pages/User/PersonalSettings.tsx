import CustomButton from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import RequiredLabel from "@/app/components/common/RequiredLabel";
import Select from "@/app/components/common/Select";
import IconLock from "@/assets/svgs/lock.svg";
import { useAppDispatch, useAppSelector } from "@/store";
import { actionToggleChangePasswordModal } from "@/store/appSlide";
import { selectInfoLogin } from "@/store/authSlide";
import { validatorRequiredFormItem } from "@/utils/formValidators";
import { Col, Form, Row } from "antd";

function PersonalSettings() {
  const dispatch = useAppDispatch();
  const infoLogin = useAppSelector(selectInfoLogin);
  const [form] = Form.useForm();

  const handleOpenChangePasswordModal = () => {
    dispatch(
      actionToggleChangePasswordModal({
        isOpen: true,
        role: infoLogin.role,
        username: infoLogin.email,
        accessToken: infoLogin.accessToken,
      })
    );
  };

  return (
    <div className="w-[945px]">
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl text-grey-80 leading-custom-normal">
          Personal settings
        </h1>
        <CustomButton type="primary" disabled>
          Save changes
        </CustomButton>
      </div>
      <div className="mt-4 bg-white pt-4 px-6 pb-8 rounded-lg border border-grey-10">
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
                  rules={[validatorRequiredFormItem]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="&nbsp;"
                  name="lastName"
                  rules={[validatorRequiredFormItem]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label={<RequiredLabel text="Phone Number" />}
                  name="countryCallingCode"
                  rules={[validatorRequiredFormItem]}
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
        <CustomButton
          className="mt-6 !text-xs !h-[26px] !py-1 !px-2"
          theme="black"
          variant="outlined"
          onClick={handleOpenChangePasswordModal}
        >
          <div className="flex items-center gap-1">
            Change Password <IconLock className="w-3 h-3" />
          </div>
        </CustomButton>
      </div>
    </div>
  );
}

export default PersonalSettings;
