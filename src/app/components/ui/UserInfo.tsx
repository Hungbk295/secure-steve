import Input from "@/app/components/common/Input";
import RequiredLabel from "@/app/components/common/RequiredLabel";
import Select from "@/app/components/common/Select";
import { Col, Divider, Form, FormInstance, Row } from "antd";
import AccountDetailGeneral from "./AccountDetailGeneral";
import {
  DynamicKeyObject,
  EModalMode,
  ENotificationType,
  EUserRole,
} from "@/interfaces/app";
import CustomButton from "@/app/components/common/Button";
import { EAccountDetailGeneralSize, EUserInfoType } from "@/interfaces/account";
import {
  COUNTRY_CALLING_CODE_OPTIONS,
  MST,
  ROLE_TYPE,
} from "@/constants/options";
import { isEmpty } from "lodash";
import { pageLoading, notify } from "@/utils/appStateHandle";
import { useAppSelector } from "@/store";
import { selectInfoLogin } from "@/store/authSlide";
import request from "@/utils/request";

interface IUserInfoProps {
  form: FormInstance<any>;
  detailData?: DynamicKeyObject;
  type: EUserInfoType;
  role: EUserRole;
}

function UserInfo(props: IUserInfoProps) {
  const { form, detailData = {}, type, role } = props;
  const { createdAt, createdBy, updatedAt, updatedBy, lastAccessedAt } =
    detailData;
  const infoLogin = useAppSelector(selectInfoLogin);

  const handleResetPassword = () => {
    const email = form.getFieldValue("email");
    pageLoading.on();
    request({
      url: `/api/${infoLogin.role}/account/${role}/token`,
      method: "POST",
      data: { username: email },
    })
      .then(() => {
        notify({
          message: "The verification email has been successfully sent.",
          type: ENotificationType.SUCCESS,
          mode: EModalMode.SINGLE,
        });
      })
      .finally(() => pageLoading.off());
  };

  return (
    <div className="border border-grey-10 rounded-md pt-4 px-6 pb-8 bg-white text-grey-80">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">User Info</h2>
        {type === EUserInfoType.DETAIL && (
          <CustomButton
            variant="outlined"
            theme="black"
            className="!h-8 !text-xs !px-2"
            onClick={() =>
              notify({
                message: "Would you like to reset the password?",
                type: ENotificationType.WARNING,
                onOk: handleResetPassword,
              })
            }
          >
            Password Reset
          </CustomButton>
        )}
      </div>
      <Divider />
      <div className="mt-6">
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={<RequiredLabel text="Email(ID)" />}
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  placeholder="Please enter email"
                  disabled={type === EUserInfoType.DETAIL}
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item
                label={<RequiredLabel text="Phone Number" />}
                name="countryCallingCode"
                initialValue="+82"
              >
                <Select options={COUNTRY_CALLING_CODE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item
                label="&nbsp;"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input
                  placeholder="Please enter phone number"
                  onChange={(e) =>
                    form.setFieldValue(
                      "phoneNumber",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<RequiredLabel text="Department" />}
                name="department"
                rules={[{ required: true, message: "Please enter department" }]}
              >
                <Input placeholder="Please enter department" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Job title" name="jobTitle">
                <Input placeholder="Please enter job title" />
              </Form.Item>
            </Col>
            {role !== EUserRole.MASTER && role !== EUserRole.LUNA_ADMIN && (
              <Col span={12}>
                <Form.Item
                  label={<RequiredLabel text="Role" />}
                  name="role"
                  rules={[{ required: true, message: "Please select role" }]}
                  initialValue={EUserRole.ADMIN}
                >
                  <Select options={ROLE_TYPE} />
                </Form.Item>
              </Col>
            )}
            {role === EUserRole.MASTER && (
              <>
                <Col span={6}>
                  <Form.Item
                    label={<RequiredLabel text="Name" />}
                    name="firstName"
                    rules={[
                      { required: true, message: "Please enter first name" },
                    ]}
                  >
                    <Input placeholder="Please enter first name" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="&nbsp;"
                    name="lastName"
                    rules={[
                      { required: true, message: "Please enter last name" },
                    ]}
                  >
                    <Input placeholder="Please enter last name" />
                  </Form.Item>
                </Col>
              </>
            )}
            {type === EUserInfoType.DETAIL && (
              <Col span={12}>
                <Form.Item
                  label={<RequiredLabel text="Status" />}
                  name="status"
                  rules={[{ required: true, message: "Please select status" }]}
                >
                  <Select options={MST.slice(1)} />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </div>
      {!isEmpty(detailData) && (
        <AccountDetailGeneral
          className="mt-8"
          data={{
            createdAt,
            createdBy,
            updatedAt: updatedAt || createdAt,
            updatedBy: updatedBy || createdBy,
            lastAccessedAt: lastAccessedAt || "Never",
          }}
          size={EAccountDetailGeneralSize.LARGE}
        />
      )}
    </div>
  );
}

export default UserInfo;
