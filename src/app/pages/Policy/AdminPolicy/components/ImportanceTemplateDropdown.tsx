import { Select, Typography } from "antd";
import { ImportanceTemplate } from "@/interfaces/policy";

const { Text } = Typography;

interface ImportanceTemplateDropdownProps {
  onTemplateSelect: (template: ImportanceTemplate | null) => void;
  disabled?: boolean;
}

const importanceTemplates: ImportanceTemplate[] = [
  {
    id: "best",
    name: "Best",
    label: "Best — Isolation 90%, Reporting 70%",
    isolation_value: 90,
    reporting_value: 70,
  },
  {
    id: "award",
    name: "Award", 
    label: "Award — Isolation 90%, Reporting 90%",
    isolation_value: 90,
    reporting_value: 90,
  },
  {
    id: "middle",
    name: "Middle",
    label: "Middle — Quarantine 100%, Reported 80%",
    isolation_value: 100,
    reporting_value: 80,
  },
  {
    id: "under",
    name: "Under",
    label: "Under — Isolation 100%, Reporting 90%",
    isolation_value: 100,
    reporting_value: 90,
  },
];

function ImportanceTemplateDropdown({ 
  onTemplateSelect, 
  disabled = false 
}: ImportanceTemplateDropdownProps) {

  const handleChange = (templateId: string) => {
    if (!templateId) {
      onTemplateSelect(null);
      return;
    }
    
    const template = importanceTemplates.find(t => t.id === templateId);
    if (template) {
      onTemplateSelect(template);
    }
  };

  return (
    <div className="importance-template-dropdown mb-6">
      <Text strong className="block mb-2">
        Select Importance Template
      </Text>
      <Select
        placeholder="Choose a template to apply to sensitivity ranges"
        className="w-full"
        size="large"
        onChange={handleChange}
        disabled={disabled}
        allowClear
        style={{ maxWidth: 500 }}
      >
        {importanceTemplates.map((template) => (
          <Select.Option key={template.id} value={template.id}>
            <div className="py-1">
              <div className="font-medium text-sm">{template.name}</div>
              <div className="text-xs text-gray-500">
                Isolation {template.isolation_value}%, Reporting {template.reporting_value}%
              </div>
            </div>
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}

export default ImportanceTemplateDropdown;