import { EModalMode, ENotificationType } from "@/interfaces/app";
import { store } from "@/store";
import {
  actionUpdateNotification,
  actionUpdatePageLoading,
} from "@/store/appSlide";

// Callback manager to handle notification callbacks without storing them in Redux
class NotificationCallbackManager {
  private callbacks: {
    onOk?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
  } = {};

  setCallbacks(callbacks: {
    onOk?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
  }) {
    this.callbacks = callbacks;
  }

  getCallbacks() {
    return this.callbacks;
  }

  clearCallbacks() {
    this.callbacks = {};
  }
}

export const notificationCallbackManager = new NotificationCallbackManager();

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
    onOk,
    onCancel,
    onClose,
    ...rest
  } = props;

  // Store callbacks separately from Redux state
  notificationCallbackManager.setCallbacks({ onOk, onCancel, onClose });

  // Only store serializable data in Redux
  store.dispatch(
    actionUpdateNotification({ isOpen: true, type, mode, ...rest })
  );
};
