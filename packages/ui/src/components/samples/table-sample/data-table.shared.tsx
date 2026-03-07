"use client";

import { CircleCheck, Loader } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

import type { DataTableProps, PaginationMetadata } from "../../ui-customs/table/data-table";
import type { ColumnDef } from "@tanstack/react-table";

const SECTION_STATUSES = ["Done", "In Process"] as const;
const DEFAULT_PAGE_SIZE = 5;
const UNASSIGNED_REVIEWER = "Assign reviewer";
const REVIEWER_OPTIONS = ["Eddie Lake", "Jamik Tashpulatov"] as const;

export const SAMPLE_TAB_VIEWS: { id: string; label: string; badge?: number }[] = [
  { id: "outline", label: "Outline" },
  { id: "past-performance", label: "Past Performance", badge: 3 },
  { id: "key-personnel", label: "Key Personnel", badge: 2 },
] as const;

export const STATUS_FILTER_OPTIONS = [
  { label: "All statuses", value: "all" },
  ...SECTION_STATUSES.map((status) => ({ label: status, value: status })),
] as const;

export const STATUS_MULTI_FILTER_OPTIONS = SECTION_STATUSES.map((status) => ({
  label: status,
  value: status,
}));

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.enum(SECTION_STATUSES),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

export type Data = z.infer<typeof schema>;
export type SectionStatus = (typeof SECTION_STATUSES)[number];
export type StatusFilterValue = SectionStatus | "all";

export const SAMPLE_DATA: Data[] = [
  {
    id: 1,
    header: "Cover page",
    type: "Cover page",
    status: "In Process",
    target: "18",
    limit: "5",
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    header: "Table of contents",
    type: "Table of contents",
    status: "Done",
    target: "29",
    limit: "24",
    reviewer: "Eddie Lake",
  },
  {
    id: 3,
    header: "Executive summary",
    type: "Narrative",
    status: "Done",
    target: "10",
    limit: "13",
    reviewer: "Eddie Lake",
  },
  {
    id: 4,
    header: "Technical approach",
    type: "Narrative",
    status: "Done",
    target: "27",
    limit: "23",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 5,
    header: "Design",
    type: "Narrative",
    status: "In Process",
    target: "2",
    limit: "16",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 6,
    header: "Capabilities",
    type: "Narrative",
    status: "In Process",
    target: "20",
    limit: "8",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 7,
    header: "Integration with existing systems",
    type: "Narrative",
    status: "In Process",
    target: "19",
    limit: "21",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 8,
    header: "Innovation and Advantages",
    type: "Narrative",
    status: "Done",
    target: "25",
    limit: "26",
    reviewer: UNASSIGNED_REVIEWER,
  },
  {
    id: 9,
    header: "Overview of EMR's Innovative Solutions",
    type: "Technical content",
    status: "Done",
    target: "7",
    limit: "23",
    reviewer: UNASSIGNED_REVIEWER,
  },
  {
    id: 10,
    header: "Advanced Algorithms and Machine Learning",
    type: "Narrative",
    status: "Done",
    target: "30",
    limit: "28",
    reviewer: UNASSIGNED_REVIEWER,
  },
];

const SAMPLE_COLUMNS = createColumns();

export const DATA_TABLE_BASE_PROPS = {
  columns: SAMPLE_COLUMNS,
  enableRowSelection: true,
  enableDragReorder: true,
  enableColumnVisibility: true,
  getRowId: (row: Data) => String(row.id),
} satisfies Pick<
  DataTableProps<Data>,
  "columns" | "enableRowSelection" | "enableDragReorder" | "enableColumnVisibility" | "getRowId"
>;

function createColumns(): ColumnDef<Data>[] {
  return [
    {
      accessorKey: "header",
      header: "Header",
      cell: ({ row }) => <div className="font-medium">{row.original.header}</div>,
    },
    {
      accessorKey: "type",
      header: "Section Type",
      cell: ({ row }) => (
        <div className="w-32">
          <Badge variant="outline" className="px-1.5 text-muted-foreground">
            {row.original.type}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "target",
      header: () => <div className="w-full">Target</div>,
      cell: ({ row }) => (
        <EditableMetricCell
          field="target"
          rowId={row.original.id}
          sectionTitle={row.original.header}
          value={row.original.target}
        />
      ),
    },
    {
      accessorKey: "limit",
      header: () => <div className="w-full">Limit</div>,
      cell: ({ row }) => (
        <EditableMetricCell
          field="limit"
          rowId={row.original.id}
          sectionTitle={row.original.header}
          value={row.original.limit}
        />
      ),
    },
    {
      accessorKey: "reviewer",
      header: "Reviewer",
      cell: ({ row }) => <ReviewerCell reviewer={row.original.reviewer} rowId={row.original.id} />,
    },
  ];
}

function StatusBadge({ status }: { status: SectionStatus }) {
  return (
    <Badge variant="outline" className="gap-1 px-1.5 text-muted-foreground">
      {status === "Done" ? (
        <CircleCheck className="size-3 fill-green-500 text-green-500" />
      ) : (
        <Loader className="size-3 animate-spin" />
      )}
      {status}
    </Badge>
  );
}

function saveSection(sectionTitle: string) {
  return toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
    loading: `Saving ${sectionTitle}`,
    success: "Done",
    error: "Error",
  });
}

function EditableMetricCell({
  field,
  rowId,
  sectionTitle,
  value,
}: {
  field: "target" | "limit";
  rowId: Data["id"];
  sectionTitle: Data["header"];
  value: string;
}) {
  const inputId = `${rowId}-${field}`;

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void saveSection(sectionTitle);
    },
    [sectionTitle],
  );

  return (
    <form onSubmit={handleSubmit}>
      <Label htmlFor={inputId} className="sr-only">
        {field}
      </Label>
      <Input
        className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
        defaultValue={value}
        id={inputId}
      />
    </form>
  );
}

function ReviewerCell({ reviewer, rowId }: { reviewer: Data["reviewer"]; rowId: Data["id"] }) {
  if (reviewer !== UNASSIGNED_REVIEWER) {
    return reviewer;
  }

  return (
    <>
      <Label htmlFor={`${rowId}-reviewer`} className="sr-only">
        Reviewer
      </Label>
      <Select>
        <SelectTrigger
          className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
          size="sm"
          id={`${rowId}-reviewer`}
        >
          <SelectValue placeholder={UNASSIGNED_REVIEWER} />
        </SelectTrigger>
        <SelectContent align="end">
          {REVIEWER_OPTIONS.map((reviewerOption) => (
            <SelectItem key={reviewerOption} value={reviewerOption}>
              {reviewerOption}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

export function usePaginatedSampleData(rows: Data[]) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);

  const totalPages = React.useMemo(
    () => Math.max(1, Math.ceil(rows.length / pageSize)),
    [rows.length, pageSize],
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  React.useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  const paginatedData = React.useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [pageSize, rows, safeCurrentPage]);

  const metadata = React.useMemo<PaginationMetadata>(
    () => ({
      currentPage: safeCurrentPage,
      pageSize,
      totalCount: rows.length,
      totalPages,
      hasNextPage: safeCurrentPage < totalPages,
      hasPreviousPage: safeCurrentPage > 1,
    }),
    [pageSize, rows.length, safeCurrentPage, totalPages],
  );

  const handlePageSizeChange = React.useCallback((nextPageSize: number) => {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  }, []);

  return {
    metadata,
    paginatedData,
    setCurrentPage,
    setPageSize: handlePageSizeChange,
  };
}

export function useSampleTab() {
  const [tab, setTab] = React.useState(SAMPLE_TAB_VIEWS[0]?.id ?? "");

  const handleTabChange = React.useCallback((nextTab: string) => {
    setTab(nextTab);
  }, []);

  return {
    tab,
    setTab: handleTabChange,
  };
}
