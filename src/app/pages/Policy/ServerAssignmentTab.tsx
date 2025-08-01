import { useEffect, useCallback } from "react";
import { message } from "antd";
import { useAppDispatch, useAppSelector } from "@/store";
import FilterBar from "./FilterBar";
import ServerTable from "./ServerTable";
import BulkActionControl from "./BulkActionControl";
import ClusterPopup from "./ClusterPopup";
import ManagerPopup from "./ManagerPopup";
import {
  fetchServers,
  fetchClusters,
  fetchManagers,
  checkClusterDuplicate,
  assignCluster,
  assignManager,
  setSelectedRows,
  clearSelection,
  setFilters,
  setPagination,
  setClusterPopupVisible,
  setManagerPopupVisible,
  resetFilters,
  selectServers,
  selectClusters,
  selectManagers,
  selectSelectedRows,
  selectSelectedRowKeys,
  selectFilters,
  selectPagination,
  selectClusterPopupVisible,
  selectManagerPopupVisible,
  selectServersLoading,
  // selectClustersLoading,
  // selectManagersLoading,
  selectAssignmentLoading,
} from "@/store/analyzeDetectionSlice";

function ServerAssignmentTab() {
  const dispatch = useAppDispatch();

  // Selectors
  const servers = useAppSelector(selectServers);
  const clusters = useAppSelector(selectClusters);
  const managers = useAppSelector(selectManagers);
  const selectedRows = useAppSelector(selectSelectedRows);
  const selectedRowKeys = useAppSelector(selectSelectedRowKeys);
  const filters = useAppSelector(selectFilters);
  const pagination = useAppSelector(selectPagination);
  const clusterPopupVisible = useAppSelector(selectClusterPopupVisible);
  const managerPopupVisible = useAppSelector(selectManagerPopupVisible);
  const serversLoading = useAppSelector(selectServersLoading);
  // const clustersLoading = useAppSelector(selectClustersLoading);
  // const managersLoading = useAppSelector(selectManagersLoading);
  const assignmentLoading = useAppSelector(selectAssignmentLoading);

  // Load initial data
  useEffect(() => {
    dispatch(fetchClusters());
    dispatch(fetchManagers());
    loadServers();
  }, [dispatch]);

  // Load servers with current filters and pagination
  const loadServers = useCallback(() => {
    const params = {
      ...filters,
      page: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch(fetchServers(params));
  }, [dispatch, filters, pagination.current, pagination.pageSize]);

  useEffect(() => {
    loadServers();
  }, [loadServers]);

  const handleClusterChange = (value: string) => {
    dispatch(setFilters({ clusterName: value }));
    dispatch(setPagination({ current: 1 })); // Reset to first page
    dispatch(clearSelection()); // Clear selection when filter changes
  };

  const handleManagerChange = (value: string) => {
    dispatch(setFilters({ serverManager: value }));
    dispatch(setPagination({ current: 1 })); // Reset to first page
    dispatch(clearSelection()); // Clear selection when filter changes
  };

  const handleFilterReset = () => {
    dispatch(resetFilters());
    dispatch(setPagination({ current: 1 }));
    dispatch(clearSelection());
  };

  const handleFilterApply = () => {
    dispatch(setPagination({ current: 1 }));
    dispatch(clearSelection());
    loadServers();
  };

  const handleSelectChange = (
    selectedRowKeys: string[],
    selectedRows: any[]
  ) => {
    dispatch(setSelectedRows({ selectedRowKeys, selectedRows }));
  };

  const handleMasterCheckboxChange = (checked: boolean) => {
    if (checked) {
      const allKeys = servers.map((server) => server.id);
      dispatch(
        setSelectedRows({ selectedRowKeys: allKeys, selectedRows: servers })
      );
    } else {
      dispatch(clearSelection());
    }
  };

  const handleBulkSelectMenuClick = (action: "selectAll" | "selectNone") => {
    if (action === "selectAll") {
      const allKeys = servers.map((server) => server.id);
      dispatch(
        setSelectedRows({ selectedRowKeys: allKeys, selectedRows: servers })
      );
    } else {
      dispatch(clearSelection());
    }
  };

  const handleTableChange = (paginationConfig: any) => {
    dispatch(
      setPagination({
        current: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
      })
    );
    dispatch(clearSelection());
  };

  const handleBulkActionSelect = (action: "cluster" | "manager") => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select servers first");
      return;
    }

    if (action === "cluster") {
      dispatch(setClusterPopupVisible(true));
    } else {
      dispatch(setManagerPopupVisible(true));
    }
  };

  const handleClusterAssign = async (
    clusterName: string,
    addToExisting: boolean
  ) => {
    try {
      await dispatch(
        assignCluster({
          clusterName,
          serverIds: selectedRowKeys,
          addToExisting,
        })
      ).unwrap();

      message.success("변경 사항이 저장되었습니다", 3);
      loadServers();
    } catch (error) {
      console.error("Failed to assign cluster:", error);
    }
  };

  const handleClusterDuplicateCheck = async (
    clusterName: string
  ): Promise<boolean> => {
    try {
      const result = await dispatch(
        checkClusterDuplicate(clusterName)
      ).unwrap();
      return result.data?.exists || false;
    } catch (error) {
      console.error("Failed to check cluster name:", error);
      return false;
    }
  };

  // Manager assignment handlers
  const handleManagerAssign = async (managerId: string) => {
    try {
      await dispatch(
        assignManager({
          managerId,
          serverIds: selectedRowKeys,
        })
      ).unwrap();

      message.success("변경 사항이 저장되었습니다", 3);
      loadServers(); // Refresh data
    } catch (error) {
      console.error("Failed to assign manager:", error);
    }
  };

  // Prepare data for components
  const clusterOptions = clusters.map((cluster) => ({
    label: cluster.label,
    value: cluster.value,
  }));

  const managerOptions = managers.map((manager) => ({
    label: `${manager.name} (${manager.department})`,
    value: manager.id,
  }));

  const selectedServerIPs = selectedRows.map((server) => server.serverIP);

  const paginationConfig = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} servers`,
    pageSizeOptions: ["10", "20", "30", "40", "50"],
  };

  return (
    <div className="server-assignment-tab space-y-4">
      {/* Filter Bar */}
      <FilterBar
        clusterName={filters.clusterName}
        serverManager={filters.serverManager}
        clusterOptions={clusterOptions}
        managerOptions={managerOptions}
        onClusterChange={handleClusterChange}
        onManagerChange={handleManagerChange}
        onReset={handleFilterReset}
        onApply={handleFilterApply}
        loading={serversLoading}
      />

      {/* Bulk Action Control */}
      <BulkActionControl
        selectedCount={selectedRowKeys.length}
        onActionSelect={handleBulkActionSelect}
        visible={selectedRowKeys.length > 0}
      />

      {/* Server Table */}
      <ServerTable
        dataSource={servers}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={handleSelectChange}
        onMasterCheckboxChange={handleMasterCheckboxChange}
        onBulkSelectMenuClick={handleBulkSelectMenuClick}
        loading={serversLoading}
        pagination={paginationConfig}
        onChange={handleTableChange}
      />

      {/* Cluster Assignment Popup */}
      <ClusterPopup
        visible={clusterPopupVisible}
        selectedServerIPs={selectedServerIPs}
        onCancel={() => dispatch(setClusterPopupVisible(false))}
        onConfirm={handleClusterAssign}
        onCheckDuplicate={handleClusterDuplicateCheck}
        loading={assignmentLoading}
      />

      {/* Manager Assignment Popup */}
      <ManagerPopup
        visible={managerPopupVisible}
        selectedServerIPs={selectedServerIPs}
        managers={managers}
        onCancel={() => dispatch(setManagerPopupVisible(false))}
        onConfirm={handleManagerAssign}
        loading={assignmentLoading}
      />
    </div>
  );
}

export default ServerAssignmentTab;
