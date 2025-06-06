"use client"

// Types ----------------------------------------------------------------------------
import type { Contract } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import { Card, CardContent, CardFooter } from "@/components/shadcn/ui/card";
import { Button } from "@/components/shadcn/ui/button";
import ContractCardHeader from "./contract/ContractCardHeader";
import ContractSignedContent from "./contract/ContractSignedContent";
import ContractSignedFooter from "./contract/ContractSignedFooter";
import ProgressBarFooter from "./ProgressBarFooter";
// Other ----------------------------------------------------------------------------
import { getHighestRoleLevel } from "@/utils/contracts";



//______________________________________________________________________________________
// ===== True Constants =====

const DESCRIPTION = "This is a contract description. It can be as long as you want. It can even be multiple lines. This is a contract description. It can be as long as you want. It can even be multiple lines. This is a contract description. It can be as long as you want. It can even be multiple lines.";



//______________________________________________________________________________________
// ===== Micro-Components =====

function ContractStageFooter({ contract }: Readonly<{ contract: Contract; }>) {
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);

    const onClick = () => {
        console.log({ trace: "onClick", key: contract.key, stage: contract.stage });
        if(contract.stage === "unsigned") return pushToSaveQueue({ mutationKey: "signContractMutation", props: { contractKey: contract.key } });
    }

    if(contract.stage === "unsigned") return <>
        <Button variant="neonEffect" className="w-full neColorBlue rounded-none" onClick={onClick} disabled={isGameSaving}>
            Sign
        </Button>
    </>
    if(contract.stage === "signed") return (
        <div className="flex flex-col w-full">
            <ContractSignedFooter contract={contract} />
            <ProgressBarFooter contract={contract} classNameIndicator="neColorRed" />
        </div>
    )
    if(contract.stage === "researching") return <span>Researching</span>
    if(contract.stage === "inProgress") return <ProgressBarFooter contract={contract} />
    return <span>Unknown</span>
}

function ContractStageContent({ contract }: Readonly<{ contract: Contract; }>) {
    const highestRoleLevel = getHighestRoleLevel(contract.roleLevels);
    if(contract.stage === "unsigned") return <>
        <div className="grid grid-cols-3 gap-1">
            <span className="col-span-2">Level:</span>
            <span>{highestRoleLevel}</span>
        </div>
        <div className="text-xs text-gray-500 max-h-20 overflow-hidden text-ellipsis">
            {DESCRIPTION}
        </div>
    </>
    return <ContractSignedContent contract={contract} />
}



//______________________________________________________________________________________
// ===== Component =====

export default function ContractCard({ contract }: Readonly<{ contract: Contract; }>) {

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <Card className="py-0 mt-2 mb-5 gap-1 border-2 overflow-hidden neonEffect neBorder neBorderGlow glowIntensityLow neColorBlue">
            <ContractCardHeader contract={contract} />
            <CardContent className="">
                <div className="flex flex-col">
                    <ContractStageContent contract={contract} />
                </div>
            </CardContent>
            <CardFooter className="px-0 pt-2">
                <ContractStageFooter contract={contract} />
            </CardFooter>
        </Card>
    )
}
