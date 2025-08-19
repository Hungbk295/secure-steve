declare module 'react-router-dom' {
  import { FC, ReactNode, ComponentType } from 'react';
  
  export interface BrowserRouterProps {
    basename?: string;
    children?: ReactNode;
    window?: Window;
  }
  
  export const BrowserRouter: FC<BrowserRouterProps>;
  export const Routes: FC<{ children?: ReactNode }>;
  export const Route: FC<any>;
  export const Navigate: FC<any>;
  export const useNavigate: () => any;
  export const useLocation: () => any;
  export const useSearchParams: () => any;
}