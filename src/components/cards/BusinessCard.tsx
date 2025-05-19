"use client"

// Types ----------------------------------------------------------------------------
import type { Business } from "@/types";
// Packages -------------------------------------------------------------------------
import { useEffect, useState } from "react";
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER } from "@/data/_config";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import { Card, CardContent, CardFooter } from "@/components/shadcn/ui/card";
import { Button } from "@/components/shadcn/ui/button";
import BusinessCardHeader from "./business/BusinessCardHeader";
import BusinessSignedContent from "./business/BusinessSignedContent";
import BusinessSignedFooter from "./business/BusinessSignedFooter";
import BusinessProgressBarFooter from "./business/BusinessProgressBarFooter";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";
import { getHighestRoleLevel } from "@/utils/businesses";



//______________________________________________________________________________________
// ===== True Constants =====

const DESCRIPTION = "This is a business description. It can be as long as you want. It can even be multiple lines. This is a business description. It can be as long as you want. It can even be multiple lines. This is a business description. It can be as long as you want. It can even be multiple lines.";



//______________________________________________________________________________________
// ===== Micro-Components =====

function BusinessStageFooter({ business }: Readonly<{ business: Business; }>) {
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);

    const onClick = () => {
        console.log({ trace: "onClick", key: business.key, stage: business.stage });
        if(business.stage === "unsigned") return pushToSaveQueue({ mutationKey: "signBusinessMutation", props: { businessKey: business.key } });
    }

    if(business.stage === "unsigned") return <>
        <Button variant="neonEffect" className="w-full neColorBlue rounded-none" onClick={onClick} disabled={isGameSaving}>
            Sign
        </Button>
    </>
    if(business.stage === "signed") return (
        <div className="flex flex-col w-full">
            <BusinessSignedFooter business={business} />
            <BusinessProgressBarFooter business={business} classNameIndicator="neColorRed" />
        </div>
    )
    if(business.stage === "researching") return <span>Researching</span>
    if(business.stage === "inProgress") return <BusinessProgressBarFooter business={business} />
    return <span>Unknown</span>
}

function BusinessStageContent({ business }: Readonly<{ business: Business; }>) {
    const highestRoleLevel = getHighestRoleLevel(business);
    if(business.stage === "unsigned") return <>
        <div className="grid grid-cols-3 gap-1">
            <span className="col-span-2">Level:</span>
            <span>{highestRoleLevel}</span>
        </div>
        <div className="text-xs text-gray-500 max-h-20 overflow-hidden text-ellipsis">
            {DESCRIPTION}
        </div>
    </>
    return <BusinessSignedContent business={business} />
}



//______________________________________________________________________________________
// ===== Component =====

export default function BusinessCard({ business }: Readonly<{ business: Business; }>) {

    //______________________________________________________________________________________
    // ===== Stores =====
    const sessionTime = useGameStore((state) => state.sessionTime);



    //______________________________________________________________________________________
    // ===== State =====
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);


    //______________________________________________________________________________________
    // ===== Use Effect =====

    useEffect(() => {
        if(sessionStartTime !== null) return;
        setSessionStartTime(sessionTime);
    }, [sessionTime])



    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <Card className="py-0 mt-2 mb-5 gap-1 border-2 overflow-hidden neonEffect neBorder neBorderGlow glowIntensityLow neColorBlue">
            <BusinessCardHeader business={business} />
            <CardContent className="">
                <div className="flex flex-col">
                    <BusinessStageContent business={business} />
                </div>
            </CardContent>
            <CardFooter className="px-0 pt-2">
                <BusinessStageFooter business={business} />
            </CardFooter>
        </Card>
    )
}
