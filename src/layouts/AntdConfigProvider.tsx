import React from "react";
import { ConfigProvider } from "antd";

interface AntdConfigProviderProps {
  children: React.ReactNode;
}

function AntdConfigProvider({ children }: AntdConfigProviderProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Noto Sans KR",
          colorPrimary: "#1c925f",
          screenXXL: 1920,
          screenXXLMin: 1920,
        },
      }}
    >
      <link
        rel="preload"
        href="/src/styles/fonts/NotoSansCJKkr-Light.otf"
        as="font"
        type="font/otf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/src/styles/fonts/NotoSansCJKkr-Regular.otf"
        as="font"
        type="font/otf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/src/styles/fonts/NotoSansCJKkr-Medium.otf"
        as="font"
        type="font/otf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/src/styles/fonts/NotoSansCJKkr-Bold.otf"
        as="font"
        type="font/otf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/src/styles/fonts/NotoSansCJKkr-Light.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/src/styles/fonts/NotoSansCJKkr-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/src/styles/fonts/NotoSansCJKkr-Medium.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/src/styles/fonts/NotoSansCJKkr-Bold.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      {children}
    </ConfigProvider>
  );
}

export default AntdConfigProvider;
