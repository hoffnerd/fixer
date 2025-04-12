
// Types ----------------------------------------------------------------------------
import type { Contract, ContractTypes, Resources } from "@/types";
// Data -----------------------------------------------------------------------------
import { 
    SCALING_CORE_MAGIC_NUMBER, 
    SCALING_MERC_INNATE_SKILL_POINTS, 
    SCALING_MERC_INNATE_SUB_SKILL_POINTS, 
    SCALING_MERC_LEVEL_DIFFERENCE_CORE,
    SCALING_MERC_LEVEL_DIFFERENCE_ADDITIONAL,
    DEFAULT_MERC_ROLE_LEVELS, 
    MERC_ROLE_KEYS,
    SCALING_CORE_MAGIC_NUMBER_PLAYER,
    ROLE_TO_RESOURCE_MAP,
    DEFAULT_RESOURCES,
    CONTRACT_TYPES,
    CONTRACT_TYPE_KEYS, 
} from "@/data/_config";
// Other ----------------------------------------------------------------------------
import { getRandomItemFromArray, getRandomNumber, getRange, levelToXp } from ".";
import { getComps, getEuros, handleMassScaling } from "./scaling";
import { object } from "zod";
import { generateMercRoles } from "./mercs";



//______________________________________________________________________________________    
// ===== True Constants =====


//______________________________________________________________________________________    
// ===== Contract Assists =====

export const canSignContract = ({ resources, contract, }: Readonly<{ resources?: Resources; contract: Contract; }>) => {
    return true;
}



//______________________________________________________________________________________    
// ===== Contract Generation =====

const generateRandomContract = (level=0, index=0, options:Readonly<{ shouldUseLevelAsLevelEntity?: boolean; }>={}): Contract => {
    const { shouldUseLevelAsLevelEntity } = { shouldUseLevelAsLevelEntity: false, ...options };
    const levelEntity = shouldUseLevelAsLevelEntity ? level : generateMercLevel(level);
    const xpEntity = levelEntity ? levelToXp(levelEntity, SCALING_CORE_MAGIC_NUMBER) : 0;
    const createdAt = new Date();
    const type = getRandomItemFromArray<keyof ContractTypes>(CONTRACT_TYPE_KEYS)!;
    const {} = generateMercRoles(level);
    return {
        key:`${createdAt.toISOString()}_${index}`,
        createdAt,
        generationIndex: index,
        type,
    }
}