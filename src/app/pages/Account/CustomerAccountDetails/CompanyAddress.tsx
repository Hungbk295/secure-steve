import { Form, Row } from "antd";
import { DynamicKeyObject } from "@/interfaces/app";
import Input from "@/app/components/common/Input";
import Select from "@/app/components/common/Select";
import CollapsibleSection from "@/app/components/common/CollapsibleSection";
import { useEffect } from "react";

interface CompanyAddressProps {
  form: any;
  data?: DynamicKeyObject;
}

function CompanyAddress({ form, data }: CompanyAddressProps) {

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        address: data.address,
        addressDetail: data.addressDetail,
        city: data.city,
        province: data.province,
        nationTwoCode: data.nationTwoCode,
        zipcode: data.zipcode,
      });
    }
  }, [data, form]);
  const countries = [
    { value: "KR", label: "Korea" },
    { value: "US", label: "United States" },
    { value: "JP", label: "Japan" },
    { value: "CN", label: "China" }
  ];

  return (
    <CollapsibleSection title="Company Address">
      <div className="w-full bg-white">
        <Row className="flex flex-col gap-3">
          <div className="w-full flex gap-4">
            <div className="w-full">
              <Form.Item
                label={<span>Street address <span className="text-red-500">*</span></span>}
                name="address"
                rules={[
                  { required: true, message: "Street address is required" },
                  { max: 100, message: "Street address must be less than 100 characters" }
                ]}
                className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input placeholder="Enter street address" allowClear={false} />
              </Form.Item>
            </div>
            <div className="w-full">
              <Form.Item
                label={<span>Apt, suite, etc. <span className="text-red-500">*</span></span>}
                name="addressDetail"
                rules={[
                  { required: true, message: "Apt, suite, etc. is required" },
                  { max: 100, message: "Apt, suite, etc. must be less than 100 characters" }
                ]}
                className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input placeholder="Enter apt, suite, etc." allowClear={false} />
              </Form.Item>
            </div>
          </div>

          <div className="w-full flex gap-4">
            <div className="w-full">
              <Form.Item
                label={<span>City <span className="text-red-500">*</span></span>}
                name="city"
                rules={[
                  { required: true, message: "City is required" },
                  { max: 100, message: "City must be less than 100 characters" }
                ]}
                className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input placeholder="Enter city" allowClear={false} />
              </Form.Item>
            </div>
            <div className="w-full">
              <Form.Item
                label={<span>State/Province <span className="text-red-500">*</span></span>}
                name="province"
                rules={[
                  { required: true, message: "State/Province is required" },
                  { max: 100, message: "State/Province must be less than 100 characters" }
                ]}
                className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input placeholder="Enter state/province" allowClear={false} />
              </Form.Item>
            </div>
          </div>

          <div className="w-full flex gap-4">
            <div className="w-full">
              <Form.Item
                label={<span>Country <span className="text-red-500">*</span></span>}
                name="nationTwoCode"
                rules={[{ required: true, message: "Country is required" }]}
                className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Select
                  placeholder="Select country"
                  options={countries}
                  className="w-full"
                />
              </Form.Item>
            </div>
            <div className="w-full">
              <Form.Item
                label={<span>Zip code <span className="text-red-500">*</span></span>}
                name="zipcode"
                rules={[
                  { required: true, message: "Zip code is required" },
                  { max: 10, message: "Zip code must be less than 10 characters" },
                  { pattern: /^[a-zA-Z0-9]+$/, message: "Zip code must contain only letters and numbers" }
                ]}
                className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input placeholder="Enter zip code" allowClear={false} />
              </Form.Item>
            </div>
          </div>
        </Row>
      </div>
    </CollapsibleSection>
  );
}

export default CompanyAddress;


