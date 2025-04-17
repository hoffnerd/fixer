"use client"

// Types ----------------------------------------------------------------------------
import { type Merc as MercType } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import { CardContent } from "../shadcn/ui/card";
import CardButton from "@/_legoBlocks/nextjsCommon/components/shadcn/CardButton";
import MercCard from "../cards/MercCard";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Micro-Components =====



//______________________________________________________________________________________
// ===== Component =====

export default function Mercs() {
    const { saveFile } = useSaveFile();
    const mercs = saveFile?.mercs ?? {};

    if(!saveFile) return <></>;
    return <>
        <h3 className="text-3xl pb-2">Mercs</h3>
        {Object.entries(mercs).map(([key, merc]) => (
            <MercCard key={key} merc={merc} options={{ isHired: true, allowManageMerc: true }}/>
        ))}
    </>
}