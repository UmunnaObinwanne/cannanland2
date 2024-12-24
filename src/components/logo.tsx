import Link from "next/link";
import { Cross } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <Cross size={32} className="text-blue-600" />
      <span className="font-heading text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Cannanland
      </span>
    </Link>
  );
}
