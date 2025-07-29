import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { cn } from "@/libs/utils";
import { useAppSelector } from "@/store";
import { selectActionIsNavCollapsed } from "@/store/appSlide";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout(props: DefaultLayoutProps) {
  const { children } = props;
  const isNavCollapsed = useAppSelector(selectActionIsNavCollapsed);

  return (
    <div
      className={cn(
        "bg-grey-3 grid transition-all duration-300",
        isNavCollapsed ? "grid-cols-[80px_1fr]" : "grid-cols-[256px_1fr]"
      )}
    >
      <Sidebar collapsed={isNavCollapsed} />
      <div
        className={cn(
          "!pt-8 px-10 min-h-screen",
          isNavCollapsed ? "w-[calc(100vw-80px)]" : "w-[calc(100vw-256px)]"
        )}
      >
        <Header />
        <main className="flex-1">
          <div className="flex-1 min-h-[calc(100vh-70px-104px)]">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
