import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        online: "bg-success text-success-foreground",
        offline: "bg-danger text-danger-foreground",
        maintenance: "bg-warning text-warning-foreground",
        active: "bg-success text-success-foreground",
        inactive: "bg-muted text-muted-foreground",
        decommissioned: "bg-danger text-danger-foreground",
      },
    },
    defaultVariants: {
      variant: "inactive",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

function StatusBadge({ className, variant, children, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };