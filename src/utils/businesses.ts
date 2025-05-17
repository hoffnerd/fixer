
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