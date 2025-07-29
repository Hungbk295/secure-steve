import { Tag as AntdTag, TagProps } from "antd";
import { ETagType } from "@/interfaces/app";
import { cn } from "@/libs/utils";
import { getTagColors } from "@/constants/tagColors";

type TTagProps = TagProps & {
  type?: ETagType;
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
