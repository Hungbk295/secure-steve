import DataTable from "@/app/pages/Account/CustomerAccount/DataTable";
import Condition from "@/app/pages/Account/CustomerAccount/Condition";
import FixedCondition from "@/app/components/common/FixedCondition";

function CustomerAccount() {
  return (
    <>
      <h1 className="font-bold text-2xl text-grey-80 leading-custom-normal">
        Customer Account
      </h1>
      <FixedCondition title="Customer Account" condition={Condition} />
      <DataTable />
    </>
  );
}

export default CustomerAccount;
