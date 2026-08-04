'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Layers, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SummaryCardsProps {
  totalRoles: number;
  protectedRoles: number;
  permissionAreas: number;
  lastUpdated: string;
  isLoading?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalRoles,
  protectedRoles,
  permissionAreas,
  lastUpdated,
  isLoading = false,
}) => {
  const cards = [
    {
      title: 'Total Roles',
      value: totalRoles,
      subtitle: 'System predefined roles',
      icon: Shield,
      iconColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40',
    },
    {
      title: 'Protected Roles',
      value: protectedRoles,
      subtitle: 'Owner system role',
      icon: Lock,
      iconColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
    },
    {
      title: 'Permission Areas',
      value: permissionAreas,
      subtitle: 'Configured ERP features',
      icon: Layers,
      iconColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40',
    },
    {
      title: 'Last Updated',
      value: lastUpdated,
      subtitle: 'Latest access sync',
      icon: Clock,
      iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-border/60 shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className="border border-border/60 shadow-xs hover:border-border transition-colors bg-card"
          >
            <CardContent className="p-4 flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </p>
                <div className="text-xl font-bold tracking-tight text-foreground">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.subtitle}
                </p>
              </div>
              <div
                className={`p-2.5 rounded-xl border shrink-0 ${card.iconColor}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
