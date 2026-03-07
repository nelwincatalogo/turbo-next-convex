"use client";

import * as React from "react";

import DataTable from "../../ui-customs/table/data-table";
import TableToolbarMultiFilter from "../../ui-customs/table/table-toolbar-multi-filter";
import { Button } from "../../ui/button";
import {
  type SectionStatus,
  DATA_TABLE_BASE_PROPS,
  SAMPLE_DATA,
  SAMPLE_TAB_VIEWS,
  STATUS_MULTI_FILTER_OPTIONS,
  usePaginatedSampleData,
  useSampleTab,
} from "./data-table.shared";

export function DataTableMultiSelectFilterSample() {
  const { tab, setTab } = useSampleTab();
  const [selectedStatuses, setSelectedStatuses] = React.useState<SectionStatus[]>(
    STATUS_MULTI_FILTER_OPTIONS.map((option) => option.value),
  );

  const filteredData = React.useMemo(() => {
    if (selectedStatuses.length === 0) {
      return [];
    }

    return SAMPLE_DATA.filter((row) => selectedStatuses.includes(row.status));
  }, [selectedStatuses]);

  const { metadata, paginatedData, setCurrentPage, setPageSize } =
    usePaginatedSampleData(filteredData);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatuses, setCurrentPage]);

  return (
    <DataTable
      data={paginatedData}
      metadata={metadata}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      tabViews={SAMPLE_TAB_VIEWS}
      activeTab={tab}
      onTabChange={setTab}
      addAction={
        <div className="flex items-center gap-2">
          <TableToolbarMultiFilter
            label="Status"
            values={selectedStatuses}
            onValuesChange={(values) => setSelectedStatuses(values as SectionStatus[])}
            options={STATUS_MULTI_FILTER_OPTIONS}
          />
          <Button size="sm">Create Section</Button>
        </div>
      }
      {...DATA_TABLE_BASE_PROPS}
    />
  );
}
