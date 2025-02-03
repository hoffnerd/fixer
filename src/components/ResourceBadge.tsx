
// Types ----------------------------------------------------------------------------
import { type Resources as ResourcesType } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { RESOURCES_INFO } from "@/data/_config";
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import ToolTip from "./shadcn/ToolTip";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function ResourceBadge({ resourceKey, value }: Readonly<{ resourceKey: keyof ResourcesType, value: number }>) {
    const resourceInfo = RESOURCES_INFO[resourceKey];
    const IconComponent = resourceInfo.IconComponent;
    return (
        <li className="flex">
            <ToolTip trigger={<IconComponent/>} className="max-w-lg">
                <h3 className="text-xl font-bold">{resourceInfo.display}</h3>
                <p>{resourceInfo.description}</p>
            </ToolTip>
            <span>&nbsp;: {value}</span>
        </li>
    );
}

