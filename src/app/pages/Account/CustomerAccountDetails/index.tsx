import { Form, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/app/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/store";
import { pageLoading } from "@/utils/appStateHandle";

import URL from "@/constants/url";
import Subscription from "./Subscription";
import Company from "./Company";
import CompanyAddress from "./CompanyAddress";
import StatusNotes from "./StatusNotes";
import {
  selectCustomerAccountDetails,
  actionSaveCustomerAccountDetails,
  actionCheckIataNumberDuplicate,
  selectTimeZones,
  actionGetTimeZones,
  actionGetCustomerAccountDetail,
  selectLoading,
} from "@/store/customerAccountSlice";
import { useEffect } from "react";

function CustomerAccountDetails() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const customerData = useAppSelector(selectCustomerAccountDetails);
  const timeZones = useAppSelector(selectTimeZones);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        pageLoading.on();
        const result = await dispatch(actionGetCustomerAccountDetail({ agencyId: id })).unwrap();
        
        if (result?.data?.data?.[0]) {
          const customerDetail = result.data.data[0];
          if (customerDetail.posNationTwoCode) {
            await dispatch(actionGetTimeZones(customerDetail.posNationTwoCode)).unwrap();
          }
        }
      } catch (error) {
        message.error("Failed to load customer details");
        console.error(error);
      } finally {
        pageLoading.off();
      }
    };

    fetchData();
  }, [id, dispatch, form]);

  const handleSave = async () => {
    try {
      const formValues = await form.validateFields();
      pageLoading.on();

      const values = {
        ...formValues,
        posTimezone: timeZones?.find((_, index) => index === formValues.posTimezone)?.intervalTime,
        deletionreason: customerData?.deletionreason ? JSON.parse(customerData.deletionreason) : [],
        posCityThreeCode: timeZones?.find((_, index) => index === formValues.posTimezone)?.cityThreeCode,                        
      };

      // Check IATA number duplication
      try {
        await dispatch(
          actionCheckIataNumberDuplicate(values.iataNumber)
        ).unwrap();
      } catch (error) {
        message.error("IATA number already exists");
        pageLoading.off();
        return;
      }

      // Save customer details
      await dispatch(actionSaveCustomerAccountDetails({ ...values, id }))
        .unwrap()
        .then(() => {
          message.success("Customer account details saved successfully");
          navigate(URL.Account.CustomerAccount);
        })
        .catch((error) => {
          message.error("Failed to save customer account details");
          console.error(error);
        });
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      pageLoading.off();
    }
  };

  if (loading) {
    return null; 
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl text-[#4B4E59]">Customer Account</h1>
        <div className="flex gap-4">
          <Button
            theme="black"
            variant="outlined"
            className="w-[120px] border border-[#82828A] font-medium"
            onClick={() => navigate(URL.Account.CustomerAccount)}
          >
            List
          </Button>
          <Button
            theme="primary"
            onClick={handleSave}
            className="w-[120px] text-white font-medium"
          >
            Save
          </Button>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#E3E3E8] mb-6"></div>

      <div className="w-full max-md:max-w-full mb-10">
        <Form form={form} layout="vertical">
          <Subscription data={customerData} />
          <Company form={form} data={customerData} timeZones={timeZones} />
          <CompanyAddress form={form} data={customerData} />
          <StatusNotes form={form} data={customerData} />
        </Form>
      </div>
    </>
  );
}

export default CustomerAccountDetails;
