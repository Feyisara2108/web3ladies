"use client";

import { useState } from "react";
import { Download, Inbox, Trash2 } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useAdminRows } from "@/components/admin/use-admin-rows";

type Submission = {
  id: string;
  form_type: string;
  data: Record<string, string>;
  created_at: string;
};

const FORM_LABELS: Record<string, string> = {
  community: "Community Join",
  venture_builder: "Venture Builder",
  partner: "Partner Inquiry",
  event_host: "Event Host Request",
};

export default function AdminSubmissionsPage() {
  const [formType, setFormType] = useState("all");
  const {
    data: submissions = [],
    isFetching: loading,
    refetch,
  } = useAdminRows<Submission>(
    "form_submissions",
    { column: "created_at", ascending: false },
    formType === "all" ? undefined : { column: "form_type", value: formType },
  );

  const remove = async (id: string) => {
    const { error } = await createClient().from("form_submissions").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Deleted");
    refetch();
  };

  const exportExcel = () => {
    if (submissions.length === 0) {
      toast.error("No data to export");
      return;
    }
    const rows = submissions.map((s) => ({
      Form: FORM_LABELS[s.form_type] || s.form_type,
      Date: new Date(s.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      ...s.data,
    }));
    const sheet = XLSX.utils.json_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Submissions");
    sheet["!cols"] = Object.keys(rows[0]).map((key) => ({
      wch:
        Math.max(key.length, ...rows.map((r) => String((r as Record<string, string>)[key] || "").length))
          .toString().length + 2,
    }));
    XLSX.writeFile(book, formType === "all" ? "all-submissions.xlsx" : `${formType}-submissions.xlsx`);
    toast.success("Downloaded!");
  };

  const columns = Array.from(new Set(submissions.flatMap((s) => Object.keys(s.data))));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Form Submissions</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View and export form submissions from the website
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={formType} onValueChange={setFormType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Forms</SelectItem>
              <SelectItem value="community">Community Join</SelectItem>
              <SelectItem value="venture_builder">Venture Builder</SelectItem>
              <SelectItem value="partner">Partner Inquiry</SelectItem>
              <SelectItem value="event_host">Event Host Request</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportExcel} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <p className="p-6 text-muted-foreground">Loading…</p>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Inbox className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">No submissions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Form</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  {columns.map((c) => (
                    <th key={c} className="text-left p-3 font-medium text-muted-foreground capitalize">
                      {c.replace(/_/g, " ")}
                    </th>
                  ))}
                  <th className="p-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                        {FORM_LABELS[s.form_type] || s.form_type}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {new Date(s.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    {columns.map((c) => (
                      <td key={c} className="p-3 text-foreground max-w-[250px] truncate" title={s.data[c] || ""}>
                        {s.data[c] || "–"}
                      </td>
                    ))}
                    <td className="p-3">
                      <button
                        onClick={() => remove(s.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <p className="text-xs text-muted-foreground">
        {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
