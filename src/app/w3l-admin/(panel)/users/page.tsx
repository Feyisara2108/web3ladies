"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, Shield, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useAdminAuth } from "@/components/admin/use-admin-auth";
import { createClient } from "@/lib/supabase/client";

type ManagedUser = { id: string; email: string; role: string; created_at: string };

const ROLE_CLASS: Record<string, string> = {
  superadmin: "bg-destructive/10 text-destructive",
  admin: "bg-primary/10 text-primary",
  moderator: "bg-accent/50 text-accent-foreground",
  user: "bg-muted text-muted-foreground",
};

/** Calls the server-side user management route (superadmin only). */
async function manageUsers(body: Record<string, unknown>) {
  const res = await fetch("/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Request failed");
  if (data?.error) throw new Error(data.error);
  return data;
}

function RoleOptions() {
  return (
    <SelectContent>
      <SelectItem value="user">User</SelectItem>
      <SelectItem value="moderator">Moderator</SelectItem>
      <SelectItem value="admin">Admin</SelectItem>
      <SelectItem value="superadmin">Superadmin</SelectItem>
    </SelectContent>
  );
}

export default function AdminUsersPage() {
  const { toast } = useToast();
  const { user } = useAdminAuth();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [creating, setCreating] = useState(false);

  const { data: isSuperadmin = false } = useQuery({
    queryKey: ["admin", "is-superadmin", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await createClient()
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "superadmin")
        .maybeSingle();
      return !!data;
    },
  });

  const {
    data: users = [],
    isLoading: loading,
    refetch: load,
  } = useQuery({
    queryKey: ["admin", "users", user?.id],
    enabled: !!user,
    refetchOnMount: "always",
    queryFn: async (): Promise<ManagedUser[]> => {
      try {
        const data = await manageUsers({ action: "list" });
        return Array.isArray(data) ? data : [];
      } catch (err) {
        toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
        return [];
      }
    },
  });

  const createUser = async () => {
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Email and password are required.",
        variant: "destructive",
      });
      return;
    }
    setCreating(true);
    try {
      const result = await manageUsers({ action: "create", email, password, role });
      toast({
        title: result?.email_sent ? "User created" : "User created (email pending)",
        description: result?.email_sent
          ? `${email} added as ${role}. Password setup email sent with login link.`
          : result?.email_error?.includes("security purposes")
            ? `${email} added as ${role}. Email is temporarily rate-limited; retry in about 60 seconds or use Forgot password on login.`
            : `${email} added as ${role}. We could not send the onboarding email right now.`,
      });
      setOpen(false);
      setEmail("");
      setPassword("");
      setRole("user");
      load();
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    setBusyId(userId);
    try {
      await manageUsers({ action: "update_role", user_id: userId, role: newRole });
      toast({ title: "Role updated" });
      load();
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Delete user ${userEmail}? This cannot be undone.`)) return;
    setBusyId(userId);
    try {
      await manageUsers({ action: "delete", user_id: userId });
      toast({ title: "User deleted" });
      load();
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  if (!isSuperadmin) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-display font-bold text-foreground">User Management</h1>
        <Card className="p-8 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Only superadmins can manage users.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Create accounts and assign roles</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <RoleOptions />
                </Select>
              </div>
              <Button className="w-full" onClick={createUser} disabled={creating}>
                {creating && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <LoaderCircle className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const isMe = u.id === user?.id;
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.email}
                      {isMe && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                    </TableCell>
                    <TableCell>
                      {isMe ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_CLASS[u.role]}`}>
                          {u.role}
                        </span>
                      ) : (
                        <Select
                          value={u.role}
                          onValueChange={(v) => updateRole(u.id, v)}
                          disabled={busyId === u.id}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <RoleOptions />
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {!isMe && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteUser(u.id, u.email)}
                          disabled={busyId === u.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
