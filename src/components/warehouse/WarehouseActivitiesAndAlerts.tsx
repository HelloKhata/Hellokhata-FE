"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Clock,
  AlertTriangle,
  Building2,
  ArrowRightLeft,
  Sliders,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { WarehouseAlert, WarehouseActivity } from "./WarehouseMockData";
import { toast } from "sonner";

interface WarehouseActivitiesAndAlertsProps {
  alerts: WarehouseAlert[];
  activities: WarehouseActivity[];
  isBangla?: boolean;
}

export function WarehouseActivitiesAndAlerts({
  alerts,
  activities,
  isBangla = false,
}: WarehouseActivitiesAndAlertsProps) {
  // Alert Filter State
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<string>("all");

  // Activity Timeframe Filter State
  const [activityTimeframeFilter, setActivityTimeframeFilter] = useState<string>("all");

  const filteredAlerts = alerts
    .filter((a) => alertSeverityFilter === "all" || a.severity === alertSeverityFilter)
    .slice(0, 5);

  const filteredActivities = activities
    .filter((act) => activityTimeframeFilter === "all" || act.timeframe === activityTimeframeFilter)
    .slice(0, 5);

  const getAlertBadge = (severity: WarehouseAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[9px] uppercase font-bold py-0">Critical</Badge>;
      case "warning":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] uppercase font-bold py-0">Warning</Badge>;
      case "info":
      default:
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[9px] uppercase font-bold py-0">Info</Badge>;
    }
  };

  const getActivityIcon = (type: WarehouseActivity["type"]) => {
    switch (type) {
      case "created":
        return <Building2 className="h-3.5 w-3.5 text-emerald-500" />;
      case "transfer_completed":
        return <ArrowRightLeft className="h-3.5 w-3.5 text-blue-500" />;
      case "inventory_adjusted":
        return <Sliders className="h-3.5 w-3.5 text-amber-500" />;
      case "manager_changed":
        return <UserCheck className="h-3.5 w-3.5 text-purple-500" />;
      case "stock_received":
      default:
        return <CheckCircle2 className="h-3.5 w-3.5 text-primary" />;
    }
  };

  const handleFixAlert = (alertTitle: string) => {
    toast.info(`Opening resolution workflow for "${alertTitle}"...`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Warehouse Alerts Panel */}
      <Card className="border border-border/80 shadow-xs bg-card">
        <CardHeader className="p-3.5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-rose-500" />
            <CardTitle className="text-sm font-bold text-foreground">
              {isBangla ? "ওয়্যারহাউস এলার্ট" : "Warehouse Alerts"}
            </CardTitle>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/40">
            {["all", "critical", "warning", "info"].map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setAlertSeverityFilter(sev)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors capitalize cursor-pointer ${
                  alertSeverityFilter === sev
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-3.5 space-y-2.5">
          {filteredAlerts.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-xs">
              No alerts found for this filter severity.
            </div>
          ) : (
            filteredAlerts.map((alt) => (
              <div
                key={alt.id}
                className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-2 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-xs text-foreground truncate">
                        {isBangla ? alt.titleBn : alt.titleEn}
                      </p>
                      {getAlertBadge(alt.severity)}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {alt.warehouseName} • <span className="font-mono">{alt.timestamp}</span>
                    </p>
                  </div>
                </div>

                {/* View/Fix Action Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFixAlert(isBangla ? alt.titleBn : alt.titleEn)}
                  className="h-7 text-[10px] font-bold text-primary hover:bg-primary/10 shrink-0 gap-1 px-2 cursor-pointer"
                >
                  <span>{isBangla ? alt.actionTextBn || "সমাধান" : alt.actionTextEn || "Resolve"}</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 2. Recent Activity Compact List */}
      <Card className="border border-border/80 shadow-xs bg-card">
        <CardHeader className="p-3.5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-primary" />
            <CardTitle className="text-sm font-bold text-foreground">
              {isBangla ? "সাম্প্রতিক কাযক্রম" : "Recent Activity"}
            </CardTitle>
          </div>

          {/* Timeframe Filter Tabs + View All */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/40">
              {[
                { id: "all", label: "All" },
                { id: "today", label: "Today" },
                { id: "this_week", label: "This Week" },
              ].map((tf) => (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => setActivityTimeframeFilter(tf.id)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                    activityTimeframeFilter === tf.id
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3.5 space-y-2.5">
          {filteredActivities.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-xs">
              No recent activity log found for this timeframe.
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div key={act.id} className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-md bg-muted border border-border/80 flex items-center justify-center shrink-0">
                    {getActivityIcon(act.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-foreground truncate">
                      {isBangla ? act.descriptionBn : act.descriptionEn}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {act.warehouseName} • {act.user}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {act.timestamp}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
