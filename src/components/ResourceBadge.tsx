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
// ===== Component =====

export default function ResourceBadge({
    resourceKey,
    value,
}: Readonly<{ 
    resourceKey: keyof ResourcesType; 
    value: number 
}>) {
    return (
        <li className="flex">
            <ResourceToolTip resourceInfo={RESOURCES_INFO[resourceKey]} />
            <span>&nbsp;: {value}</span>
        </li>
    );
}
