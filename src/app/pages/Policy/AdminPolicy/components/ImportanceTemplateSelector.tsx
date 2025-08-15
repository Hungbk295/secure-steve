import { Card, Select, Typography } from "antd";
import { ImportanceTemplate, SensitivityConfig } from "@/interfaces/policy";

const { Title, Text } = Typography;
const { Option } = Select;

interface ImportanceTemplateSelectorProps {
  onTemplateApply: (config: SensitivityConfig) => void;
  disabled?: boolean;
}

const importanceTemplates: ImportanceTemplate[] = [
  {
    id: "best",
    name: "best",
    label: "Best — Isolation 90%, Reporting 70%",
    isolation_value: 90,
    reporting_value: 70,
  },
  {
    id: "award",
    name: "award", 
    label: "Award — Isolation 90%, Reporting 90%",
    isolation_value: 90,
    reporting_value: 90,
  },
  {
    id: "middle",
    name: "middle",
    label: "Middle — Quarantine 100%, Reported 80%",
    isolation_value: 100,
    reporting_value: 80,
  },
  {
    id: "under",
    name: "under",
    label: "Under — Isolation 100%, Reporting 90%",
    isolation_value: 100,
    reporting_value: 90,
  },
];

function ImportanceTemplateSelector({ 
  onTemplateApply, 
  disabled = false 
}: ImportanceTemplateSelectorProps) {

  const handleTemplateSelect = (templateId: string) => {
    const template = importanceTemplates.find(t => t.id === templateId);
    
    if (template) {
      // Apply template values to sensitivity configuration
      const newConfig: SensitivityConfig = {
        malware_definition: 70, // Default base value
        isolation: template.isolation_value,
        report: template.reporting_value,
        regular_report: 80, // Default base value
      };
      
      // Ensure all values meet minimum thresholds
      const adjustedConfig: SensitivityConfig = {
        malware_definition: Math.max(newConfig.malware_definition, 70),
        isolation: Math.max(newConfig.isolation, 90),
        report: Math.max(newConfig.report, 70),
        regular_report: Math.max(newConfig.regular_report, 80),
      };
      
      console.log("Applying importance template:", template.name, adjustedConfig);
      onTemplateApply(adjustedConfig);
    }
  };

  return (
    <Card 
      title="Importance Template" 
      className="importance-template-selector"
      size="small"
    >
      <div className="space-y-4">
        <div>
          <Title level={5} className="!mb-2">
            Select Importance Template
          </Title>
          <Text type="secondary" className="text-sm">
            Choose a predefined policy template to automatically configure sensitivity ranges
          </Text>
        </div>

        <Select
          placeholder="Select a template to apply"
          className="w-full"
          size="large"
          onChange={handleTemplateSelect}
          disabled={disabled}
          allowClear
        >
          {importanceTemplates.map((template) => (
            <Option key={template.id} value={template.id}>
              <div className="py-1">
                <div className="font-medium">{template.name.toUpperCase()}</div>
                <div className="text-xs text-gray-500">
                  Isolation {template.isolation_value}%, Reporting {template.reporting_value}%
                </div>
              </div>
            </Option>
          ))}
        </Select>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Text className="text-sm text-blue-800">
            <strong>Note:</strong> Selecting a template will automatically adjust the sensitivity 
            sliders below. Values that fall below the minimum reference thresholds will be 
            automatically raised to meet the required constraints.
          </Text>
        </div>

        {/* Template Details Table */}
        <div className="mt-4">
          <Title level={5} className="!mb-3">
            Template Details
          </Title>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Template</th>
                  <th className="px-3 py-2 text-left font-medium">Isolation</th>
                  <th className="px-3 py-2 text-left font-medium">Reporting</th>
                </tr>
              </thead>
              <tbody>
                {importanceTemplates.map((template) => (
                  <tr key={template.id} className="border-t border-gray-200">
                    <td className="px-3 py-2 font-medium capitalize">
                      {template.name}
                    </td>
                    <td className="px-3 py-2">{template.isolation_value}%</td>
                    <td className="px-3 py-2">{template.reporting_value}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ImportanceTemplateSelector;