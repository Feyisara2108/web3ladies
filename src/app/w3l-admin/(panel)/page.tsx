"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChartColumn,
  FileText,
  GraduationCap,
  Handshake,
  MessageSquareQuote,
  Star,
  Trophy,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

const count = (table: string) =>
  createClient().from(table).select("id", { count: "exact", head: true });

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    testimonials: 0,
    events: 0,
    cohorts: 0,
    posts: 0,
    featured: 0,
    partners: 0,
    socialProof: 0,
    impactStats: 0,
  });

  useEffect(() => {
    Promise.all([
      count("testimonials"),
      count("events"),
      count("cohorts"),
      count("blog_posts"),
      count("featured_items"),
      count("partners"),
      count("social_proof_items"),
      count("impact_stats"),
    ]).then(([t, e, c, p, f, pa, s, i]) =>
      setCounts({
        testimonials: t.count ?? 0,
        events: e.count ?? 0,
        cohorts: c.count ?? 0,
        posts: p.count ?? 0,
        featured: f.count ?? 0,
        partners: pa.count ?? 0,
        socialProof: s.count ?? 0,
        impactStats: i.count ?? 0,
      }),
    );
  }, []);

  const cards = [
    { label: "Featured", count: counts.featured, icon: Star, to: "/w3l-admin/featured" },
    { label: "Testimonials", count: counts.testimonials, icon: MessageSquareQuote, to: "/w3l-admin/testimonials" },
    { label: "Events", count: counts.events, icon: Calendar, to: "/w3l-admin/events" },
    { label: "Cohorts", count: counts.cohorts, icon: GraduationCap, to: "/w3l-admin/cohorts" },
    { label: "Blog Posts", count: counts.posts, icon: FileText, to: "/w3l-admin/blog" },
    { label: "Partners", count: counts.partners, icon: Handshake, to: "/w3l-admin/partners" },
    { label: "Social Proof", count: counts.socialProof, icon: Trophy, to: "/w3l-admin/social-proof" },
    { label: "Impact Stats", count: counts.impactStats, icon: ChartColumn, to: "/w3l-admin/impact" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your Web3Ladies content</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.to} href={c.to}>
            <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{c.count}</p>
                </div>
                <c.icon className="w-8 h-8 text-primary opacity-60" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
