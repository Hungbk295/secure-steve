import { cn } from "@/libs/utils";
import { DynamicKeyObject } from "@/interfaces/app";
import { EAccountDetailGeneralSize } from "@/interfaces/account";

interface IAccountDetailGeneralProps {
  className?: string;
  data: DynamicKeyObject;
  size?: EAccountDetailGeneralSize;
}

function AccountDetailGeneral(props: IAccountDetailGeneralProps) {
  const {
    className,
    data: { createdAt, createdBy, updatedAt, updatedBy, lastAccessedAt },
    size = EAccountDetailGeneralSize.SMALL,
  } = props;

  return (
    <div className={cn("flex flex-col gap-4 account-detail-general", className, size)}>
      {createdAt && (
        <div className="flex column gap-25">
          <div className="child-column">
            <div className="text-xs">Created at</div>
            <div className="text-sm">{createdAt}</div>
          </div>
          <div className="child-column">
            <div className="text-xs">Created by</div>
            <div className="text-sm">{createdBy}</div>
          </div>
        </div>
      )}
      {updatedAt && (
        <div className="flex column">
          <div className="child-column">
            <div className="text-xs">Updated at</div>
            <div className="text-sm">{updatedAt}</div>
          </div>
          <div className="child-column">
            <div className="text-xs">Updated by</div>
            <div className="text-sm">{updatedBy}</div>
          </div>
        </div>
      )}
      {lastAccessedAt && (
        <div className="child-column">
          <div className="text-xs">Last accessed at</div>
          <div className="text-sm">{lastAccessedAt}</div>
        </div>
      )}
    </div>
  );
}

export default AccountDetailGeneral;
