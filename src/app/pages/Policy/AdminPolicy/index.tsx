import React, { useState } from "react";
import { Breadcrumb, Card, Button, message, Divider } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import PolicyFilterBar from "./components/PolicyFilterBar";
import ImportanceTemplateDropdown from "./components/ImportanceTemplateDropdown";
import SensitivityRangeTable from "./components/SensitivityRangeTable";
import PolicyActionButtons from "./components/PolicyActionButtons";
import PolicyActionModal from "./components/PolicyActionModal";
import { PolicyItem, PolicyFilter, ImportanceTemplate, SensitivityConfig } from "@/interfaces/policy";

const mockPolicyData: PolicyItem[] = [
  {
    id: "policy_001",
    cluster_name: "Production-Cluster-A",
    server_manager: "김철수|개발팀",
    department: "개발팀",
    malware_definition_ref: 70,
    malware_definition_user: 75,
    isolation_ref: 70,
    isolation_user: 85,
    report_ref: 80,
    report_user: 85,
    regular_report_ref: 85,
    regular_report_user: 90,
  },
  {
    id: "policy_002", 
    cluster_name: "Development-Cluster-B",
    server_manager: "이영희|보안팀",
    department: "보안팀",
    malware_definition_ref: 70,
    malware_definition_user: 70,
    isolation_ref: 70,
    isolation_user: 90,
    report_ref: 80,
    report_user: 80,
    regular_report_ref: 85,
    regular_report_user: 85,
  },
  {
    id: "policy_003",
    cluster_name: "Testing-Cluster-C", 
    server_manager: "박민수|운영팀",
    department: "운영팀",
    malware_definition_ref: 70,
    malware_definition_user: 80,
    isolation_ref: 70,
    isolation_user: 95,
    report_ref: 80,
    report_user: 85,
    regular_report_ref: 85,
    regular_report_user: 95,
  },
  {
    id: "policy_004",
    cluster_name: "Security-Cluster-D",
    server_manager: "최지연|인프라팀", 
    department: "인프라팀",
    malware_definition_ref: 70,
    malware_definition_user: 85,
    isolation_ref: 70,
    isolation_user: 100,
    report_ref: 80,
    report_user: 90,
    regular_report_ref: 85,
    regular_report_user: 100,
  },
];

const AdminPolicy: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [policyData, setPolicyData] = useState<PolicyItem[]>(mockPolicyData);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "api_select">("add");

  const handleFilterChange = (newFilters: PolicyFilter) => {
    console.log("Applying filters:", newFilters);
    // TODO: Fetch filtered data based on filters
  };

  const handleSelectionChange = (keys: string[]) => {
    setSelectedRowKeys(keys);
  };

  // Apply template values to selected items
  const handleTemplateApply = (template: ImportanceTemplate | null) => {
    if (!template || selectedRowKeys.length === 0) {
      if (!template) {
        message.info("Template cleared");
      } else {
        message.warning("Please select at least one item to apply the template");
      }
      return;
    }

    const updatedData = policyData.map(item => {
      if (selectedRowKeys.includes(item.id)) {
        // Apply template values, ensuring minimum thresholds are met
        const newItem = {
          ...item,
          isolation_user: Math.max(template.isolation_value, 70), // Min constraint
          report_user: Math.max(template.reporting_value, 80), // Min constraint  
          // Keep regular_report as is or use a default increment
          regular_report_user: Math.max(item.regular_report_user, 85),
        };
        return newItem;
      }
      return item;
    });

    setPolicyData(updatedData);
    message.success(`Template "${template.name}" applied to ${selectedRowKeys.length} selected items`);
  };

  // Handle individual progress bar changes
  const handleConfigChange = (id: string, config: Partial<SensitivityConfig>) => {
    const updatedData = policyData.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...config,
        };
      }
      return item;
    });
    setPolicyData(updatedData);
  };

  const isValidConfig = () => {
    return selectedRowKeys.every(id => {
      const item = policyData.find(p => p.id === id);
      if (!item) return true;
      
      return (
        item.isolation_user >= 70 &&
        item.report_user >= 80 &&
        item.regular_report_user >= 85
      );
    });
  };

  // Modal handlers
  const handlePolicyAdd = () => {
    setModalMode("add");
    setModalVisible(true);
  };

  const handlePolicyEdit = () => {
    setModalMode("edit");
    setModalVisible(true);
  };

  const handleAPISelect = () => {
    setModalMode("api_select");
    setModalVisible(true);
  };

  const handleApplyPolicy = async () => {
    if (!isValidConfig()) {
      message.error("Please ensure all sensitivity values meet the minimum requirements");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Applying policy to:", selectedRowKeys);
      console.log("Policy data:", policyData.filter(item => selectedRowKeys.includes(item.id)));
      
      message.success(`Policy applied successfully to ${selectedRowKeys.length} items`);
      setSelectedRowKeys([]); // Clear selection after successful application
      
      // Auto refresh (simulate)
      console.log("Auto refreshing data...");
      
    } catch (error) {
      message.error("Failed to apply policy");
      console.error("Policy application error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalSave = async (data: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Saving policy data:", data);
      message.success(`Policy ${modalMode === "add" ? "created" : modalMode === "edit" ? "updated" : "API applied"} successfully`);
      
      setModalVisible(false);
      setSelectedRowKeys([]); // Clear selection
      
      // Auto refresh
      console.log("Auto refreshing data...");
      
    } catch (error) {
      message.error(`Failed to ${modalMode} policy`);
      console.error("Modal save error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Operating Policy placeholder section
  const handleOperatingPolicyClick = () => {
    message.info("Operating Policy section will be implemented later");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>Policy</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">Administrator Policy</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          관리자 정책 설정
        </h1>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-4">
        {/* Filter Bar */}
        <Card
          size="small"
          className="policy-filter-bar"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border-100)",
            borderRadius: "8px",
          }}
        >
          <PolicyFilterBar 
            loading={loading} 
            onFilterChange={handleFilterChange}
          />
        </Card>

        {/* Main Configuration Section */}
        <Card size="small" className="policy-configuration-card">
          {/* Importance Template Dropdown */}
          <ImportanceTemplateDropdown
            onTemplateSelect={handleTemplateApply}
            disabled={loading}
          />

          <Divider />

          {/* Sensitivity Range Table */}
          <SensitivityRangeTable
            data={policyData}
            selectedRowKeys={selectedRowKeys}
            onSelectionChange={handleSelectionChange}
            onConfigChange={handleConfigChange}
            loading={loading}
          />

          {/* Action Buttons */}
          <div className="mt-4">
            <PolicyActionButtons
              selectedCount={selectedRowKeys.length}
              isValidConfig={isValidConfig()}
              onPolicyAdd={handlePolicyAdd}
              onPolicyEdit={handlePolicyEdit}
              onApplyPolicy={handleApplyPolicy}
              onAPISelect={handleAPISelect}
              loading={loading}
            />
          </div>

          <Divider />

          {/* Operating Policy Section (Placeholder) */}
          <div className="py-6 text-center bg-gray-50 rounded-lg">
            <div className="mb-3">
              <SettingOutlined className="text-2xl text-gray-400 mb-2" />
              <div className="text-lg font-medium text-gray-600">
                Operating Policy
              </div>
            </div>
            <div className="text-gray-500 mb-3">
              This section will be implemented later
            </div>
            <Button 
              type="link" 
              onClick={handleOperatingPolicyClick}
            >
              Click to navigate (Placeholder)
            </Button>
          </div>
        </Card>
      </div>

      {/* Action Modal */}
      <PolicyActionModal
        visible={modalVisible}
        mode={modalMode}
        selectedCount={selectedRowKeys.length}
        onCancel={() => setModalVisible(false)}
        onSave={handleModalSave}
        loading={loading}
      />
    </div>
  );
};

export default AdminPolicy;