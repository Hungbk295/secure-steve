import {
  actionUpdateNotification,
  selectActionNotification,
} from "@/store/appSlide";
import CustomModal from "./CustomModal";
import { useAppDispatch, useAppSelector } from "@/store";
import IconSuccess from "@/assets/svgs/success.svg";
import IconError from "@/assets/svgs/error.svg";
import IconWarning from "@/assets/svgs/warning.svg";
import { ENotificationType } from "@/interfaces/app";

const NOTIFICATION_ICON: Record<ENotificationType, React.ReactNode> = {
  [ENotificationType.NONE]: null,
  [ENotificationType.SUCCESS]: <IconSuccess />,
  [ENotificationType.ERROR]: <IconError />,
  [ENotificationType.WARNING]: <IconWarning />,
};

function CustomNotification() {
  const dispatch = useAppDispatch();
  const {
    isOpen,
    message,
    mode,
    type,
    okText,
    cancelText,
    onOk,
    onCancel,
    onClose,
  } = useAppSelector(selectActionNotification);

  const handleClose = () => {
    dispatch(actionUpdateNotification({ isOpen: false }));
    if (onClose) {
      onClose();
    }
  };

  return (
    isOpen && (
      <CustomModal
        className="notification"
        width={475}
        title={
          <div className="flex items-center gap-4">
            <span>{NOTIFICATION_ICON[type]}</span>
            <span>{message}</span>
          </div>
        }
        mode={mode}
        okText={okText}
        cancelText={cancelText}
        onOk={onOk}
        onCancel={onCancel}
        onClose={handleClose}
      />
    )
  );
}

export default CustomNotification;
