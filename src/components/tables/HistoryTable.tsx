import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { EmptyState } from "@/components/common/states";
import { downloadCsv, formatDateTime, readingStatus, toCsv } from "@/lib/format";
import { READING_STATUS_LABEL } from "@/lib/constants";
import type { ReadingStatus, TemperatureReading, Threshold } from "@/lib/types";

const PAGE_SIZE = 10;

export function HistoryTable({
  readings,
  threshold,
}: {
  readings: TemperatureReading[];
  threshold: Threshold;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReadingStatus | "all">("all");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    return readings
      .slice()
      .reverse()
      .map((r) => ({ ...r, status: readingStatus(r.temperature, threshold) }))
      .filter((r) => (status === "all" ? true : r.status === status))
      .filter((r) =>
        search.trim() === ""
          ? true
          : `${formatDateTime(r.timestamp)} ${r.temperature}`.toLowerCase().includes(search.toLowerCase()),
      );
  }, [readings, threshold, status, search]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageRows = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const exportCsv = () => {
    downloadCsv(
      `temperature-history-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv(
        rows.map((r) => ({
          Time: formatDateTime(r.timestamp),
          "Temperature (C)": r.temperature,
          "Humidity (%)": r.humidity,
          Status: READING_STATUS_LABEL[r.status],
        })),
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by time or temperature"
            value={search}
            aria-label="Search history"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as ReadingStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">Above range</SelectItem>
            <SelectItem value="low">Below range</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportCsv} disabled={rows.length === 0}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No readings found" description="Try adjusting the search or filters." />
      ) : (
        <>
          <div className="card-soft overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Humidity</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap">{formatDateTime(r.timestamp)}</TableCell>
                    <TableCell className="font-medium">{r.temperature.toFixed(1)} °C</TableCell>
                    <TableCell className="text-muted-foreground">{r.humidity}%</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          r.status === "high"
                            ? "border-destructive/40 text-destructive"
                            : r.status === "low"
                              ? "border-warning/50 text-warning"
                              : "border-success/40 text-success"
                        }
                      >
                        {READING_STATUS_LABEL[r.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Showing {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, rows.length)} of{" "}
              {rows.length} readings
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={current <= 1} onClick={() => setPage(current - 1)}>
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {current} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={current >= totalPages}
                onClick={() => setPage(current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
