"use client"

// Types ----------------------------------------------------------------------------
import type { Business } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { SCALING_BUSINESS_LEVEL } from "@/data/_config";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import { Card, CardContent, CardFooter } from "@/components/shadcn/ui/card";
import { Button } from "@/components/shadcn/ui/button";
import BusinessCardHeader from "./business/BusinessCardHeader";
import BusinessOpenedContent from "./business/BusinessOpenedContent";
import ProgressBarFooter from "./ProgressBarFooter";
// Other ----------------------------------------------------------------------------
import { getHighestRoleLevel } from "@/utils/contracts";
import { getBusinessDisplay } from "@/utils/businesses";



//______________________________________________________________________________________
// ===== Micro-Components =====

function BusinessStageFooter({ business }: Readonly<{ business: Business; }>) {
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);

    const onClick = () => {
        console.log({ trace: "onClick", key: business.key, stage: business.stage });
        if(business.stage === "closed") return pushToSaveQueue({ mutationKey: "purchaseBusinessMutation", props: { businessKey: business.key } });
    }

    if(business.stage === "closed") return <>
        <Button variant="neonEffect" className="w-full neColorBlue rounded-none" onClick={onClick} disabled={isGameSaving}>
            Purchase
        </Button>
    </>
    if((!business?.mercSlots?.manager?.key) && (!business?.mercSlots?.security?.key) && (!business?.mercSlots?.illicitActivity?.key)){ 
        return <ProgressBarFooter business={business} classNameIndicator="neColorRed" />
    }
    return <ProgressBarFooter business={business} />
}

function BusinessStageContent({ business }: Readonly<{ business: Business; }>) {
    const highestRoleLevel = getHighestRoleLevel(business.roleLevels, SCALING_BUSINESS_LEVEL);
    if(business.stage === "closed") return <>
        <span className="col-span-3 text-center">{getBusinessDisplay(business)}</span>
        {/* <span className="col-span-3">Type of Business:</span>
        <span className={`ml-4 mt-[-8px] col-span-3 neonEffect neText neTextGlow neColorBlue`}>
            {getBusinessDisplay(business)}
        </span> */}
        <div className="grid grid-cols-3 gap-1">
            <span className="col-span-2">Level:</span>
            <span>{highestRoleLevel}</span>
        </div>
    </>
    return <BusinessOpenedContent business={business} />
}



//______________________________________________________________________________________
// ===== Component =====

export default function BusinessCard({ business, levelPlayer }: Readonly<{ business: Business; levelPlayer: number; }>) {

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <Card className="py-0 mt-2 mb-5 gap-1 border-2 overflow-hidden neonEffect neBorder neBorderGlow glowIntensityLow neColorBlue">
            <BusinessCardHeader business={business} levelPlayer={levelPlayer} />
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
