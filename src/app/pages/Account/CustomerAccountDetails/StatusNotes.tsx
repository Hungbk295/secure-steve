import { Form, Row } from "antd";
import { DynamicKeyObject } from "@/interfaces/app";
import Input from "@/app/components/common/Input";
import Select from "@/app/components/common/Select";
import CollapsibleSection from "@/app/components/common/CollapsibleSection";
import { CA_STATUS } from "@/constants/options";
import { useEffect } from "react";

interface StatusNotesProps {
  form: any;
  data?: DynamicKeyObject;
}

function StatusNotes({ form, data }: StatusNotesProps) {
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        status: data.status,
        memo: data.memo,
        createdAt: data.createDatetime,
        lastUpdateBy: data.lastUpdateEmail,
        lastUpdateDatetime: data.lastUpdateDatetime,
      });
    }
  });
  return (
    <CollapsibleSection title="Account Status">
      <div className="w-full bg-white">
        <Row className="flex flex-col gap-2">
            <div className="w-1/2 pr-2">
              <Form.Item
                label={
                  <span>
                    Status <span className="text-red-500">*</span>
                  </span>
                }
                name="status"
                rules={[{ required: true, message: "Status is required" }]}
                className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Select
                  placeholder="Select status"
                  options={CA_STATUS.filter((status) => status.value !== "ALL")}
                  className="w-full"
                />
              </Form.Item>
            </div>

          <div className="w-full flex gap-4">
            <div className="w-full">
              <Form.Item
                label="Memo"
                name="memo"
                rules={[
                  {
                    max: 500,
                    message: "Memo must be less than 500 characters",
                  },
                ]}
                className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input.TextArea
                  placeholder="Enter memo"
                  rows={4}
                  maxLength={500}
                  showCount
                  className="min-h-[200px] rounded-lg border border-[#E3E3E8] bg-white"
                />
              </Form.Item>
            </div>
          </div>

          {/* <div className="w-full flex gap-4"> */}
            <div className="w-1/2 pr-2">
              <Form.Item
                label="Created at"
                name="createdAt"
                className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  value={data?.createdAt}
                  disabled
                  className="bg-gray-100"
                />
              </Form.Item>
            </div>

          <div className="w-full flex gap-4">
            <div className="w-full">
              <Form.Item
                label="Last updated at"
                name="lastUpdateDatetime"
                className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input disabled className="bg-gray-100" />
              </Form.Item>
            </div>
            <div className="w-full">
              <Form.Item
                label="Last updated by"
                name="lastUpdateBy"
                className="mb-0 w-full [&_.ant-form-item-row]:!p-0 [&_.ant-form-item-label]:!pb-1 "
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  value={data?.lastUpdateBy}
                  disabled
                  className="bg-gray-100"
                />
              </Form.Item>
            </div>
          </div>
        </Row>
      </div>
    </CollapsibleSection>
  );
}

export default StatusNotes;
