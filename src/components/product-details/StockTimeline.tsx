"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  History,
  MoveUp,
  MoveDown,
  Search,
  User,
  MapPin,
  Calendar,
  Layers,
} from "lucide-react";
import { StockMovement } from "./mock-data";

interface StockTimelineProps {
  movements: StockMovement[];
}

export function StockTimeline({ movements }: StockTimelineProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");

  const eventTypes = [
    "all",
    "Purchase",
    "Sale",
    "Sales Return",
    "Purchase Return",
    "Stock Transfer",
    "Stock Adjustment",
    "Damage",
    "Opening Stock",
  ];

  const filteredMovements = useMemo(() => {
    return movements.filter((move) => {
      const matchesSearch =
        move.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        move.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (move.user || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (move.eventType || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        eventTypeFilter === "all" || move.eventType === eventTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [movements, searchTerm, eventTypeFilter]);

  const getEventBadgeColor = (type?: StockMovement["eventType"]) => {
    switch (type) {
      case "Purchase":
      case "Opening Stock":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "Sale":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "Sales Return":
      case "Purchase Return":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      case "Stock Transfer":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
      case "Stock Adjustment":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "Damage":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden flex flex-col h-full">
      <CardHeader className="p-5 pb-4 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground">
              <History className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Inventory Timeline Audit Log ({filteredMovements.length})
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete historical record of stock changes and movements
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit log..."
                className="pl-8 h-9 text-xs bg-background border-input rounded-xl"
              />
            </div>

            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-full sm:w-44 h-9 text-xs border-input bg-background rounded-xl">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border rounded-xl text-xs">
                {eventTypes.map((t) => (
                  <SelectItem key={t} value={t} className="text-xs cursor-pointer">
                    {t === "all" ? "All Event Types" : t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1 overflow-y-auto max-h-[500px]">
        {filteredMovements.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No matching inventory timeline records found.
          </div>
        ) : (
          <div className="relative pl-6 border-l border-border/80 ml-3 space-y-6 py-2">
            {filteredMovements.map((move) => {
              const isIn = move.type === "in";

              return (
                <div key={move.id} className="relative group">
                  {/* Timeline Node Icon */}
                  <span
                    className={`absolute -left-[35px] top-0.5 h-7 w-7 rounded-full border flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${
                      isIn
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isIn ? (
                      <MoveUp className="h-3.5 w-3.5" />
                    ) : (
                      <MoveDown className="h-3.5 w-3.5" />
                    )}
                  </span>

                  {/* Detail Panel */}
                  <div className="bg-muted/30 border border-border/40 rounded-xl p-3.5 space-y-2 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Event Type Badge */}
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold py-0.5 px-2.5 ${getEventBadgeColor(
                            move.eventType
                          )}`}
                        >
                          {move.eventType || (isIn ? "Stock In" : "Stock Out")}
                        </Badge>

                        {/* Quantity Badge */}
                        <span
                          className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded-lg ${
                            isIn
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                          }`}
                        >
                          {isIn ? "+" : "-"}{move.quantity} units
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                        <Calendar className="h-3 w-3" />
                        <span>{move.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-foreground">
                      {move.reason}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="h-3 w-3 text-primary" />
                        {move.branch}
                      </span>
                      {move.user && (
                        <span className="flex items-center gap-1 font-medium">
                          <User className="h-3 w-3 text-muted-foreground" />
                          By: <strong className="text-foreground">{move.user}</strong>
                        </span>
                      )}
                      {move.batchId && (
                        <span className="flex items-center gap-1 font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                          <Layers className="h-3 w-3" />
                          {move.batchId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
