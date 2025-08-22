import { Fragment } from "react";
import { Divider } from "antd";
import { cn } from "@/libs/utils";

function Footer() {
  const FOOTER_LIST = [
    { id: 1, label: "Service Agreement" },
    { id: 2, label: "Privacy Policy" },
    { id: 3, label: "Development Guide" },
    {
      id: 4,
      label: "COPYRIGHT CO. LTD. ALL RIGHT RESERVED.",
    },
  ];

  return (
    <footer className="p-8 flex items-center gap-2 border-t border-grey-10 -translate-x-10 w-[calc(100%+72px)]">
      <div className="flex gap-2 items-center">
        {FOOTER_LIST.map((item, index) => {
          const isLastItem = index === FOOTER_LIST.length - 1;

          return (
            <Fragment key={item.id}>
              <p
                className={cn(
                  "",
                  index !== FOOTER_LIST.length - 1
                    ? "font-bold text-grey-80 text-sm"
                    : "text-[13px] font-normal text-grey-35"
                )}
              >
                {item.label}
              </p>

              {!isLastItem && (
                <Divider
                  type="vertical"
                  className="!h-[20px] border-grey-10 border-[1px]"
                />
              )}
            </Fragment>
          );
        })}
      </div>
      <div></div>
    </footer>
  );
}

export default Footer;
