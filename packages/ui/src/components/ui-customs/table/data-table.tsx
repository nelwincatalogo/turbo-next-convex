"use client";

import { type UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import * as React from "react";

import useDebounce from "@repo/ui/hooks/useDebounce";
import { cn } from "@repo/ui/lib/utils";

import { Badge } from "../../ui/badge";
import { Checkbox } from "../../ui/checkbox";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../../ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { createDragColumn, DataTableContent } from "./data-table-content";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbarActions } from "./data-table-toolbar-actions";

export interface PaginationMetadata {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount?: number;
  pageSize: number;
  currentPage: number;
  totalPages?: number;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  metadata?: PaginationMetadata;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  enableRowSelection?: boolean;
  enableDragReorder?: boolean;
  enableColumnVisibility?: boolean;
  onDragEnd?: (data: TData[]) => void;
  getRowId?: (row: TData) => string;
  tabViews?: {
    id: string;
    label: string;
    badge?: number;
  }[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  addAction?: React.ReactNode;
  toolbarActions?: React.ReactNode;
  isLoading?: boolean;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  noPadding?: boolean;
}

export function DataTable<TData>({
  data,
  columns,
  metadata,
  onPageChange,
  onPageSizeChange,
  enableRowSelection = false,
  enableDragReorder = false,
  enableColumnVisibility = true,
  onDragEnd,
  getRowId,
  tabViews,
  activeTab,
  onTabChange,
  addAction,
  toolbarActions,
  isLoading = false,
  enableSearch = false,
  searchPlaceholder = "Search...",
  onSearchChange,
  noPadding = false,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const { debouncedValue: debouncedGlobalFilter } = useDebounce(globalFilter, 500);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [tableData, setTableData] = React.useState<TData[]>(data);
  const [localPagination, setLocalPagination] = React.useState({
    pageIndex: (metadata?.currentPage ?? 1) - 1,
    pageSize: metadata?.pageSize ?? 10,
  });

  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  React.useEffect(() => {
    setLocalPagination({
      pageIndex: (metadata?.currentPage ?? 1) - 1,
      pageSize: metadata?.pageSize ?? 10,
    });
  }, [metadata?.currentPage, metadata?.pageSize]);

  const resolveRowId = React.useCallback(
    (row: TData, index: number) => getRowId?.(row) ?? String(index),
    [getRowId],
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => tableData.map((row, index) => resolveRowId(row, index)),
    [resolveRowId, tableData],
  );

  const tableColumns = React.useMemo<ColumnDef<TData>[]>(() => {
    const cols = [...columns];

    if (enableDragReorder) {
      cols.unshift(createDragColumn());
    }

    if (enableRowSelection) {
      const selectColumn: ColumnDef<TData> = {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      };

      const dragIndex = cols.findIndex((c) => c.id === "drag");
      if (dragIndex >= 0) {
        cols.splice(dragIndex + 1, 0, selectColumn);
      } else {
        cols.unshift(selectColumn);
      }
    }

    return cols;
  }, [columns, enableRowSelection, enableDragReorder]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter: debouncedGlobalFilter,
      pagination: localPagination,
    },
    getRowId: resolveRowId,
    enableRowSelection,
    manualFiltering: onSearchChange ? true : false, // if onSearchChange is provided, we assume filtering is done server-side
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(localPagination) : updater;
      setLocalPagination(newPagination);
      onPageChange?.(newPagination.pageIndex + 1);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: !!metadata,
    pageCount: metadata?.totalPages ?? -1,
  });

  function handleDragEnd(event: {
    active: { id: UniqueIdentifier };
    over: { id: UniqueIdentifier } | null;
  }) {
    const { active, over } = event;
    if (active && over && active.id !== over.id && enableDragReorder) {
      const oldIndex = dataIds.indexOf(active.id);
      const newIndex = dataIds.indexOf(over.id);
      const newData = arrayMove(tableData, oldIndex, newIndex);
      setTableData(newData);
      onDragEnd?.(newData);
    }
  }

  React.useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedGlobalFilter);
    }
  }, [debouncedGlobalFilter]);

  const currentPage = metadata?.currentPage ?? table.getState().pagination.pageIndex + 1;
  const totalPages = metadata?.totalPages ?? table.getPageCount();
  const hasNextPage = metadata?.hasNextPage ?? table.getCanNextPage();
  const hasPreviousPage = metadata?.hasPreviousPage ?? table.getCanPreviousPage();
  const totalCount = metadata?.totalCount ?? table.getFilteredRowModel().rows.length;
  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;

  const handlePageSizeChange = React.useCallback(
    (pageSize: number) => {
      setLocalPagination((prev) => ({ ...prev, pageSize }));
      onPageSizeChange?.(pageSize);
    },
    [onPageSizeChange],
  );

  if (tabViews && tabViews.length > 0) {
    return (
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="w-full flex-col justify-start gap-6"
      >
        <div
          className={cn(
            "flex items-center justify-between gap-3",
            noPadding ? "px-0" : "px-4 lg:px-6",
          )}
        >
          <div className="min-w-0 flex-1">
            <TabsList className="w-fit">
              {tabViews.map((view) => (
                <TabsTrigger key={view.id} value={view.id}>
                  {view.label}
                  {view.badge !== undefined && <Badge variant="secondary">{view.badge}</Badge>}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="flex items-center gap-2">
            {toolbarActions || (
              <DataTableToolbarActions
                table={table}
                enableColumnVisibility={enableColumnVisibility}
                addAction={addAction}
              />
            )}
          </div>
        </div>
        <TabsContent
          value={activeTab || tabViews[0]?.id || ""}
          className={cn(
            "relative flex flex-col gap-4 overflow-auto",
            noPadding ? "px-0" : "px-4 lg:px-6",
          )}
        >
          <DataTableContent
            table={table}
            tableColumns={tableColumns}
            isLoading={isLoading}
            enableDragReorder={enableDragReorder}
            dataIds={dataIds}
            onDragEnd={handleDragEnd}
          />
          {metadata && (
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              totalCount={totalCount}
              selectedRowsCount={selectedRowsCount}
              enableRowSelection={enableRowSelection}
              pageSize={localPagination.pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div
        className={cn(
          "flex items-center justify-between gap-4",
          noPadding ? "px-0" : "px-4 lg:px-6",
        )}
      >
        <div className="min-w-0 flex-1">
          {enableSearch && (
            <InputGroup className="h-8 max-w-xs">
              <InputGroupInput
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full max-w-xs"
                aria-label={searchPlaceholder}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              {globalFilter && (
                <InputGroupAddon align="inline-end">
                  {table.getRowModel().rows?.length} results
                </InputGroupAddon>
              )}
            </InputGroup>
          )}
        </div>
        <div className="flex items-center gap-2">
          {toolbarActions || (
            <DataTableToolbarActions
              table={table}
              enableColumnVisibility={enableColumnVisibility}
              addAction={addAction}
            />
          )}
        </div>
      </div>
      <div
        className={cn(
          "relative mt-6 flex flex-col gap-4 overflow-auto",
          noPadding ? "px-0" : "px-4 lg:px-6",
        )}
      >
        <DataTableContent
          table={table}
          tableColumns={tableColumns}
          isLoading={isLoading}
          enableDragReorder={enableDragReorder}
          dataIds={dataIds}
          onDragEnd={handleDragEnd}
        />
        {metadata && (
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            totalCount={totalCount}
            selectedRowsCount={selectedRowsCount}
            enableRowSelection={enableRowSelection}
            pageSize={localPagination.pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}

export default DataTable;
