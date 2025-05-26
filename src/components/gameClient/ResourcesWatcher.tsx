"use client"

// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
import { useEffect, useState } from "react";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Data -----------------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
import { SCALING_REGENERATED_TIME } from "@/data/_config";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function ResourcesWatcher(){

    //______________________________________________________________________________________
    // ===== Stores =====
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const sessionTime = useGameStore((state) => state.sessionTime);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();



    //______________________________________________________________________________________
    // ===== Use Effect =====

    useEffect(() => {
        if(!saveFile?.id) return;
        if(sessionTime === 0) return;

        const regeneratedTime = saveFile?.potentialMercs?.regeneratedTime || SCALING_REGENERATED_TIME;
        if(sessionTime % regeneratedTime !== 0) return;

        pushToSaveQueue({ mutationKey: "regenerateMercsMutation" });
    }, [sessionTime])

    useEffect(() => {
        if(!saveFile?.id) return;
        if(sessionTime === 0) return;

        const regeneratedTime = saveFile?.potentialContracts?.regeneratedTime || SCALING_REGENERATED_TIME;
        if(sessionTime % regeneratedTime !== 0) return;

        pushToSaveQueue({ mutationKey: "regenerateContractsMutation" });
    }, [sessionTime])

    useEffect(() => {
        if(!saveFile?.id) return;
        if(sessionTime === 0) return;

        const regeneratedTime = saveFile?.potentialContracts?.regeneratedTime || SCALING_REGENERATED_TIME;
        if(sessionTime % regeneratedTime !== 0) return;

        pushToSaveQueue({ mutationKey: "regenerateBusinessesMutation" });
    }, [sessionTime])



    //______________________________________________________________________________________
    // ===== Component Return =====
    return <></>
}
