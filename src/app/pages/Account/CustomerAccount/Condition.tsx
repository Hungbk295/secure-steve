import { useEffect } from "react";
import dayjs from "dayjs";
import { Col, Flex, Form, Row } from "antd";
import Select from "@/app/components/common/Select";
import Button from "@/app/components/common/Button";
import CustomDatePicker from "@/app/components/common/CustomDatePicker";
import { CA_STATUS, KEYWORD } from "@/constants/options";
import { DynamicKeyObject } from "@/interfaces/app";
import Input from "@/app/components/common/Input";
import { useAppDispatch } from "@/store";
import { nvl } from "@/utils/app";
import { actionGetCustomerAccounts } from "@/store/customerAccountSlice";
import { pageLoading } from "@/utils/appStateHandle";

const initialFormData = {
  status: "ALL",
  key_word: "companyname",
  created_date: [dayjs().subtract(3, "month"), dayjs()],
};

function Condition() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  function getPayload(values: DynamicKeyObject) {
    const { status, created_date, key_word, key_string } = values;
    const payload = {
      status,
      da_condition: "C",
      start_date:
        created_date.length > 0 ? created_date[0].format("YYYY-MM-DD") : "",
      end_date:
        created_date.length > 0 ? created_date[1].format("YYYY-MM-DD") : "",
      key_word: nvl(key_word, ""),
      key_string: nvl(key_string, ""),
    };
    return payload;
  }

  function search(values: DynamicKeyObject) {
    const payload = getPayload(values);
    pageLoading.on();
    dispatch(actionGetCustomerAccounts(payload)).finally(() =>
      pageLoading.off()
    );
  }

  function onFinish(values: DynamicKeyObject) {
    search(values);
  }

  function onReset() {
    form.setFieldsValue({
      ...initialFormData,
      created_date: [],
      key_string: "",
    });
  }

  useEffect(() => {
    search(initialFormData);
  }, []);

  useEffect(() => {
    form.setFieldsValue(initialFormData);
  }, []);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[16, 16]} align="middle">
        <Col sm={8} xxl={4}>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select Status" options={CA_STATUS} />
          </Form.Item>
        </Col>
        <Col sm={16} xxl={8}>
          <Form.Item label="Created Date" name="created_date">
            <CustomDatePicker form={form} name="created_date" />
          </Form.Item>
        </Col>
        <Col sm={8} xxl={4}>
          <Form.Item
            label="Keyword"
            name="key_word"
            rules={[{ required: true, message: "Please enter keyword" }]}
          >
            <Select placeholder="Select keyword" options={KEYWORD} />
          </Form.Item>
        </Col>
        <Col sm={8} xxl={4}>
          <Form.Item
            label="&nbsp;"
            name="key_string"
            rules={[{ max: 100, message: "Maximum 100 characters" }]}
          >
            <Input placeholder="Please enter a search term" />
          </Form.Item>
        </Col>
        <Col sm={8} xxl={4}>
          <Flex className="gap-4">
            <Button
              className="min-w-11 !border-grey-35"
              icon={<i className="ri-refresh-line text-xl"></i>}
              theme="black"
              variant="outlined"
              onClick={onReset}
            />
            <Button className="flex-1" htmlType="submit" type="primary">
              Search
            </Button>
          </Flex>
        </Col>
      </Row>
    </Form>
  );
}

export default Condition;
