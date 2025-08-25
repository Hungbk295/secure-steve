import { useAppSelector } from "@/store";
import { selectActionLoading } from "@/store/appSlide";
import { Spin } from "antd";

export const PageLoading = () => {
  const isLoading = useAppSelector(selectActionLoading);

  return (
    isLoading && (
      <div className="fixed z-[8001] top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#000000b3]">
        <Spin size="large" />
      </div>
    )
  );
};

export default PageLoading;
