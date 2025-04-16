"use client"

// Types ----------------------------------------------------------------------------
import { type Businesses, type ResourceRewards, type SaveFile } from "@/types";
// Packages -------------------------------------------------------------------------
import { useEffect, useState } from "react";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Data -----------------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
import { DEFAULT_BUSINESS, SCALING_REGENERATED_TIME } from "@/data/_config";
import { addResourceRewards, basicSortComparison } from "@/utils";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Interfaces =====

type IncomeRates = Record<number, ResourceRewards>;




//______________________________________________________________________________________
// ===== Pure Functions =====

const findIncomeRates = (saveFile?: SaveFile) => {
    if(!saveFile) return {};
    const { businesses } = saveFile;

    let incomeRates: IncomeRates = {}

    Object.keys(businesses).forEach((x: keyof Businesses) => {
        const businessKey = x;
        const business = businesses?.[businessKey] ?? {};
        const { time, income } = { ...DEFAULT_BUSINESS, ...business };
        if(!time) return;
        if(incomeRates?.[time]){
            // Income at this time has already been calculated once so lets add the additional income
            incomeRates[time] = { ...addResourceRewards(incomeRates[time], income) };
        } else {
            // Income at this time has not been calculated yet
            incomeRates[time] = { ...income };
        }
    });


    const incomeRatesSeconds = Object.keys(incomeRates)
        .map(x => parseInt(x))
        .sort(basicSortComparison)
        .reverse();

    return { incomeRates, incomeRatesSeconds };
}



//______________________________________________________________________________________
// ===== Component =====

export default function ResourcesWatcher(){

    //______________________________________________________________________________________
    // ===== Stores =====
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const inGameTime = useGameStore((state) => state.inGameTime);
    const sessionTime = useGameStore((state) => state.sessionTime);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile, updateResourcesMutation } = useSaveFile();



    //______________________________________________________________________________________
    // ===== Use Effect =====

    useEffect(() => {
        if(!saveFile?.id) return;

        const { incomeRates, incomeRatesSeconds } = findIncomeRates(saveFile);
        if(!incomeRates) return;
        if(!incomeRatesSeconds?.length) return;
        
        let income: ResourceRewards = {}
        for (const x of incomeRatesSeconds) {
            if(!x) continue;

            const xIncome = incomeRates[x];
            if(!xIncome) continue;

            if(sessionTime % x !== 0) continue;
            if(Object.keys(income).length === 0){
                income = { ...xIncome };
            } else {
                income = { ...addResourceRewards(income, xIncome) };
            }
        }
        
        if(!Object.keys(income).length) return;
        updateResourcesMutation.mutate({ id: saveFile.id, income, inGameTime });
    }, [sessionTime])

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



    //______________________________________________________________________________________
    // ===== Component Return =====
    return <></>
}
