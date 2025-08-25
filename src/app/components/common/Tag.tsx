import { Tag as AntdTag, TagProps } from "antd";
import { ETagType } from "@/interfaces/app";
import { cn } from "@/libs/utils";

type TTagProps = TagProps & {
  type?: ETagType;
};

const getTagColors = (type: ETagType) => {
  switch (type) {
    case ETagType.ACTIVE:
      return {
        bg: "var(--color-primary-10)",
        text: "var(--color-primary-105)",
        border: "var(--color-primary-100)",
      };
    case ETagType.INACTIVE:
      return {
        bg: "var(--color-grey-10)",
        text: "var(--color-grey-80)",
        border: "var(--color-grey-40)",
      };
    case ETagType.DELETED:
      return {
        bg: "var(--color-error-10)",
        text: "var(--color-error-105)",
        border: "var(--color-error-100)",
      };
    case ETagType.SECONDARY:
      return {
        bg: "var(--color-grey-8)",
        text: "var(--color-grey-80)",
        border: "var(--color-grey-40)",
      };
    default:
      return {
        bg: "var(--color-primary-10)",
        text: "var(--color-primary-105)",
        border: "var(--color-primary-100)",
      };
  }
};

function Tag(props: TTagProps) {
  const { type = ETagType.ACTIVE, className, style, ...rest } = props;

  const colors = getTagColors(type);

  return (
    <AntdTag
      {...rest}
      className={cn("!rounded-[8px] !px-2 !py-1 font-bold", className)}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
        ...style,
      }}
    />
  );
}

export default Tag;
