import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingFeatureItemProps {
  text: string;
  className?: string;
}

export function PricingFeatureItem({ text, className }: PricingFeatureItemProps) {
  return (
    <li className={cn("flex items-center gap-3", className)}>
      <div className="bg-secondary flex items-center justify-center rounded-[0.5rem] size-7">
        <Check size={20} className="text-primary" />
      </div>
      <span className="text-muted-foreground font-semibold">{text}</span>
    </li>
  );
}
