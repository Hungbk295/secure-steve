import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Routers from "@/layouts/Routers";
import AntdConfigProvider from "@/layouts/AntdConfigProvider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store";
import Loading from "@/app/components/common/Loading";
import CustomNotification from "@/app/components/common/CustomNotification";
import "@/styles/index.css";
import ChangePasswordModal from "./app/pages/Login/ChangePasswordModal";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AntdConfigProvider>
            <Loading />
            <CustomNotification />
            <ChangePasswordModal />
            <Routers />
          </AntdConfigProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
