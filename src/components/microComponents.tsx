// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
import { Terminal } from "lucide-react";
// import { motion } from "motion/react"
// Data -----------------------------------------------------------------------------
// Styles ---------------------------------------------------------------------------
// ShadcnUI -------------------------------------------------------------------------
import { Alert as ShadcnAlert, AlertTitle, AlertDescription } from "./shadcn/ui/alert";
// Components -----------------------------------------------------------------------
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Micro-Components =====

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
    title?: string;
    variant?: "none" | "default" | "destructive" | "neonEffect" | "neonEffectWithGlow";
 }>) {
    return (
        <ShadcnAlert className={className} variant={variant} >
            <Terminal className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{children}</AlertDescription>
        </ShadcnAlert>
    );
}

/**
 * Renders a horizontal line with a specified className and lineClassName.
 */
export function HorizontalLine({ className, lineClassName }: Readonly<{ className?: string, lineClassName?: string }>){
    return (
        <div className={`px-3 ${className}`}>
            <div className={`border-2 rounded-3xl neonEffect neBorder neBorderGlow neColorWhite ${lineClassName}`}/>
        </div>
    )
}


// export function MotionDiv({children, className}:Readonly<{ children?:React.ReactNode, className?:string }>){
//     return <motion.div layout transition={{ ease: "linear", stiffness: 100 }} className={className}>{children}</motion.div>
// }