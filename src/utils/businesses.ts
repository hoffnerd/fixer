
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