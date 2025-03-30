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
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Micro-Components =====

function Merc({ merc }: Readonly<{ merc: MercType }>) {
    const totalLevel = Object.values(merc?.levels ?? {}).reduce((a: number, b: number) => a + b, 0) as number;
    return (
        <CardButton
            className="border-2 mt-2 mb-5 neonEffect neBorder neBorderGlow glowIntensityLow neColorBlue"
            classNames={{ cardHeader:"pb-3", cardTitle:"flex justify-between" }}
            onClick={()=>console.log("test")}
            title={<>
                <span>{merc.display}</span>
                <span>Lvl: {totalLevel}</span>
            </>}
        >
            <CardContent className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                    <p>Active Contract/Job:</p>
                    <p>None</p>
                </div>
                <div className="flex justify-end">
                    <ul className="whitespace-nowrap">
                        <li>Corpo: {merc.levels.corpo}</li>
                        <li>Solo: {merc.levels.solo}</li>
                        <li>Tech: {merc.levels.tech}</li>
                    </ul>
                </div>
            </CardContent>
            {/* <CardFooter></CardFooter> */}
        </CardButton>
    )
}



//______________________________________________________________________________________
// ===== Component =====

export default function Mercs() {
    const { saveFile } = useSaveFile();
    const mercs = saveFile?.mercs ?? {};

    if(!saveFile) return <></>;
    return <>
        <h3 className="text-3xl pb-2">Mercs</h3>
        {Object.entries(mercs).map(([key, merc]) => <Merc key={key} merc={merc}/>)}
    </>
}