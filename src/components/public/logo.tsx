import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Web3Ladies logo: the gradient icon mark + two-tone wordmark where "Web3" is
 * in the default foreground and "Ladies" is in the purple primary — matching
 * the live site exactly.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 font-display text-lg font-bold", className)}
    >
      <Image
        src="/assets/web3ladies-logo-Cd0zWIm7.png"
        alt="Web3Ladies"
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
        priority
      />
      <span>
        Web3<span className="text-primary">Ladies</span>
      </span>
    </Link>
  );
}
