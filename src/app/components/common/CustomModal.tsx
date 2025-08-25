import { Button, Modal, ModalProps } from "antd";
import { EModalMode } from "@/interfaces/app";
import { cn } from "@/libs/utils";

type TCustomModalProps = ModalProps & {
  onCancel?: () => void;
  onOk?: () => void;
  onClose?: () => void;
  mode?: EModalMode;
  className?: string;
  showFooter?: boolean;
};

function CustomModal(props: TCustomModalProps) {
  const {
    title,
    children,
    mode = EModalMode.MULTIPLE,
    className,
    okText = "Done",
    cancelText = "Cancel",
    showFooter = true,
    onCancel,
    onOk,
    onClose,
    ...rest
  } = props;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleOk = () => {
    if (onOk) {
      onOk();
    }
    if (onClose) {
      onClose();
    }
  };

  const footer =
    mode === EModalMode.SINGLE
      ? [
          <Button
            key="submit"
            type="primary"
            className="btn-footer !min-w-[120px]"
            onClick={handleOk}
          >
            {okText}
          </Button>,
        ]
      : [
          <Button
            key="back"
            className="btn-footer !text-grey-80 !border-grey-35"
            onClick={handleCancel}
          >
            {cancelText}
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="btn-footer !min-w-[120px]"
            onClick={handleOk}
          >
            {okText}
          </Button>,
        ];

  return (
    <Modal
      className={cn("basic-modal", className)}
      title={title}
      open={true}
      width={572}
      onCancel={onClose}
      centered
      footer={showFooter ? footer : null}
      {...rest}
    >
      {children}
    </Modal>
  );
}

export default CustomModal;
