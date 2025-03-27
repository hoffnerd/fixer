"use client"

// Types ----------------------------------------------------------------------------
import { type Business as BusinessType, type SaveFile } from "@/types";
import { type RESOURCES_INFO } from "@/data/_config";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { FAKE_BUSINESSES } from "@/data/fake";
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import { CardContent } from "./shadcn/ui/card";
import CardButton from "@/_legoBlocks/nextjsCommon/components/shadcn/CardButton";
import ResourceBadge from "./ResourceBadge";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Micro-Components =====

function Business({ saveFile, business }: Readonly<{ saveFile: SaveFile; business: BusinessType }>) {
    return (
        <CardButton
            className="border-2 mt-2 mb-5 neonEffect neBorder neBorderGlow glowIntensityLow neColorBlue"
            classNames={{ cardHeader:"pb-3", cardTitle:"flex justify-between" }}
            onClick={()=>console.log("test")}
            title={<>
                <span>{business.display}</span>
                <span>Income:</span>
            </>}
        >
            <CardContent className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                <p>Manager: {business.mercSlots?.manager?.key ? saveFile.mercs[business.mercSlots?.manager?.key]?.display : "None"}</p>
                <p>Security: {business.mercSlots?.manager?.key ? saveFile.mercs[business.mercSlots?.manager?.key]?.display : "None"}</p>
                </div>
                <div className="flex justify-end">
                    <ul className="whitespace-nowrap">
                        {Object.entries(business.income).map(([key, value]) => (
                            <ResourceBadge 
                                key={key} 
                                resourceKey={key as keyof typeof RESOURCES_INFO} 
                                value={(value ?? 0) as number} 
                            />
                        ))}
                    </ul>
                </div>
            </CardContent>
            {/* <CardFooter></CardFooter> */}
        </CardButton>
    )
}



//______________________________________________________________________________________
// ===== Component =====

export default function Businesses() {
    const { saveFile: realSaveFile } = useSaveFile();
    // const saveFile = realSaveFile;
    const saveFile = { ...realSaveFile, businesses: FAKE_BUSINESSES } as SaveFile;
    const businesses = saveFile?.businesses ?? {};

    if(!saveFile) return <></>;
    return <>
        <h3 className="text-3xl pb-2">Businesses</h3>
        {Object.entries(businesses).map(([key, business]) => (
            <Business key={key} saveFile={saveFile} business={business}/>
        ))}
    </>
}