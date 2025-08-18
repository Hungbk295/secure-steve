import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";

// Admin Policy State Types
interface SensitivityItem {
  key: string;
  항목: string;
  기준_확도: number;
  사용자_설정_가능_범위: string;
}

interface ImportanceItem {
  key: string;
  중요도: string;
  격리_임계치: string;
  보고_임계치: string;
}

interface OperationItem {
  key: string;
  구분: string;
  기본값: string;
  옵션?: string[];
  체크박스?: string[];
  selected_option?: string;
  selected_checkboxes?: string[];
}

interface CategoryItem {
  key: string;
  구분: string;
  확도_가이드: string;
  사용자_입력: string;
}

type IAdminPolicyState = {
  // Sensitivity Settings
  sensitivityItems: SensitivityItem[];
  sensitivityValues: {
    멀웨어정의: number;
    격리: number;
    보고알림: number;
    정기리포트: number;
  };

  // Importance Template
  importanceItems: ImportanceItem[];
  selectedImportance: string[];
  categoryItems: CategoryItem[];

  // Operation Policy
  operationItems: OperationItem[];

  // UI State
  loading: boolean;
  error: string | null;
  policyAddModalVisible: boolean;
  policyEditModalVisible: boolean;
  selectedApi: string;
  apiDescription: string;
};

const initialAdminPolicyState: IAdminPolicyState = {
  sensitivityItems: [
    {
      key: "1",
      항목: "멀웨어 정의",
      기준_확도: 70,
      사용자_설정_가능_범위:
        "사용자는 (기준확도) 이하의 확도를 멀웨어로 정의할 수 없습니다.",
    },
    {
      key: "2",
      항목: "격리",
      기준_확도: 90,
      사용자_설정_가능_범위:
        "사용자는 (기준확도)보다 작은 확도의 멀웨어를 격리할 수 없습니다.",
    },
    {
      key: "3",
      항목: "보고(알림)",
      기준_확도: 70,
      사용자_설정_가능_범위:
        "사용자는 (기준확도)보다 작은 확도의 알림이 제공되지 않습니다.",
    },
    {
      key: "4",
      항목: "정기 리포트",
      기준_확도: 80,
      사용자_설정_가능_범위:
        "관리자에게 정기 리포트에서 (기준확도)보다 큰 확도의 멀웨어에 대한 상세보고서를 제공합니다.",
    },
  ],
  sensitivityValues: {
    멀웨어정의: 70,
    격리: 90,
    보고알림: 70,
    정기리포트: 80,
  },

  importanceItems: [
    { key: "1", 중요도: "최상", 격리_임계치: "90%", 보고_임계치: "70%" },
    { key: "2", 중요도: "상", 격리_임계치: "90%", 보고_임계치: "90%" },
    { key: "3", 중요도: "중", 격리_임계치: "100%", 보고_임계치: "80%" },
    { key: "4", 중요도: "하", 격리_임계치: "100%", 보고_임계치: "90%" },
  ],
  selectedImportance: [],
  categoryItems: [
    {
      key: "1",
      구분: "멀웨어 정의",
      확도_가이드: "기준 이상 입력",
      사용자_입력: "(default: 기준 rate)",
    },
    {
      key: "2",
      구분: "격리",
      확도_가이드: "기준 이상 입력",
      사용자_입력: "(default: 기준 rate)",
    },
    {
      key: "3",
      구분: "보고(알림)",
      확도_가이드: "기준 이상 입력",
      사용자_입력: "(default: 기준 rate)",
    },
    {
      key: "4",
      구분: "정기 리포트",
      확도_가이드: "기준 이상 입력",
      사용자_입력: "(default: 기준 rate)",
    },
  ],

  operationItems: [
    {
      key: "1",
      구분: "알림 최신성",
      기본값: "1 day",
      옵션: ["1day", "3day", "7day"],
      selected_option: "1day",
    },
    {
      key: "2",
      구분: "이력 저장 기간",
      기본값: "30 day",
      옵션: ["30day", "60day", "90day"],
      selected_option: "30day",
    },
    {
      key: "3",
      구분: "정기 리포트 기간",
      기본값: "7 day",
      옵션: ["7day", "14day", "21day", "30day"],
      selected_option: "7day",
    },
    {
      key: "4",
      구분: "주간 리포트 항목",
      기본값: "",
      체크박스: ["중요도 별 탐지/조치", "주요 탐지 멀웨어", "다건충 서버"],
      selected_checkboxes: [],
    },
  ],

  loading: false,
  error: null,
  policyAddModalVisible: false,
  policyEditModalVisible: false,
  selectedApi: "",
  apiDescription: "우리는 API 선택 시 API에 대한 설명을 넣는 API를 개발할 것",
};

// Async Actions
export const actionSaveSensitivitySettings = createAsyncThunk(
  "adminPolicy/actionSaveSensitivitySettings",
  async (
    sensitivityValues: IAdminPolicyState["sensitivityValues"],
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() < 0.1) {
        throw new Error("Failed to save sensitivity settings");
      }

      return sensitivityValues;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to save sensitivity settings"
      );
    }
  }
);

export const actionSaveImportanceTemplate = createAsyncThunk(
  "adminPolicy/actionSaveImportanceTemplate",
  async (
    {
      importanceItems,
      selectedImportance,
    }: {
      importanceItems: ImportanceItem[];
      selectedImportance: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() < 0.1) {
        throw new Error("Failed to save importance template");
      }

      return { importanceItems, selectedImportance };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to save importance template"
      );
    }
  }
);

export const actionSaveOperationPolicy = createAsyncThunk(
  "adminPolicy/actionSaveOperationPolicy",
  async (operationItems: OperationItem[], { rejectWithValue }) => {
    try {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() < 0.1) {
        throw new Error("Failed to save operation policy");
      }

      return operationItems;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to save operation policy"
      );
    }
  }
);

export const actionAddPolicy = createAsyncThunk(
  "adminPolicy/actionAddPolicy",
  async (
    { selectedApi, description }: { selectedApi: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (Math.random() < 0.1) {
        throw new Error("Failed to add policy");
      }

      return { selectedApi, description, addedAt: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to add policy"
      );
    }
  }
);

// Admin Policy Slice
export const adminPolicySlice = createSlice({
  name: "adminPolicy",
  initialState: initialAdminPolicyState,
  reducers: {
    updateSensitivityValue: (state, action) => {
      const { key, value } = action.payload;
      state.sensitivityValues[key as keyof typeof state.sensitivityValues] =
        value;

      // Update corresponding sensitivity item
      const item = state.sensitivityItems.find(
        (item) => item.항목.replace(/[\s()]/g, "") === key
      );
      if (item) {
        item.기준_확도 = value;
      }
    },

    toggleImportanceSelection: (state, action) => {
      const importance = action.payload;
      const index = state.selectedImportance.indexOf(importance);
      if (index === -1) {
        state.selectedImportance.push(importance);
      } else {
        state.selectedImportance.splice(index, 1);
      }
    },

    updateImportanceItem: (state, action) => {
      const { key, field, value } = action.payload;
      const item = state.importanceItems.find((item) => item.key === key);
      if (item) {
        (item as any)[field] = value;
      }
    },

    updateOperationSelection: (state, action) => {
      const { key, type, value } = action.payload;
      const item = state.operationItems.find((item) => item.key === key);
      if (item) {
        if (type === "option") {
          item.selected_option = value;
        } else if (type === "checkbox") {
          if (!item.selected_checkboxes) {
            item.selected_checkboxes = [];
          }
          const index = item.selected_checkboxes.indexOf(value);
          if (index === -1) {
            item.selected_checkboxes.push(value);
          } else {
            item.selected_checkboxes.splice(index, 1);
          }
        }
      }
    },

    addCategoryItem: (state, action) => {
      const newItem: CategoryItem = {
        key: String(state.categoryItems.length + 1),
        구분: action.payload.구분 || "",
        확도_가이드: "기준 이상 입력",
        사용자_입력: "(default: 기준 rate)",
      };
      state.categoryItems.push(newItem);
    },

    updateCategoryItem: (state, action) => {
      const { key, field, value } = action.payload;
      const item = state.categoryItems.find((item) => item.key === key);
      if (item) {
        (item as any)[field] = value;
      }
    },

    setPolicyAddModalVisible: (state, action) => {
      state.policyAddModalVisible = action.payload;
    },

    setPolicyEditModalVisible: (state, action) => {
      state.policyEditModalVisible = action.payload;
    },

    setSelectedApi: (state, action) => {
      state.selectedApi = action.payload;
      // TODO: In real implementation, fetch API description from backend
      state.apiDescription = `Description for ${action.payload}`;
    },

    clearError: (state) => {
      state.error = null;
    },

    resetToDefaults: () => {
      return { ...initialAdminPolicyState };
    },
  },

  extraReducers: (builder) => {
    builder
      // Save Sensitivity Settings
      .addCase(actionSaveSensitivitySettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionSaveSensitivitySettings.fulfilled, (state, action) => {
        state.loading = false;
        state.sensitivityValues = action.payload;
        state.error = null;
      })
      .addCase(actionSaveSensitivitySettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Save Importance Template
      .addCase(actionSaveImportanceTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionSaveImportanceTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.importanceItems = action.payload.importanceItems;
        state.selectedImportance = action.payload.selectedImportance;
        state.error = null;
      })
      .addCase(actionSaveImportanceTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Save Operation Policy
      .addCase(actionSaveOperationPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionSaveOperationPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.operationItems = action.payload;
        state.error = null;
      })
      .addCase(actionSaveOperationPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Policy
      .addCase(actionAddPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionAddPolicy.fulfilled, (state) => {
        state.loading = false;
        state.policyAddModalVisible = false;
        state.selectedApi = "";
        state.error = null;
      })
      .addCase(actionAddPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateSensitivityValue,
  toggleImportanceSelection,
  updateImportanceItem,
  updateOperationSelection,
  addCategoryItem,
  updateCategoryItem,
  setPolicyAddModalVisible,
  setPolicyEditModalVisible,
  setSelectedApi,
  clearError,
  resetToDefaults,
} = adminPolicySlice.actions;

// Selectors
export const selectAdminPolicyState = (state: RootState) => state.adminPolicy;
export const selectAdminPolicyLoading = (state: RootState) =>
  state.adminPolicy.loading;
export const selectAdminPolicyError = (state: RootState) =>
  state.adminPolicy.error;

export const selectSensitivityItems = (state: RootState) =>
  state.adminPolicy.sensitivityItems;
export const selectSensitivityValues = (state: RootState) =>
  state.adminPolicy.sensitivityValues;

export const selectImportanceItems = (state: RootState) =>
  state.adminPolicy.importanceItems;
export const selectSelectedImportance = (state: RootState) =>
  state.adminPolicy.selectedImportance;
export const selectCategoryItems = (state: RootState) =>
  state.adminPolicy.categoryItems;

export const selectOperationItems = (state: RootState) =>
  state.adminPolicy.operationItems;

export const selectPolicyAddModalVisible = (state: RootState) =>
  state.adminPolicy.policyAddModalVisible;
export const selectPolicyEditModalVisible = (state: RootState) =>
  state.adminPolicy.policyEditModalVisible;
export const selectSelectedApi = (state: RootState) =>
  state.adminPolicy.selectedApi;
export const selectApiDescription = (state: RootState) =>
  state.adminPolicy.apiDescription;

export default adminPolicySlice.reducer;
