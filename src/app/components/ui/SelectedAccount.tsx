import { DynamicKeyObject } from "@/interfaces/app";
import Divider from "antd/lib/divider";
import CustomButton from "@/app/components/common/Button";
import { EUserInfoType } from "@/interfaces/account";

interface ISelectedAccountProps {
  data: DynamicKeyObject;
  type: EUserInfoType;
  onSearch: () => void;
}

function SelectedAccount(props: ISelectedAccountProps) {
  const { data, onSearch, type } = props;
  const {
    companyName = "COMPANY_NAME",
    agencyId = "AGENCY_ID",
    bussinessId = "BUSINESS_ID",
    iataNumber = "IATA",
  } = data;

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Account Info</h2>
        {type === EUserInfoType.CREATE && (
          <CustomButton
            theme="black"
            variant="outlined"
            className="!h-[30px] !text-xs !rounded !px-2"
            onClick={onSearch}
          >
            Search Account <i className="ri-search-line text-sm -ml-1"></i>
          </CustomButton>
        )}
      </div>
      <Divider />
      <div className="flex gap-8">
        <div>
          <div className="text-xs">Company name</div>
          <div className="font-bold mt-1">{companyName}</div>
        </div>
        <div>
          <div className="text-xs">Agency ID</div>
          <div className="font-bold mt-1">{agencyId}</div>
        </div>
        <div>
          <div className="text-xs">Business ID</div>
          <div className="font-bold mt-1">{bussinessId}</div>
        </div>
        <div>
          <div className="text-xs">IATA</div>
          <div className="font-bold mt-1">{iataNumber}</div>
        </div>
      </div>
    </>
  );
}

export default SelectedAccount;
