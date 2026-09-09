import type { ReactNode } from "react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Thin wine hairline strip at the very top edge */}
      <div className="h-1 w-full bg-[#7a1f3d]" />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
