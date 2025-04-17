
// Types ----------------------------------------------------------------------------
import type { Merc, Contract, MercRoleLevels } from "@/types";
// Data -----------------------------------------------------------------------------
import { CONTRACT_WEIGHT_UNFORESEEN, SCALING_CONTRACT_LEVEL } from "@/data/_config";
// Other ----------------------------------------------------------------------------
import { getRandomItemFromArray } from ".";


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
