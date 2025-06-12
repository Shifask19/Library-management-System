"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, UserPlus, Edit3, ShieldAlert, Trash2 } from 'lucide-react';
import type { User } from '@/types';
import { mockUsers } from '@/lib/mockData'; // Using mock data
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';
// Placeholder for Add/Edit User Modal
// import { UserFormModal } from './UserFormModal'; 

export function UserManagementTab() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  // const [editingUser, setEditingUser] = useState<User | null>(null);
  // const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleDeleteUser = async (userId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    toast({ title: "User Deleted", description: "The user has been removed." });
  };

  const filteredUsers = users.filter(user =>
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users by name, email, role..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <Button disabled> {/* Placeholder for Add User Modal */}
          <UserPlus className="mr-2 h-5 w-5" /> Add New User
        </Button>
      </div>

      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem disabled> {/* Placeholder */}
                          <Edit3 className="mr-2 h-4 w-4" /> Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled> {/* Placeholder */}
                          <ShieldAlert className="mr-2 h-4 w-4" /> Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                         <ConfirmationDialog
                            triggerButton={
                                <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive hover:bg-destructive/10">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                </button>
                            }
                            title="Delete User"
                            description={`Are you sure you want to delete user "${user.name || user.email}"? This action cannot be undone.`}
                            onConfirm={() => handleDeleteUser(user.id)}
                            variant="destructive"
                         />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Placeholder for UserFormModal similar to BookFormModal */}
      {/* {isUserModalOpen && <UserFormModal user={editingUser} onSave={handleSaveUser} onClose={() => setIsUserModalOpen(false)} />} */}
    </div>
  );
}
