"use client"

// Types ----------------------------------------------------------------------------
import { type Businesses, type ResourceRewards, type SaveFile } from "@/types";
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
import { DEFAULT_BUSINESS } from "@/data/_config";
import { FAKE_BUSINESSES } from "@/data/fake";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Interfaces =====

interface IncomeRates {
    [key: number]: ResourceRewards;
}



//______________________________________________________________________________________
// ===== Pure Functions =====

const findIncomeRates = (saveFile?: SaveFile) => {
    if(!saveFile) return {};
    const { businesses } = saveFile;

    let incomeRates: IncomeRates = {}

    Object.keys(businesses).forEach(x => {
        const businessKey = x as keyof Businesses;
        const business = businesses?.[businessKey] || {};
        const { time, income } = { ...DEFAULT_BUSINESS, ...business };
        if(!time) return;
        if(incomeRates?.[time]){
            // Income at this time has already been calculated once so lets add the additional income
            let updatedResources: ResourceRewards = { ...incomeRates[time] };
            Object.keys(income).forEach((y) => {
                const key = y as keyof ResourceRewards;
                if(!income[key]) return;
                updatedResources[key] = (updatedResources[key] || 0) + income[key];
            });
            incomeRates[time] = { ...updatedResources };
        } else {
            // Income at this time has not been calculated yet
            incomeRates[time] = { ...income };
        }
    });
    return incomeRates;
}



//______________________________________________________________________________________
// ===== Component =====

export default function ResourcesWatcher(){

    //______________________________________________________________________________________
    // ===== Stores =====
    const setStoreKeyValuePair = useGameStore((state) => state.setStoreKeyValuePair);

    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile, updateResourcesMutation } = useSaveFile();
    // const incomeRates = findIncomeRates(saveFile);
    const incomeRates = findIncomeRates({ ...saveFile, businesses: FAKE_BUSINESSES } as SaveFile);
    const incomeRatesSeconds = Object.keys(incomeRates)
        .map(x => parseInt(x))
        .sort((a, b) => a - b)
        .reverse();
    const [ seconds ] = useTimer(1000);

    //______________________________________________________________________________________
    // ===== Use Effect =====

    useEffect(() => {
        if(!saveFile?.id) return;
        if(!incomeRatesSeconds.length) return;
        
        let income: ResourceRewards = {}
        for(let i = 0; i < incomeRatesSeconds.length; i++){
            const x = incomeRatesSeconds[i];
            if(!x) continue;

            const xIncome = incomeRates[x];
            if(!xIncome) continue;

            if(seconds % x !== 0) continue;
            if(Object.keys(income).length === 0){
                income = { ...xIncome };
            } else {
                let updatedResources: ResourceRewards = { ...income };
                Object.keys(xIncome).forEach((y) => {
                    const key = y as keyof ResourceRewards;
                    if(!xIncome[key]) return;
                    updatedResources[key] = (updatedResources[key] || 0) + xIncome[key];
                });
                income = { ...updatedResources };
            }
        }
        
        if(!Object.keys(income).length) return;
        // updateResourcesMutation.mutate({ id: saveFile.id, income });
        console.log({ trace: "ResourcesWatcher", seconds, income });
    }, [saveFile, incomeRates, incomeRatesSeconds, seconds])

    //______________________________________________________________________________________
    // ===== Component Return =====
    return <></>
}
