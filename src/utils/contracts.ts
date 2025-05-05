
// Types ----------------------------------------------------------------------------
import type { Merc, Contract, MercRoleLevels } from "@/types";
// Data -----------------------------------------------------------------------------
import { CONTRACT_WEIGHT_ROLE_FACTOR, CONTRACT_WEIGHT_UNFORESEEN, SCALING_CONTRACT_LEVEL } from "@/data/_config";
// Other ----------------------------------------------------------------------------
import { getRandomItemFromArray, getRandomNumber } from ".";
import { getJobShare, handleScaling } from "./scaling";


//______________________________________________________________________________________    
// ===== True Constants =====


//______________________________________________________________________________________    
// ===== Functions =====

export const getHighestRoleLevel = (contract: Contract) => {
    const { roleLevels } = contract;
    let highestRoleLevel = 0;
    Object.keys(roleLevels).forEach(key => {
        const level = roleLevels[key as keyof typeof roleLevels];
        if(level > highestRoleLevel) highestRoleLevel = level;
    });
    highestRoleLevel -= SCALING_CONTRACT_LEVEL;
    if(highestRoleLevel < 0) return 0;
    return highestRoleLevel;
}

const findContractRoles = ({
    roleLevels,
    innateRole,
    innateSubRole,
}: Readonly<{
    roleLevels: MercRoleLevels;
    innateRole: keyof MercRoleLevels;
    innateSubRole: keyof MercRoleLevels;
}>) => {
    let contractNonInnateRoles = Object.keys(roleLevels)
        .filter(x => x !== innateRole && x !== innateSubRole) as Array<keyof MercRoleLevels>;

    let contractInnateSubRole = innateSubRole;
    if(innateRole === innateSubRole){
        contractInnateSubRole = getRandomItemFromArray<keyof MercRoleLevels>(contractNonInnateRoles)!;
        contractNonInnateRoles.splice(contractNonInnateRoles.indexOf(contractInnateSubRole), 1);
    }

    return { 
        contractInnateSubRole, 
        contractNonInnateRole: getRandomItemFromArray<keyof MercRoleLevels>(contractNonInnateRoles)!
    };
}



//______________________________________________________________________________________    
// ===== Calculations =====

const calculateRoleFactor = (contractRoleLevel: number, mercRoleLevel: number) => {
    if(contractRoleLevel === 0) return 100;
    const roleFactor = Math.floor((mercRoleLevel / contractRoleLevel) * 100);
    return roleFactor > 100 ? 100 : roleFactor;
}

const calculateTotalRoleFactor = (contract: Contract, merc: Merc) => {
    const { contractInnateSubRole, contractNonInnateRole } = findContractRoles(contract);
    const innateRoleFactor = calculateRoleFactor(contract.roleLevels[contract.innateRole], merc.roleLevels[contract.innateRole]);
    const innateSubRoleFactor = calculateRoleFactor(contract.roleLevels[contractInnateSubRole], merc.roleLevels[contractInnateSubRole]);
    const nonInnateRoleFactor = calculateRoleFactor(contract.roleLevels[contractNonInnateRole], merc.roleLevels[contractNonInnateRole]);
    return Math.floor((innateRoleFactor * 0.50) + (innateSubRoleFactor * 0.33) + (nonInnateRoleFactor * 0.17));
}

const calculateIntelBonus = (contract: Contract) => {
    return 0;
}

const calculateUnforeseenEvent = (contract: Contract, intelBonus: number = 0) => {
    let unforeseenEventNumber = getRandomNumber(0, 100) + intelBonus;
    if(unforeseenEventNumber > 100) unforeseenEventNumber = 100;

    let unforeseenEvent = { criticalBonus: 0, value: "", hasEvent: false, event: null };
    if(unforeseenEventNumber >= 96){
        // Critical Success of Unforeseen Event
        unforeseenEvent.criticalBonus = 5;
        unforeseenEvent.value = "criticalSuccess";
        // console.log({ trace:"calculateUnforeseenEvent > Critical Success", ...unforeseenEvent, unforeseenEventNumber });
    }
    else if(unforeseenEventNumber >= 51){
        // Success of Unforeseen Event
        unforeseenEvent.value = "success";
        // console.log({ trace:"calculateUnforeseenEvent > Success", ...unforeseenEvent, unforeseenEventNumber });
    }
    else if(unforeseenEventNumber >= 5){
        // Failure of Unforeseen Event
        unforeseenEvent.value = "failure";
        // console.log({ trace:"calculateUnforeseenEvent > Failure", ...unforeseenEvent, unforeseenEventNumber });
    }
    else{
        // Critical Failure of Unforeseen Event
        unforeseenEvent.criticalBonus = -5;
        unforeseenEvent.value = "criticalFailure";
        // console.log({ trace:"calculateUnforeseenEvent > Critical Failure", ...unforeseenEvent, unforeseenEventNumber });
    }
    return { ...unforeseenEvent, number: unforeseenEventNumber };
}

export const calculateSuccessChance = (contract: Contract, merc: Merc) => {
    const totalRoleFactor = calculateTotalRoleFactor(contract, merc);
    const intelBonus = calculateIntelBonus(contract);
    const unforeseenEvent = calculateUnforeseenEvent(contract, intelBonus);
    let successChance = Math.floor(
        (totalRoleFactor * CONTRACT_WEIGHT_ROLE_FACTOR) + (unforeseenEvent.number * CONTRACT_WEIGHT_UNFORESEEN)
    ) + unforeseenEvent.criticalBonus;
    // console.log({ trace:"calculateSuccessChance", totalRoleFactor, intelBonus, successChance });
    if(successChance > 100) successChance = 100;
    return { successChance, unforeseenEvent };
}

export const getContractJobShareDisplay = (xpPlayer: number, merc: Merc) => {
    const { range } = handleScaling(getJobShare, { xpPlayer, xpEntity: merc.xp });
    if(!range) return "Unknown";
    if(range.length === 0) return "Unknown";
    if(range.length === 1) return `${range[0]}%`;
    return `${range[0]}%-${range[range.length-1]}%`;
}

export const getContractSuccessChanceDisplay = (contract: Contract, merc: Merc) => {
    const totalRoleFactor = calculateTotalRoleFactor(contract, merc);
    const intelBonus = calculateIntelBonus(contract);

    const unforeseenEventChanceDisplay = CONTRACT_WEIGHT_UNFORESEEN * 100;
    let maxChance = unforeseenEventChanceDisplay + totalRoleFactor;
    if(maxChance > 100) maxChance = 100;

    let displayChance = totalRoleFactor + intelBonus;
    if(displayChance > 100) displayChance = 100;

    if(maxChance === displayChance) return `${displayChance}%`;
    return `${displayChance}%-${maxChance}%`;
}