import { DynamicKeyObject } from "@/interfaces/app";
import { actionToggleChangePasswordModal } from "@/store/appSlide";
import { store } from "@/store";
import { get } from "lodash";

export const CUSTOM_API_MESSAGE: DynamicKeyObject = {
  c00000: {
    message: "The current password you entered was incorrect.",
  },
  c08000: {
    message: "Please double check your email address or password.",
  },
  c01000: { message: "Please double check your email address or password." },
  c02000: {
    message: "You ran out of login attempts. Please wait 15 min and try again.",
  },
  c00080: {
    message: "Your password has been expired. Please change your password.",
    onClose: (request: DynamicKeyObject) => {
      store.dispatch(
        actionToggleChangePasswordModal({
          isOpen: true,
          role: request.config?.url?.split("/").pop(),
          username: JSON.parse(request.config.data).username,
          accessToken: get(request, "data.data.accessToken", ""),
        })
      );
    },
  },
  c04000: {
    message: "Your account is not active. Please contact Admin.",
  },
};
