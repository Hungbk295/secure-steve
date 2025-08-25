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
import { notificationCallbackManager } from "@/utils/appStateHandle";

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
  } = useAppSelector(selectActionNotification);

  // Get callbacks from the callback manager instead of Redux state
  const { onOk, onCancel, onClose } = notificationCallbackManager.getCallbacks();

  const handleClose = () => {
    dispatch(actionUpdateNotification({ isOpen: false }));
    notificationCallbackManager.clearCallbacks();
    if (onClose) {
      onClose();
    }
  };

  const handleOk = () => {
    if (onOk) {
      onOk();
    }
    handleClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleClose();
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
        onOk={handleOk}
        onCancel={handleCancel}
        onClose={handleClose}
      />
    )
  );
}

export default CustomNotification;
