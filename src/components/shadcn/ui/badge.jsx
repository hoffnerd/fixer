import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/util/shadcn.js";
import { variantsNeonBackgrounds } from "@/data/variantsNeon"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                outline: "text-foreground",
                default: "border-transparent bg-primary text-primary-foreground",
                defaultHover: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-secondary-foreground",
                secondaryHover: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "border-transparent bg-destructive text-destructive-foreground",
                destructiveHover: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",

                ...variantsNeonBackgrounds,
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

function Badge({ className, variant, hover=false, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant: hover ? `${variant}Hover` : variant }), className)} {...props} />
    );
}
export { Badge, badgeVariants };
