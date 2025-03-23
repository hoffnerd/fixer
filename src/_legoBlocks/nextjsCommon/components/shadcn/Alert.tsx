// Types ----------------------------------------------------------------------------
import { type VariantProps } from "class-variance-authority";
// Packages -------------------------------------------------------------------------
import { Terminal } from "lucide-react";
// Data -----------------------------------------------------------------------------
// Styles ---------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import { Alert as ShadcnAlert, AlertTitle, AlertDescription, alertVariants } from "@/components/shadcn/ui/alert";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

/**
 * Renders an alert component with specified variant, title, and children.
 */
export function Alert({
    children,
    className,
    variant="none",
    title,
}: Readonly<{ 
    children?: React.ReactNode;
    className?: string;
    variant?: VariantProps<typeof alertVariants>["variant"];
    title?: string;
 }>) {
    return (
        <ShadcnAlert className={className} variant={variant} >
            <Terminal className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{children}</AlertDescription>
        </ShadcnAlert>
    );
}