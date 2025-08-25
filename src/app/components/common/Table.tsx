import { cn } from "@/libs/utils";
import {
  Table as AntdTable,
  Pagination,
  PaginationProps,
  TableProps,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import Select from "@/app/components/common/Select";

type TTableProps = TableProps<any> & {
  paginationProps?: PaginationProps;
  showPageSizeChanger?: boolean;
  showPagination?: boolean;
  total?: number;
  onRetrieve?: (size: number, current: number) => void;
  expandable?: any;
};

const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const paginationItemRender: PaginationProps["itemRender"] = (
  _,
  type,
  originalElement
) => {
  if (type === "prev") {
    return <i className="ri-arrow-left-s-line text-2xl"></i>;
  }
  if (type === "next") {
    return <i className="ri-arrow-right-s-line text-2xl"></i>;
  }
  return originalElement;
};

function Table(props: TTableProps) {
  const {
    className,
    expandable,
    dataSource = [],
    children,
    paginationProps,
    showPageSizeChanger = true,
    showPagination = true,
    total = dataSource.length,
    onRetrieve,
    ...rest
  } = props;
  const [page, setPage] = useState({ size: 10, current: 1 });

  const dataTable = useMemo(() => {
    if (onRetrieve) {
      return dataSource;
    }
    return dataSource.slice(
      (page.current - 1) * page.size,
      page.current * page.size
    );
  }, [dataSource, page]);

  useEffect(() => {
    onRetrieve?.(page.size, page.current);
  }, [page]);

  return (
    <>
      <AntdTable
        dataSource={dataTable}
        scroll={{ x: "max-content" }}
        className={cn("custom-table", className)}
        pagination={false}
        locale={{ emptyText: "No search results found." }}
        expandable={expandable}
        {...rest}
      />
      {showPagination && (
        <div className="mt-[18px] flex justify-between items-center gap-4 custom-pagination">
          <Pagination
            total={total}
            showTotal={(total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} entries`
            }
            pageSize={page.size}
            current={page.current}
            onChange={(current, size) => setPage({ current, size })}
            itemRender={paginationItemRender}
            {...paginationProps}
          />
          {showPageSizeChanger && (
            <Select
              value={page.size}
              onChange={(value) => setPage({ current: 1, size: value })}
              options={PAGE_SIZE_OPTIONS}
              className="min-w-25 min-h-12"
              popupClassName="pagination"
            />
          )}
          {children}
        </div>
      )}
    </>
  );
}

export default Table;
