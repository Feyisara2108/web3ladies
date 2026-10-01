import type { ReactNode } from "react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
