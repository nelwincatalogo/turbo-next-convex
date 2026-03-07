"use client";

import * as React from "react";

import DataTable from "../../ui-customs/table/data-table";
import TableToolbarFilter from "../../ui-customs/table/table-toolbar-filter";
import { Button } from "../../ui/button";
import {
  type StatusFilterValue,
  DATA_TABLE_BASE_PROPS,
  SAMPLE_DATA,
  SAMPLE_TAB_VIEWS,
  STATUS_FILTER_OPTIONS,
  usePaginatedSampleData,
  useSampleTab,
} from "./data-table.shared";

export function DataTableFilterToolbarSample() {
  const { tab, setTab } = useSampleTab();
  const [statusFilter, setStatusFilter] = React.useState<StatusFilterValue>("all");

  const filteredData = React.useMemo(() => {
    if (statusFilter === "all") {
      return SAMPLE_DATA;
    }

    return SAMPLE_DATA.filter((row) => row.status === statusFilter);
  }, [statusFilter]);

  const { metadata, paginatedData, setCurrentPage, setPageSize } =
    usePaginatedSampleData(filteredData);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [setCurrentPage, statusFilter]);

  return (
    <DataTable
      data={paginatedData}
      metadata={metadata}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      tabViews={SAMPLE_TAB_VIEWS}
      activeTab={tab}
      onTabChange={setTab}
      toolbarActions={
        <div className="flex items-center gap-2">
          <TableToolbarFilter
            label="Status"
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilterValue)}
            options={STATUS_FILTER_OPTIONS.map((option) => ({ ...option }))}
          />
          <Button size="sm">Create Section</Button>
        </div>
      }
      {...DATA_TABLE_BASE_PROPS}
    />
  );
}
