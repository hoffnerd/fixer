// Types ----------------------------------------------------------------------------
import { type Resources as ResourcesType } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { RESOURCES_INFO } from "@/data/_config";
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import ResourceToolTip from "./ResourceToolTip";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Types =====

interface Options {
    hideTooltip?: boolean;
}



//______________________________________________________________________________________
// ===== True Constants =====

const DEFAULT_OPTIONS: Options = {
    hideTooltip: false,
};



//______________________________________________________________________________________
// ===== Component =====

export default function ResourceBadge({
    resourceKey,
    value,
    options,
}: Readonly<{ 
    resourceKey: keyof ResourcesType; 
    value: number;
    options?: Options;
}>) {

    //______________________________________________________________________________________
    // ===== Options =====
    const { hideTooltip } = { ...DEFAULT_OPTIONS, ...options };

    //______________________________________________________________________________________
    // ===== Constants =====
    const resourceInfo = RESOURCES_INFO[resourceKey];
    const { IconComponent } = resourceInfo;

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <li className="flex">
            {hideTooltip 
                ? <IconComponent />
                : <ResourceToolTip resourceInfo={resourceInfo} />
            }
            <span>&nbsp;: {value}</span>
        </li>
    );
}
