import CustomButton from "@/app/components/common/Button";
import ROUTES from "@/constants/routes";
import { Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import { selectUserRole, selectCurrentUser } from "@/store/authSlide";

function Forbidden() {
  const navigate = useNavigate();
  const userRole = useAppSelector(selectUserRole);
  const currentUser = useAppSelector(selectCurrentUser);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="403"
        title="403 - Access Denied"
        subTitle={
          <div className="space-y-2">
            <p>Sorry, you are not authorized to access this page.</p>
            <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
              <p><strong>Current User:</strong> {currentUser?.name || 'Unknown'}</p>
              <p><strong>Role:</strong> {userRole}</p>
              <p><strong>Department:</strong> {currentUser?.department || 'Unknown'}</p>
            </div>
          </div>
        }
        extra={
          <div className="space-x-2">
            <CustomButton onClick={() => navigate(ROUTES.Home.Dashboard)}>
              Back to Dashboard
            </CustomButton>
            <CustomButton 
              type="default" 
              onClick={() => navigate(ROUTES.SignIn)}
            >
              Sign Out
            </CustomButton>
          </div>
        }
      />
    </div>
  );
}

export default Forbidden;
