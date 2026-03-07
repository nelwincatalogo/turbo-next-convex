"use client";

import { Filter } from "lucide-react";
import * as React from "react";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export interface TableToolbarMultiFilterOption {
  label: string;
  value: string;
}

export interface TableToolbarMultiFilterProps {
  label?: string;
  options: TableToolbarMultiFilterOption[];
  values: string[];
  onValuesChange: (values: string[]) => void;
  className?: string;
}

export function TableToolbarMultiFilter({
  label = "Filter",
  options,
  values,
  onValuesChange,
  className,
}: TableToolbarMultiFilterProps) {
  const selectedCount = values.length;

  const buttonLabel = React.useMemo(() => {
    if (selectedCount === 0) {
      return `${label}: None`;
    }

    if (selectedCount === options.length) {
      return `${label}: All`;
    }

    if (selectedCount === 1) {
      const selectedOption = options.find((option) => option.value === values[0]);
      return selectedOption ? selectedOption.label : `${label}: 1`;
    }

    return `${label}: ${selectedCount}`;
  }, [label, options, selectedCount, values]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn(className)}>
          <Filter className="size-4" />
          <span>{buttonLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={values.includes(option.value)}
            onSelect={(event) => event.preventDefault()}
            onCheckedChange={(checked) => {
              if (checked) {
                onValuesChange(Array.from(new Set([...values, option.value])));
                return;
              }

              onValuesChange(values.filter((value) => value !== option.value));
            }}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TableToolbarMultiFilter;
