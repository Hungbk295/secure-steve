import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AntdConfigProvider from "@/layouts/AntdConfigProvider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store";
import App from "@/App";
import "@/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AntdConfigProvider>
            <App />
          </AntdConfigProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
