// Types ----------------------------------------------------------------------------
import { type Resources as ResourcesType } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { type RESOURCES_INFO } from "@/data/_config";
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import ToolTip from "@/_legoBlocks/nextjsCommon/components/shadcn/ToolTip";
// Other ----------------------------------------------------------------------------

//______________________________________________________________________________________
// ===== Component =====

export default function ResourceToolTip({
    resourceInfo,
}: Readonly<{
    resourceInfo: (typeof RESOURCES_INFO)[keyof typeof RESOURCES_INFO];
}>) {
    const IconComponent = resourceInfo.IconComponent;
    return (
        <ToolTip trigger={<IconComponent />} className="max-w-lg">
            <h3 className="text-xl font-bold">{resourceInfo.display}</h3>
            <p>{resourceInfo.description}</p>
        </ToolTip>
    );
}
