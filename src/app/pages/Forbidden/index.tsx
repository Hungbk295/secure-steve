import CustomButton from "@/app/components/common/Button";
import URL from "@/constants/url";
import { Result } from "antd";
import { useNavigate } from "react-router-dom";

function Forbidden() {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <CustomButton onClick={() => navigate(URL.Home)}>
          Back Home
        </CustomButton>
      }
    />
  );
}

export default Forbidden;
