import { DynamicKeyObject } from "@/interfaces/app";
import { useState } from "react";
import SelectedAccount from "@/app/components/ui/SelectedAccount";
import SearchAccount from "@/app/components/ui/SearchAccount";
import { EUserInfoType } from "@/interfaces/account";
import { ActionCreatorWithoutPayload, AsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

interface IAccountInfoProps {
  data: DynamicKeyObject;
  type: EUserInfoType;
  accountList?: DynamicKeyObject[];
  actionSearchAccount?: AsyncThunk<AxiosResponse<any, any>, DynamicKeyObject, any>;
  actionResetAccountList?: ActionCreatorWithoutPayload<any>;
  onChange?: React.Dispatch<React.SetStateAction<DynamicKeyObject>>;
}

enum EAccountInfoType {
  SEARCH = "search",
  SELECTED = "selected",
}

function AccountInfo(props: IAccountInfoProps) {
  const {
    data = {},
    type,
    accountList = [],
    onChange = () => {},
    actionSearchAccount,
    actionResetAccountList,
  } = props;
  const [accountInfoType, setAccountInfoType] = useState<EAccountInfoType>(
    EAccountInfoType.SELECTED
  );

  return (
    <div className="border border-grey-10 rounded-md pt-4 px-6 pb-8 bg-white">
      {accountInfoType === EAccountInfoType.SEARCH || !data.agencyId ? (
        <SearchAccount
          accountList={accountList}
          actionSearchAccount={actionSearchAccount}
          actionResetAccountList={actionResetAccountList}
          onSelect={(record) => {
            onChange(record);
            setAccountInfoType(EAccountInfoType.SELECTED);
          }}
        />
      ) : (
        <SelectedAccount
          data={data}
          type={type}
          onSearch={() => setAccountInfoType(EAccountInfoType.SEARCH)}
        />
      )}
    </div>
  );
}

export default AccountInfo;
