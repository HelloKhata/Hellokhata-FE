import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shield, LayoutTemplate, FilePlus2, Search, SlidersHorizontal, Menu } from 'lucide-react';

interface PageHeaderProps {
  onOpenTemplates: () => void;
  onOpenWizard: () => void;
  onOpenMobileDrawer: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filter: string;
  onFilterChange: (val: string) => void;
}

export function PageHeader({
  onOpenTemplates,
  onOpenWizard,
  onOpenMobileDrawer,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 shrink-0">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Roles & Permissions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Control who can access which parts of your business.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <Button
          variant="outline"
          className="lg:hidden h-9 px-3 rounded-xl border-border/70 gap-2 shadow-xs"
          onClick={onOpenMobileDrawer}
        >
          <Menu className="h-4 w-4" />
          <span>Roles</span>
        </Button>

        <div className="relative flex-1 min-w-[200px] md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 rounded-xl border-border/70 bg-card shadow-xs focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 px-3 rounded-xl border-border/70 gap-2 shadow-xs bg-card"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl">
            <DropdownMenuRadioGroup value={filter} onValueChange={onFilterChange}>
              <DropdownMenuRadioItem value="all" className="rounded-lg">All roles</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="active" className="rounded-lg">Active</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inactive" className="rounded-lg">Inactive</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          className="h-9 px-4 rounded-xl border-border/70 gap-2 shadow-xs bg-card hover:bg-muted/50"
          onClick={onOpenTemplates}
        >
          <LayoutTemplate className="h-4 w-4" />
          <span className="hidden sm:inline">Role Templates</span>
        </Button>

        <Button
          className="h-9 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-xs"
          onClick={onOpenWizard}
        >
          <FilePlus2 className="h-4 w-4" />
          Create Role
        </Button>
      </div>
    </header>
  );
}
