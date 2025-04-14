// Components-------------------------------------------------------------------
import {
    Tooltip as ShadcnTooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/shadcn/ui/tooltip";
// Other------------------------------------------------------------------------

//______________________________________________________________________________________
// ===== True Constants =====

const DEFAULT_OPTIONS = {
    childrenAs: "content", // "trigger" | "content"
};

//______________________________________________________________________________________
// ===== Component =====

/**
 * Provides shadcn-ui tooltip functionality for displaying content when hovering over a specified element.
 * @param props
 * @param props.children - any valid JSX, text or element that will be displayed inside the tooltip when it is triggered.
 * @param props.className - string, className to be applied to the tooltip content.
 * @param props.trigger - any valid JSX, displays what will trigger the tooltip when hovered or clicked.
 * @param props.content - any valid JSX, displays content inside the tooltip when it is triggered.
 * @param props.options
 * @param props.options.childrenAs - string default is "content". Determines whether the children should be displayed as the content or the trigger.
 */
export default function ToolTipCapsule({
    children,
    className,
    trigger,
    content,
    options = {},
}: Readonly<{
    children: React.ReactNode;
    className?: string;
    trigger?: React.ReactNode;
    content?: React.ReactNode;
    options?: { childrenAs?: "trigger" | "content" };
}>) {
    //______________________________________________________________________________________
    // ===== Options =====
    const { childrenAs } = { ...DEFAULT_OPTIONS, ...options };

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <TooltipProvider>
            <ShadcnTooltip>
                <TooltipTrigger asChild>
                    {childrenAs === "trigger" ? children : trigger}
                </TooltipTrigger>
                <TooltipContent className={className}>
                    {childrenAs === "content" ? children : content}
                </TooltipContent>
            </ShadcnTooltip>
        </TooltipProvider>
    );
}
