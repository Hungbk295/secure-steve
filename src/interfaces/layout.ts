import { EUserRole } from "./app";

export interface ItemRoute {
  key: string;
  components: React.ReactNode;
  layout: string;
  private: boolean;
  permission?: EUserRole;
}
