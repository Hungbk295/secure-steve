import {
  ENotificationType,
  EModalMode,
  DynamicKeyObject,
} from "@/interfaces/app";
import { notify, pageLoading } from "@/utils/appStateHandle";
import { useMemo } from "react";
import { IHeaderColumn, ExcelExportTSQ } from "tidesquare-xlsx-merge";

interface ICustomExcelExportProps {
  data: DynamicKeyObject[];
  columns: DynamicKeyObject[];
  fileName: string;
  mergedFieldCondition?: string;
  children: any;
  onCovert?: () => void;
}

function generateExcelCoumns(columns: any) {
  return columns.map((item: any) => ({
    key: item.key ?? item.dataIndex,
    title: item.title,
    field: item.dataIndex,
    width: item.excelWidth,
    ...(item.children?.length && {
      children: generateExcelCoumns(item.children),
    }),
  }));
}

function CustomExcelExport(props: ICustomExcelExportProps) {
  const {
    data,
    columns: antdColumns,
    fileName,
    mergedFieldCondition,
    children,
    onCovert,
  } = props;
  const columns = useMemo(
    () => generateExcelCoumns(antdColumns),
    [antdColumns]
  );

  return (
    <ExcelExportTSQ
      data={data}
      columns={columns as IHeaderColumn[]}
      fileName={fileName}
      mergedFieldCondition={mergedFieldCondition}
      config={{
        alignKey: "align",
        widthKey: "width",
        mergedKey: "",
        fractionKey: "",
      }}
      onLoading={() => pageLoading.on()}
      onSuccess={() => pageLoading.off()}
      onEmpty={() =>
        notify({
          message: "No data to export",
          type: ENotificationType.ERROR,
          mode: EModalMode.SINGLE,
        })
      }
      onConvert={onCovert}
    >
      {children}
    </ExcelExportTSQ>
  );
}

export default CustomExcelExport;
