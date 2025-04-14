"use client"

// Types ----------------------------------------------------------------------------
import { type SaveFile, type SaveQueueObj } from "@/types";
// Packages -------------------------------------------------------------------------
import { useEffect } from "react";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Data -----------------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------------
import useTimer from "@/_legoBlocks/nextjsCommon/hooks/useTimer";
// Components -----------------------------------------------------------------------
import Portal from "@/_legoBlocks/nextjsCommon/components/Portal";
import { ReadableTime } from "@/_legoBlocks/nextjsCommon/components/microComponents";
import { useSaveFile } from "@/hooks/useSaveFile";
import { toast } from "sonner";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Pure Function =====

const getRequiredMutationProps = (saveQueueObj: SaveQueueObj) => {
    const { mutationKey, props } = { ...saveQueueObj };

    switch (mutationKey) {
        case "updateResourcesMutation":
            if(!props?.income) return { error: "No Income provided!" };
            return { income: props.income };
        case "assignMercMutation":
            if(!props?.assignType) return { error: "No Type provided!" };
            if(props.assignType === "contract" && !props?.contractKey) return { error: "No Contract provided!" };
            if(props.assignType === "business" && !props?.businessKey) return { error: "No Business provided!" };
            if(!props?.mercKey) return { error: "No Merc provided!" };
            return { 
                mercKey: props.mercKey,
                assignType: props.assignType,
                contractKey: props.contractKey,
                businessKey: props.businessKey,
                slot: props?.slot,
            };
        case "hireMercMutation": 
            if(!props?.mercKey) return { error: "No Merc provided!" };
            return { mercKey: props.mercKey };
            
        case "signContractMutation": 
        case "cancelContractMutation": 
            if(!props?.contractKey) return { error: "No Contract provided!" };
            return { contractKey: props.contractKey };

        case "regenerateMercsMutation": 
        case "regenerateContractsMutation": 
            return {};
        default: return { error: "Unknown Mutation Key!" };
    }
}



//______________________________________________________________________________________
// ===== Component =====

export default function SaveQueueClient(){

    //______________________________________________________________________________________
    // ===== Stores =====
    const activateSaveQueueObj = useGameStore((state) => state.activateSaveQueueObj);
    const finishSaveQueueObj = useGameStore((state) => state.finishSaveQueueObj);
    const inGameTime = useGameStore((state) => state.inGameTime);
    const saveQueue = useGameStore((state) => state.saveQueue);
    const activeSaveQueueObj = useGameStore((state) => state.activeSaveQueueObj);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile, mutations } = useSaveFile();



    //______________________________________________________________________________________
    // ===== Use Effect =====

    useEffect(() => {
        if(activeSaveQueueObj) return;
        if(saveQueue.length === 0) return;
        activateSaveQueueObj();
    }, [saveQueue, activeSaveQueueObj, activateSaveQueueObj])

    useEffect(() => {
        if(!activeSaveQueueObj) return;
        
        const mutation = mutations[activeSaveQueueObj.mutationKey];
        const requiredProps = getRequiredMutationProps(activeSaveQueueObj);
        if(requiredProps.error) {
            toast.error(requiredProps.error);
            return;
        }

        const runMutation = async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            await mutation.mutateAsync({ id: saveFile?.id, inGameTime, ...requiredProps } as any);
            finishSaveQueueObj();
        }
        void runMutation();
    }, [activeSaveQueueObj, finishSaveQueueObj])
    


    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <></>
    );
}
