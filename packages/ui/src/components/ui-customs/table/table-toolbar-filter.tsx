"use client";

import { Filter } from "lucide-react";
import * as React from "react";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export interface TableToolbarFilterOption {
  label: string;
  value: string;
}

export interface TableToolbarFilterProps {
  label?: string;
  value: string;
  options: TableToolbarFilterOption[];
  onValueChange: (value: string) => void;
  className?: string;
}

export function TableToolbarFilter({
  label = "Filter",
  value,
  options,
  onValueChange,
  className,
}: TableToolbarFilterProps) {
  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn(className)}>
          <Filter className="size-4" />
          <span className="hidden sm:inline">{selectedOption ? selectedOption.label : label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TableToolbarFilter;
