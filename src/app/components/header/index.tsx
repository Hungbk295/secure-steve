import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";
import { getSelectedKeySidebar } from "@/utils/app";
import { DynamicKeyObject } from "@/interfaces/app";
import { uniqBy } from "lodash";

function Header() {
  const navigate = useNavigate();

  function handleClickBreadcrumb(e: any, path: string) {
    e.preventDefault();
    if (!path) return;
    navigate(path);
  }

  function getBreadCrumbItems() {
    const pathName = window.location.pathname;
    const { breakcrumbs = [] } = getSelectedKeySidebar(pathName);
    const result = breakcrumbs
      .map((item: DynamicKeyObject, index: number) => {
        const href =
          index !== breakcrumbs.length - 1 && !item.disable
            ? item.key
            : undefined;
        return {
          href,
          title: item.label,
          onClick: (e: any) => handleClickBreadcrumb(e, href),
        };
      })
      .slice(-3);

    return uniqBy([...result].reverse(), "title").reverse();
  }

  return (
    <header>
      <Breadcrumb className="h-[37px] !py-2" items={getBreadCrumbItems()} />
    </header>
  );
}

export default Header;
