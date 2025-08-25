import { CUSTOM_API_MESSAGE } from "@/constants/apiResponse";
import { DynamicKeyObject, EModalMode, ENotificationType } from "@/interfaces/app";
import { notify } from "@/utils/appStateHandle";

export const handleApiException = (request: DynamicKeyObject = {}) => {
  const { code, message } = request.data ?? {};
  notify({
    message: CUSTOM_API_MESSAGE[code]?.message || message,
    type: ENotificationType.ERROR,
    mode: EModalMode.SINGLE,
    onClose: () => {
      CUSTOM_API_MESSAGE[code]?.onClose?.(request);
    },
  });
};
