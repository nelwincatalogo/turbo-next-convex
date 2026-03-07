"use client";

import { ChevronDown, Columns3, Plus } from "lucide-react";
import * as React from "react";

import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import type { Table as TanstackTable } from "@tanstack/react-table";

interface DataTableToolbarActionsProps<TData> {
  table: TanstackTable<TData>;
  enableColumnVisibility?: boolean;
  addAction?: React.ReactNode;
}

export function DataTableToolbarActions<TData>({
  table,
  enableColumnVisibility = true,
  addAction,
}: DataTableToolbarActionsProps<TData>) {
  return (
    <>
      {enableColumnVisibility && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns3 className="size-4" />
              <span className="hidden lg:inline">Columns</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {addAction !== undefined ? (
        addAction
      ) : (
        <Button variant="outline" size="sm">
          <Plus className="size-4" />
          <span className="hidden lg:inline">Add</span>
        </Button>
      )}
    </>
  );
}
