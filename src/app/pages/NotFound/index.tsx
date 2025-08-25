import CustomButton from "@/app/components/common/Button";
import ROUTES from "@/constants/routes";
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
        <CustomButton onClick={() => navigate(ROUTES.Home.Dashboard)}>
          Back Home
        </CustomButton>
      }
    />
  );
}

export default NotFound;
