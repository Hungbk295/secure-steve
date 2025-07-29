import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import { useNavigate } from "react-router-dom";
import Table from "@/app/components/common/Table";
import Tag from "@/app/components/common/Tag";
import { DynamicKeyObject } from "@/interfaces/app";
import { useAppSelector } from "@/store";
import { selectCustomerAccounts } from "@/store/customerAccountSlice";
import { getTagType, nvl } from "@/utils/app";
import { dayjsKR } from "@/libs/date";
import { CA_STATUS } from "@/constants/options";
import URL from "@/constants/url";

const newColumns: any = [
  { title: "#", dataIndex: "key", key: "key" },
  {
    title: "Company name",
    dataIndex: "companyName",
    key: "companyName",
  },
  { title: "Agency ID", dataIndex: "agencyId", key: "agencyId" },
  { title: "IATA", dataIndex: "iataNumber", key: "iataNumber" },
  {
    title: "POS",
    dataIndex: "pos",
    key: "pos",
    render: (_: any, item: DynamicKeyObject) => {
      return `${nvl(item.posNationTwoCode, "")} | ${nvl(
        item.posCityThreeCode,
        ""
      )} | ${nvl(item.posCurrencyThreeCode, "")}`;
    },
  },
  {
    title: "Contact email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone number",
    dataIndex: "phoneNumberWithNation",
    key: "phoneNumberWithNation",
    render: (_: any, item: DynamicKeyObject) => {
      if (!item.phoneNumber && !item.phoneNationNumber) return "-";
      return `${
        item.phoneNationNumber ? `+${Number(item.phoneNationNumber)}) ` : ""
      }${item.phoneNumber}`;
    },
  },
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
  {
    title: "Last updated at",
    dataIndex: "lastUpdateDatetime",
    key: "lastUpdateDatetime",
    showSorterTooltip: { target: "full-header" },
    render: (text: any) => {
      if (!text) return "";
      const date = dayjsKR(text, "YYYY-MM-DD HH:mm");
      return date.isValid() ? date.format("YYYY.MM.DD HH:mm:ss") : "";
    },
    sorter: (a: any, b: any) =>
      dayjsKR(a.lastUpdateDatetime, "YYYY-MM-DD HH:mm").diff(
        dayjsKR(b.lastUpdateDatetime, "YYYY-MM-DD HH:mm")
      ),
  },
];

function DataTable() {
  const navigate = useNavigate();
  const customerAccounts = useAppSelector(selectCustomerAccounts);

  const [dataTable, setDataTable] = useState<DynamicKeyObject[]>([]);

  function sortData(data: DynamicKeyObject[]) {
    if (data.length === 0) return [];

    const clonedSortData = cloneDeep(data);
    const sortedData = clonedSortData.sort((a, b) => {
      const statusOrder =
        CA_STATUS.findIndex((status) => status.value === a.status) -
        CA_STATUS.findIndex((status) => status.value === b.status);
      const createdAtOrder = dayjsKR(b.createDatetime, "YYYY-MM-DD HH:mm").diff(
        dayjsKR(a.createDatetime, "YYYY-MM-DD HH:mm")
      );
      return statusOrder || createdAtOrder;
    });

    return sortedData;
  }

  useEffect(() => {
    const data = sortData(customerAccounts).map((customerAccount, index) => {
      return {
        key: index + 1,
        ...customerAccount,
      };
    });

    setDataTable(data);
  }, [customerAccounts]);

  const handleRowClick = (record: DynamicKeyObject) => {
    const id = record.agencyId;
    const detailsPath = URL.Account.CustomerAccountDetails.replace(
      ":id",
      id || "new"
    );
    navigate(detailsPath);
  };

  return (
    <div className="my-6 flex flex-col gap-2">
      <h3 className="text-grey-40 font-medium">Result</h3>
      <div className="border border-grey-10 rounded-[8px] p-6 bg-white">
        <Table
          columns={newColumns}
          dataSource={dataTable}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </div>
  );
}

export default DataTable;
