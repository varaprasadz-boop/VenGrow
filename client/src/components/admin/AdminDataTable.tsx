import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Filter, Plus, Loader2, RefreshCw, AlertCircle } from "lucide-react";

export interface FilterConfig {
  key: string;
  label: string;
  type: "search" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface ColumnConfig<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  filters?: FilterConfig[];
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: () => void;
  onAddNew?: () => void;
  addNewLabel?: string;
  emptyMessage?: string;
  errorMessage?: string;
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  getRowKey: (item: T, index: number) => string;
  title?: string;
  description?: string;
  filterFn?: (item: T, filters: Record<string, string>) => boolean;
  actions?: (item: T, index: number) => React.ReactNode;
}

export function AdminDataTable<T>({
  data,
  columns,
  filters = [],
  isLoading = false,
  isError = false,
  onRefresh,
  onAddNew,
  addNewLabel = "Add New",
  emptyMessage = "No data found",
  errorMessage = "Failed to load data. Please try again.",
  itemsPerPageOptions = [10, 25, 50, 100],
  defaultItemsPerPage = 10,
  getRowKey,
  title,
  description,
  filterFn,
  actions,
}: AdminDataTableProps<T>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  const filteredData = useMemo(() => {
    if (!filterFn) return data;
    return data.filter((item) => filterFn(item, filterValues));
  }, [data, filterValues, filterFn]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilterValues({});
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filterValues).some((v) => v && v !== "all");

  if (isError) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
          <p className="text-muted-foreground mb-4">{errorMessage}</p>
          {onRefresh && (
            <Button onClick={onRefresh} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center flex-1">
          {filters.map((filter) => (
            <div key={filter.key} className="min-w-[180px]">
              {filter.type === "search" ? (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={filter.placeholder || `Search ${filter.label}...`}
                    value={filterValues[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="pl-9"
                    data-testid={`input-filter-${filter.key}`}
                  />
                </div>
              ) : (
                <Select
                  value={filterValues[filter.key] || "all"}
                  onValueChange={(value) => handleFilterChange(filter.key, value)}
                >
                  <SelectTrigger data-testid={`select-filter-${filter.key}`}>
                    <SelectValue placeholder={filter.placeholder || filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {filter.label}</SelectItem>
                    {filter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
              <Filter className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex gap-2 items-center">
          {onRefresh && (
            <Button variant="outline" size="icon" onClick={onRefresh} disabled={isLoading} data-testid="button-refresh">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          )}
          {onAddNew && (
            <Button onClick={onAddNew} data-testid="button-add-new">
              <Plus className="h-4 w-4 mr-2" />
              {addNewLabel}
            </Button>
          )}
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-10 w-full" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">{emptyMessage}</p>
            {onAddNew && (
              <Button variant="outline" className="mt-4" onClick={onAddNew} data-testid="button-add-first">
                <Plus className="h-4 w-4 mr-2" />
                {addNewLabel}
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key} style={col.width ? { width: col.width } : undefined}>
                    {col.header}
                  </TableHead>
                ))}
                {actions && <TableHead className="w-[100px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={getRowKey(item, startIndex + index)} data-testid={`row-${getRowKey(item, startIndex + index)}`}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(item, startIndex + index) : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <div className="flex gap-1 items-center">
                        {actions(item, startIndex + index)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {!isLoading && filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length}</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[80px]" data-testid="select-items-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>per page</span>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    data-testid="button-prev-page"
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                        data-testid={`button-page-${pageNum}`}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    data-testid="button-next-page"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-serif font-bold text-3xl mb-2" data-testid="text-page-title">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function StatusBadge({ active, activeLabel = "Active", inactiveLabel = "Inactive" }: { active: boolean; activeLabel?: string; inactiveLabel?: string }) {
  return (
    <Badge variant={active ? "default" : "secondary"}>
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}
