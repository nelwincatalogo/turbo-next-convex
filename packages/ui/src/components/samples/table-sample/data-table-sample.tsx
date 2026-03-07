"use client";

import DataTable from "../../ui-customs/table/data-table";
import {
  DATA_TABLE_BASE_PROPS,
  SAMPLE_DATA,
  SAMPLE_TAB_VIEWS,
  usePaginatedSampleData,
  useSampleTab,
} from "./data-table.shared";

export function DataTableSample() {
  const { tab, setTab } = useSampleTab();
  const { metadata, paginatedData, setCurrentPage, setPageSize } =
    usePaginatedSampleData(SAMPLE_DATA);

  return (
    <DataTable
      data={paginatedData}
      metadata={metadata}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      tabViews={SAMPLE_TAB_VIEWS}
      activeTab={tab}
      onTabChange={setTab}
      {...DATA_TABLE_BASE_PROPS}
    />
  );
}

export default DataTableSample;
