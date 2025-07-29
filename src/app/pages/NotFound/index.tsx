import CustomButton from "@/app/components/common/Button";
import URL from "@/constants/url";
import { Result } from "antd";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <CustomButton onClick={() => navigate(URL.Home)}>
          Back Home
        </CustomButton>
      }
    />
  );
}

export default NotFound;
