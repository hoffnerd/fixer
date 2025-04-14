// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { type RESOURCES_INFO } from "@/data/_config";
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import ToolTipCapsule from "@/_legoBlocks/nextjsCommon/components/shadcn/ToolTipCapsule";
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
        <ToolTipCapsule trigger={<IconComponent />} className="max-w-lg">
            <h3 className="text-xl font-bold">{resourceInfo.display}</h3>
            <p>{resourceInfo.description}</p>
        </ToolTipCapsule>
    );
}
