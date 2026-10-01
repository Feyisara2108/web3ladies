"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  ChartColumn,
  FileText,
  GraduationCap,
  Handshake,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings2,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "./use-admin-auth";

const NAV = [
  { to: "/w3l-admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/w3l-admin/featured", icon: Star, label: "Featured" },
  { to: "/w3l-admin/testimonials", icon: MessageSquareQuote, label: "Testimonials" },
  { to: "/w3l-admin/events", icon: Calendar, label: "Events" },
  { to: "/w3l-admin/cohorts", icon: GraduationCap, label: "Cohorts" },
  { to: "/w3l-admin/blog", icon: FileText, label: "Blog Posts" },
  { to: "/w3l-admin/partners", icon: Handshake, label: "Partners" },
  { to: "/w3l-admin/social-proof", icon: Trophy, label: "Social Proof" },
  { to: "/w3l-admin/impact", icon: ChartColumn, label: "Impact" },
  { to: "/w3l-admin/submissions", icon: Inbox, label: "Submissions" },
  { to: "/w3l-admin/form-config", icon: Settings2, label: "Form Config" },
  { to: "/w3l-admin/founder-story", icon: BookOpen, label: "Founder Story" },
  { to: "/w3l-admin/media", icon: Image, label: "Media" },
  { to: "/w3l-admin/users", icon: Users, label: "Users" },
];

/** Sidebar + content frame for every admin screen (port of the live site's layout). */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAdminAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/w3l-admin/login");
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <h1 className="font-display font-bold text-lg text-foreground">Web3Ladies</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => {
            const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                href={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-3">
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
            <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
