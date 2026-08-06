import React, { useState } from 'react';
import { Role } from '@/types/role';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock users assigned to role since the role object in types doesn't include the full user list
const MOCK_USERS = [
  { id: 1, name: 'Arif Hossain', email: 'arif@hellokhata.com', initials: 'AH', color: 'bg-blue-100 text-blue-600' },
  { id: 2, name: 'Sadia Rahman', email: 'sadia@hellokhata.com', initials: 'SR', color: 'bg-emerald-100 text-emerald-600' },
  { id: 3, name: 'Tanvir Ahmed', email: 'tanvir@hellokhata.com', initials: 'TA', color: 'bg-amber-100 text-amber-600' },
];

export function UsersTab({ role }: { role: Role }) {
  const [search, setSearch] = useState('');

  const users = MOCK_USERS.slice(0, role.employeeCount || 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-[9px] bg-card border-border/70"
          />
        </div>
        <Button variant="outline" size="sm" className="h-9 rounded-[9px]">
          Manage Assignment
        </Button>
      </div>

      <div className="bg-card border border-border rounded-[14px] overflow-hidden p-2">
        {users.length > 0 ? (
          <ul className="list-none flex flex-col">
            {users.map(user => (
              <li key={user.id} className="flex items-center gap-3 p-[11px_12px] border-b border-border/60 last:border-0 hover:bg-secondary/30 transition-colors rounded-[10px]">
                <Avatar className="h-9 w-9 border border-border/50">
                  <AvatarImage src={`https://avatar.vercel.sh/${user.initials}.png`} />
                  <AvatarFallback className={user.color}>{user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <span className="font-[650] text-[13.5px] block truncate text-foreground">{user.name}</span>
                  <span className="text-[12px] text-muted-foreground block truncate">{user.email}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-destructive">
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-muted-foreground text-[13px]">
            No users are assigned to this role yet.
          </div>
        )}
      </div>
    </div>
  );
}
