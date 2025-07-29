import { Form, Row } from "antd";
import { DynamicKeyObject } from "@/interfaces/app";
import Input from "@/app/components/common/Input";
import Select from "@/app/components/common/Select";
import CollapsibleSection from "@/app/components/common/CollapsibleSection";
import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { actionGetTimeZones } from "@/store/customerAccountSlice";
import { PHONE_NUMBER_CODES, COUNTRY_CODES } from "@/constants/app";
interface CompanyProps {
  form: any;
  data?: DynamicKeyObject;
  timeZones?: DynamicKeyObject[];
}

function Company({ form, data, timeZones }: CompanyProps) {
  const posTimezone = timeZones?.map((timezone, index) => {
    const hours = parseInt(timezone.intervalTime.split(":")[0], 10);
    return {
      label: `${timezone.cityThreeCode} - ${timezone.cityName} (UTC+${hours})`,
      value: index,
      posTimezone: timezone.intervalTime
    }
  })
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        companyName: data.companyName,
        agencyId: data.agencyId,
        iataNumber: data.iataNumber,
        email: data.email,
        bussinessId: data.bussinessId,
        phoneNationNumber: 1,
        phoneNumber: data.phoneNumber,
        organizationType: data.organizationType,
        businessType: data.businessType,
        companySize: data.companySize,
        homepage: data.homepage,
        posNationTwoCode: data.posNationTwoCode,
        posCityThreeCode: data.posCityThreeCode,
        posCurrencyThreeCode: data.posCurrencyThreeCode,
        posDateFormat: data.posDateFormat,
      });
    }
  }, [data, form]);

  const organizationTypes = [
    { value: "Personal", label: "Personal" },
    { value: "Corporation", label: "Corporation" },
    { value: "Non-profit", label: "Non-profit" },
  ];

  const businessTypes = [
    { value: "Online Travel Agency", label: "Online Travel Agency" },
    { value: "Offline Travel Agency", label: "Offline Travel Agency" },
    { value: "Corporate Travel", label: "Corporate Travel" },
    { value: "Other", label: "Other" },
  ];

  const companySizes = [
    { value: "Just me", label: "Just me" },
    { value: "2-49", label: "2-49" },
    { value: "50-299", label: "50-299" },
    { value: "300-2,999", label: "300-2,999" },
    { value: "3000+", label: "3000+" },
  ];
  const currencyCodes = [
    { value: "KRW", label: "KRW (Korean Won)" },
    { value: "USD", label: "USD (US Dollar)" },
    { value: "JPY", label: "JPY (Japanese Yen)" },
    { value: "CNY", label: "CNY (Chinese Yuan)" },
  ];

  // const cityCodes = [
  //   { value: "SEL", label: "Seoul (UTC+09:00)" },
  //   { value: "NYC", label: "New York (UTC-05:00)" },
  //   { value: "TYO", label: "Tokyo (UTC+09:00)" },
  //   { value: "BJS", label: "Beijing (UTC+08:00)" },
  // ];

  const dateFormats = [
    { value: "YYYY-MM-DD hh:mm:ss", label: "YYYY-MM-DD hh:mm:ss" },
    { value: "MM-DD-YYYY hh:mm:ss", label: "MM-DD-YYYY hh:mm:ss" },
    { value: "DD-MM-YYYY hh:mm:ss", label: "DD-MM-YYYY hh:mm:ss" },
  ];

  return (
    <>
      <CollapsibleSection title="Company">
        <div className="w-full bg-white">
          <Row className="flex flex-col gap-4">
            {/* Company Information */}
            <div className="w-full flex gap-4">
              <div className="w-full">
                <Form.Item
                  label="Company Name"
                  name="companyName"
                  rules={[
                    { required: true, message: "Please enter company name" },
                  ]}
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input placeholder="Enter company name" allowClear={false} />
                </Form.Item>
              </div>
              <div className="w-full">
                <Form.Item
                  label={
                    <span>
                      Agency ID <span className="text-red-500">*</span>
                    </span>
                  }
                  name="agencyId"
                  rules={[{ required: true, message: "Agency ID is required" }]}
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input disabled className="bg-gray-100" />
                </Form.Item>
              </div>
            </div>

            {/* Business Information */}
            <div className="w-full flex gap-4">
              <div className="w-full">
                <Form.Item
                  label="Bussiness ID"
                  name="bussinessId"
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    placeholder="Enter bussiness ID"
                    maxLength={100}
                    allowClear={false}
                  />
                </Form.Item>
              </div>
              <div className="w-full">
                <Form.Item
                  label={
                    <span>
                      IATA <span className="text-red-500">*</span>
                    </span>
                  }
                  name="iataNumber"
                  rules={[
                    { required: true, message: "IATA is required" },
                    { pattern: /^\d{8}$/, message: "IATA must be 7 digits" },
                  ]}
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    disabled={data?.statusnm !== "Under Review"}
                    className={
                      data?.status !== "Under Review" ? "bg-gray-100" : ""
                    }
                  />
                </Form.Item>
              </div>
            </div>

            {/* Contact Information */}
            <div className="w-full flex gap-4">
              <div className="w-full">
                <Form.Item
                  label={
                    <span>
                      Contact email <span className="text-red-500">*</span>
                    </span>
                  }
                  name="email"
                  rules={[
                    { required: true, message: "Please enter contact email" },
                    { type: "email", message: "Please enter a valid email" },
                    {
                      min: 5,
                      max: 255,
                      message: "Email must be between 5 and 255 characters",
                    },
                  ]}
                  className="mb-0 w-full"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input disabled placeholder="baiboong@gmail.com" />
                </Form.Item>
              </div>
              <div className="w-full">
                <Form.Item
                  label={
                    <span>
                      Phone Number <span className="text-red-500">*</span>
                    </span>
                  }
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <div className="flex w-full gap-4">
                    <Form.Item
                      name="phoneNationNumber"
                      noStyle
                      rules={[
                        { required: true, message: "Country code is required" },
                      ]}
                    >
                      <Select
                        style={{ width: "100px" }}
                        placeholder="+82"
                        options={PHONE_NUMBER_CODES}
                        popupMatchSelectWidth={false}
                        dropdownStyle={{ minWidth: "200px" }}
                        labelRender={(item: any) =>
                          item.label.split("(")[1].replace(")", "")
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name="phoneNumber"
                      noStyle
                      rules={[
                        { required: true, message: "Phone number is required" },
                        {
                          pattern: /^\d{4,15}$/,
                          message: "Phone number must be 4-15 digits",
                        },
                      ]}
                    >
                      <Input
                        style={{ width: "calc(100% - 80px)" }}
                        placeholder="Enter phone number"
                        allowClear={false}
                      />
                    </Form.Item>
                  </div>
                </Form.Item>
              </div>
            </div>

            {/* Organization Information */}
            <div className="w-full flex gap-4">
              <div className="w-full">
                <Form.Item
                  label="Organization Type"
                  name="organizationType"
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    placeholder="Select organization type"
                    options={organizationTypes}
                    className="w-full"
                  />
                </Form.Item>
              </div>
              <div className="w-full">
                <Form.Item
                  label="Business Type"
                  name="businessType"
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    placeholder="Select business type"
                    options={businessTypes}
                    className="w-full"
                  />
                </Form.Item>
              </div>
            </div>

            {/* Additional Information */}
            <div className="w-full flex gap-4">
              <div className="w-full">
                <Form.Item
                  label="Company Size"
                  name="companySize"
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    placeholder="Select company size"
                    options={companySizes}
                    className="w-full"
                  />
                </Form.Item>
              </div>
              <div className="w-full">
                <Form.Item
                  label="Homepage"
                  name="homepage"
                  rules={[
                    {
                      max: 200,
                      message: "Homepage URL must be less than 200 characters",
                    },
                    {
                      pattern: /^[A-Za-z0-9\-_.?&]+$/,
                      message: "Homepage URL contains invalid characters",
                    },
                    {
                      pattern: /\./,
                      message:
                        "Homepage URL must contain a dot (e.g., .com, .net)",
                    },
                  ]}
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input placeholder="Enter homepage URL" allowClear={false} />
                </Form.Item>
              </div>
            </div>
          </Row>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Point of sale">
        <div className="w-full bg-white">
          <Row className="flex flex-col gap-3">
            <div className="w-full flex gap-4">
              <div className="w-full">
                <Form.Item
                  label={
                    <span>
                      Country Code <span className="text-red-500">*</span>
                    </span>
                  }
                  name="posNationTwoCode"
                  rules={[
                    { required: true, message: "Country code is required" },
                  ]}
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    placeholder="Select country code"
                    options={COUNTRY_CODES}
                    className="w-full"
                    fieldNames={{ value: 'value', label: 'label' }} 
                    onChange={(value) => {
                      form.setFieldsValue({
                        posNationTwoCode: value,
                      });
                      dispatch(actionGetTimeZones(value))
                    }}
                  />
                </Form.Item>
              </div>
              <div className="w-full">
                <Form.Item
                  label={
                    <span>
                      City Code / Time Zone{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  }
                  name="posTimezone"
                  rules={[{ required: true, message: "City code is required" }]}
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    placeholder="Select city code"
                    className="w-full"
                    options={posTimezone}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="w-full flex gap-4">
              <div className="w-full">
                <Form.Item
                  label={
                    <span>
                      Currency Code <span className="text-red-500">*</span>
                    </span>
                  }
                  name="posCurrencyThreeCode"
                  rules={[
                    { required: true, message: "Currency code is required" },
                  ]}
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    placeholder="Select currency code"
                    options={currencyCodes}
                    className="w-full"
                  />
                </Form.Item>
              </div>
              <div className="w-full">
                <Form.Item
                  label={
                    <span>
                      Date Format <span className="text-red-500">*</span>
                    </span>
                  }
                  name="posDateFormat"
                  rules={[
                    { required: true, message: "Date format is required" },
                  ]}
                  className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    placeholder="Select date format"
                    options={dateFormats}
                    className="w-full"
                  />
                </Form.Item>
              </div>
            </div>
          </Row>
        </div>
      </CollapsibleSection>
    </>
  );
}

export default Company;
