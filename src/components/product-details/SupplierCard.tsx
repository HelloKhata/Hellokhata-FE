import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Phone, Calendar, Mail, ExternalLink } from "lucide-react";
import { Supplier } from "./mock-data";

interface SupplierCardProps {
  suppliers: Supplier[];
}

export function SupplierCard({ suppliers }: SupplierCardProps) {
  return (
    <Card className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden h-full">
      <CardHeader className="p-6 pb-3 border-b border-border/40">
        <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          Supplier Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 divide-y divide-border/40">
        {suppliers.map((supplier, idx) => {
          const initials = supplier.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);

          return (
            <div key={supplier.id} className={`flex items-start gap-4 ${idx > 0 ? "pt-4 mt-4" : ""}`}>
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full border border-border bg-primary/5 text-primary text-xs font-bold flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                {supplier.avatarUrl ? (
                  <img
                    src={supplier.avatarUrl}
                    alt={supplier.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              {/* Details */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-foreground truncate">
                    {supplier.name}
                  </h4>
                  <button type="button" className="text-muted-foreground hover:text-foreground">
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                    <span className="truncate">{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider pt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                  <span>Last supply: {format(new Date(supplier.lastSuppliedDate), "dd MMM yyyy")}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
