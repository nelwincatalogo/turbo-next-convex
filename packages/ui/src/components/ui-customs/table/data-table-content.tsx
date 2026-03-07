"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  flexRender,
  type ColumnDef,
  type Row,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import { GripVertical } from "lucide-react";
import * as React from "react";

import { Button } from "../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import XScroll from "../x-scroll";

interface DataTableContentProps<TData> {
  table: TanstackTable<TData>;
  tableColumns: ColumnDef<TData>[];
  isLoading?: boolean;
  enableDragReorder?: boolean;
  dataIds: UniqueIdentifier[];
  onDragEnd: (event: DragEndEvent) => void;
}

function DragHandle({ id }: { id: UniqueIdentifier }) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 cursor-grab text-muted-foreground hover:bg-transparent active:cursor-grabbing"
    >
      <GripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

export function createDragColumn<TData>(): ColumnDef<TData> {
  return {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.id} />,
    size: 40,
  };
}

function DraggableRow<TData>({
  row,
  enableDragReorder,
}: {
  row: Row<TData>;
  enableDragReorder: boolean;
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={enableDragReorder ? setNodeRef : undefined}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={
        enableDragReorder
          ? {
              transform: CSS.Transform.toString(transform),
              transition,
            }
          : undefined
      }
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="px-4">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTableContent<TData>({
  table,
  tableColumns,
  isLoading = false,
  enableDragReorder = false,
  dataIds,
  onDragEnd,
}: DataTableContentProps<TData>) {
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  return (
    <div className="overflow-hidden rounded-lg border">
      <XScroll>
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className="px-4"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                enableDragReorder ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} enableDragReorder={enableDragReorder} />
                    ))}
                  </SortableContext>
                ) : (
                  table
                    .getRowModel()
                    .rows.map((row) => (
                      <DraggableRow key={row.id} row={row} enableDragReorder={enableDragReorder} />
                    ))
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </XScroll>
    </div>
  );
}
