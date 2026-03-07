"use client";

import DataTable from "../../ui-customs/table/data-table";
import { Button } from "../../ui/button";
import { DATA_TABLE_BASE_PROPS, SAMPLE_DATA, usePaginatedSampleData } from "./data-table.shared";

export function DataTableSearchHiddenTabsSample() {
  const { metadata, paginatedData, setCurrentPage, setPageSize } =
    usePaginatedSampleData(SAMPLE_DATA);

  return (
    <DataTable
      data={paginatedData}
      metadata={metadata}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      enableSearch
      searchPlaceholder="Search section..."
      toolbarActions={<Button size="sm">Create Section</Button>}
      {...DATA_TABLE_BASE_PROPS}
    />
  );
}
