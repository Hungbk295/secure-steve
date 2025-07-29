import { EModalMode, ENotificationType } from "@/interfaces/app";
import { store } from "@/store";
import {
  actionUpdateNotification,
  actionUpdatePageLoading,
} from "@/store/appSlide";

export const pageLoading = {
  on: () => {
    store.dispatch(actionUpdatePageLoading(true));
  },
  off: () => {
    store.dispatch(actionUpdatePageLoading(false));
  },
};

export const notify = (props: {
  message: string;
  type?: ENotificationType;
  mode?: EModalMode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}) => {
  const {
    type = ENotificationType.NONE,
    mode = EModalMode.MULTIPLE,
    ...nest
  } = props;
  store.dispatch(
    actionUpdateNotification({ isOpen: true, type, mode, ...nest })
  );
};
