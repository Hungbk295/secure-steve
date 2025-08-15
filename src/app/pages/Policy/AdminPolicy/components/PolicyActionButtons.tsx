import { Button, Space } from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  CheckOutlined,
  ApiOutlined 
} from "@ant-design/icons";

interface PolicyActionButtonsProps {
  selectedCount: number;
  isValidConfig: boolean;
  onPolicyAdd: () => void;
  onPolicyEdit: () => void;
  onApplyPolicy: () => void;
  onAPISelect: () => void;
  loading?: boolean;
}

function PolicyActionButtons({
  selectedCount,
  isValidConfig,
  onPolicyAdd,
  onPolicyEdit, 
  onApplyPolicy,
  onAPISelect,
  loading = false
}: PolicyActionButtonsProps) {

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex justify-end mb-4">
      <Space size="middle">
        <Button
          type="default"
          icon={<PlusOutlined />}
          onClick={onPolicyAdd}
          disabled={loading}
        >
          Policy Add
        </Button>
        
        <Button
          type="default"
          icon={<EditOutlined />}
          onClick={onPolicyEdit}
          disabled={loading}
        >
          Policy Edit
        </Button>
        
        <Button
          type="default"
          icon={<ApiOutlined />}
          onClick={onAPISelect}
          disabled={loading}
        >
          API 선택
        </Button>
        
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={onApplyPolicy}
          disabled={loading || !isValidConfig}
          loading={loading}
        >
          Apply (완료)
        </Button>
      </Space>
    </div>
  );
}

export default PolicyActionButtons;