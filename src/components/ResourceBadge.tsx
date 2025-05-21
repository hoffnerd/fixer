// Types ----------------------------------------------------------------------------
import { type Resources as ResourcesType } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { RESOURCES_INFO } from "@/data/_config";
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import ResourceToolTip from "./ResourceToolTip";
// Other ----------------------------------------------------------------------------
import { cn } from "@/lib/shadcn";



//______________________________________________________________________________________
// ===== Types =====

interface Options {
    hideTooltip?: boolean;
    elementType?: "li" | "div" | "fragment";
    separator?: string;
}



//______________________________________________________________________________________
// ===== True Constants =====

const DEFAULT_OPTIONS: Options = {
    hideTooltip: false,
    elementType: "li",
    separator: ":"
};



//______________________________________________________________________________________
// ===== Micro-Components =====

function ElementType({
    children,
    className,
    elementType,
}: Readonly<{
    children: React.ReactNode;
    className?: string;
    elementType: Options["elementType"];
}>){
    switch (elementType) {
        case "li": return <li className={cn("flex", className)}>{children}</li>;
        case "div": return <div className={className}>{children}</div>;
        default: return <>{children}</>;
    }
}



//______________________________________________________________________________________
// ===== Component =====

export default function ResourceBadge({
    className,
    classNames={},
    resourceKey,
    value,
    options,
}: Readonly<{ 
    className?: string;
    classNames?: { iconComponent?: string; spanText?: string; };
    resourceKey: keyof ResourcesType; 
    value: number;
    options?: Options;
}>) {

    //______________________________________________________________________________________
    // ===== Options =====
    const { hideTooltip, elementType, separator } = { ...DEFAULT_OPTIONS, ...options };

    //______________________________________________________________________________________
    // ===== Constants =====
    const resourceInfo = RESOURCES_INFO[resourceKey];
    const { IconComponent } = resourceInfo;

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <ElementType className={cn("flex", className)} elementType={elementType}>
            {hideTooltip 
                ? <IconComponent className={classNames?.iconComponent} />
                : <ResourceToolTip resourceInfo={resourceInfo} />
            }
            <span className={classNames?.spanText}>{separator} {value}</span>
        </ElementType>
    );
}
