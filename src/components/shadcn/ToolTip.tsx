// Components-------------------------------------------------------------------
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
// Other------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function ToolTip({
    children,
    className,
    trigger,
}: Readonly<{
    children: React.ReactNode;
    className?: string;
    trigger: React.ReactNode;
}>) {
    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <TooltipProvider>
            <ShadcnTooltip>
                <TooltipTrigger asChild>{trigger}</TooltipTrigger>
                <TooltipContent className={className}>{children}</TooltipContent>
            </ShadcnTooltip>
        </TooltipProvider>
    );
}
