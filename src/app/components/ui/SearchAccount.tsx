import { DynamicKeyObject } from "@/interfaces/app";
import CustomButton from "@/app/components/common/Button";
import Input from "../common/Input";
import { useEffect, useState } from "react";
import { dayjsKR } from "@/libs/date";
import { CA_STATUS } from "@/constants/options";
import Table from "../common/Table";
import { useAppDispatch } from "@/store";
import { getTagType, getValidatedAntdFormValues } from "@/utils/app";
import Tag from "../common/Tag";
import { Form } from "antd";
import { pageLoading } from "@/utils/appStateHandle";
import { AxiosResponse } from "axios";
import { ActionCreatorWithoutPayload, AsyncThunk } from "@reduxjs/toolkit";

interface ISearchAccountProps {
  accountList: DynamicKeyObject[];
  actionSearchAccount?: AsyncThunk<
    AxiosResponse<any, any>,
    DynamicKeyObject,
    any
  >;
  actionResetAccountList?: ActionCreatorWithoutPayload<any>;
  onSelect: (_: DynamicKeyObject) => void;
}

const COLUMNS: DynamicKeyObject[] = [
  { title: "#", dataIndex: "key", key: "key" },
  {
    title: "Company name",
    dataIndex: "companyName",
    key: "companyName",
  },
  { title: "Agency ID", dataIndex: "agencyId", key: "agencyId" },
  { title: "IATA", dataIndex: "iataNumber", key: "iataNumber" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (_: any, item: DynamicKeyObject) => (
      <Tag type={getTagType(item.status, CA_STATUS)}>{item?.statusnm}</Tag>
    ),
  },
  {
    title: "Created at",
    dataIndex: "createDatetime",
    key: "createDatetime",
    showSorterTooltip: { target: "full-header" },
    render: (text: any) => {
      const date = dayjsKR(text, "YYYY-MM-DD HH:mm");
      return date.isValid() ? date.format("YYYY.MM.DD") : "";
    },
    sorter: (a: any, b: any) =>
      dayjsKR(a.createDatetime, "YYYY-MM-DD HH:mm").diff(
        dayjsKR(b.createDatetime, "YYYY-MM-DD HH:mm")
      ),
  },
];

function SearchAccount(props: ISearchAccountProps) {
  const { accountList, onSelect, actionSearchAccount, actionResetAccountList } =
    props;
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [isShowDropdown, setIsShowDropdown] = useState(false);

  const handleSearchAccount = async () => {
    const values = await getValidatedAntdFormValues(form);
    if (!values || !actionSearchAccount) return;
    pageLoading.on();
    dispatch(actionSearchAccount({ companyname: values.companyName })).finally(
      () => {
        pageLoading.off();
        setIsShowDropdown(true);
      }
    );
  };

  const handleRowClick = (record: DynamicKeyObject) => {
    onSelect(record);
  };

  const handleReset = () => {
    form.resetFields();
    if (actionResetAccountList) {
      dispatch(actionResetAccountList?.());
    }
  };

  useEffect(() => {
    return () => {
      handleReset();
    };
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold">Account Info</h2>
      <div className="mt-6 flex gap-4">
        <div className="flex-1 relative">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Company name"
              name="companyName"
              rules={[{ required: true, message: "Please enter company name" }]}
            >
              <Input placeholder="Please enter company name" />
            </Form.Item>
          </Form>
          {isShowDropdown && (
            <div className="absolute top-full mt-2 z-10 w-full p-4 pb-6 bg-white rounded-lg shadow-[0px_2px_8px_0px_#0000001A]">
              <Table
                className="[&_tr]:cursor-pointer"
                columns={COLUMNS}
                dataSource={accountList}
                showPageSizeChanger={false}
                paginationProps={{
                  className: "justify-center",
                  showTotal: () => null,
                }}
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                })}
              />
            </div>
          )}
        </div>
        <div>
          <div className="h-[26px]" />
          <div className="flex gap-4">
            <CustomButton
              className="min-w-11 !border-grey-35"
              icon={<i className="ri-refresh-line text-xl"></i>}
              theme="black"
              variant="outlined"
              onClick={handleReset}
            />
            <CustomButton
              htmlType="submit"
              type="primary"
              className="!w-[200px]"
              onClick={handleSearchAccount}
            >
              Search Account
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchAccount;
