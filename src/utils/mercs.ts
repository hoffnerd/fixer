
// Types ----------------------------------------------------------------------------
import type { Contract, Contracts, ContractTypes, Merc, MercRoleLevels, Mercs, Resources } from "@/types";
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
    CONTRACT_TYPE_KEYS,
    CONTRACT_TYPES,
    SCALING_CONTRACT_LEVEL,
    SCALING_CONTRACT_LEVEL_CORE,
    SCALING_CONTRACT_LEVEL_ADDITIONAL,
    SCALING_CONTRACT_XP_REWARD, 
} from "@/data/_config";
// Other ----------------------------------------------------------------------------
import { generateMercName } from "./nameGeneration";
import { getRandomItemFromArray, getRandomNumber, getRange, levelToXp } from ".";
import { getComps, getContractTime, getEuros, handleMassScaling, handleScaling, type HandleScalingOptions } from "./scaling";



//______________________________________________________________________________________    
// ===== True Constants =====




//______________________________________________________________________________________    
// ===== Merc Assists =====

export const canHireMerc = ({ resources, merc, }: Readonly<{ resources?: Resources; merc: Merc; }>) => {
    const playerResources = { ...DEFAULT_RESOURCES,  ...resources };
    const initialCost = { ...DEFAULT_RESOURCES,  ...merc.initialCost };
    return Object.entries(playerResources).every(([key, value]) => value >= initialCost[key as keyof Resources]);
}



//______________________________________________________________________________________    
// ===== Contract Assists =====

export const canSignContract = ({ resources, contract, }: Readonly<{ resources?: Resources; contract: Contract; }>) => {
    return true;
}



//______________________________________________________________________________________    
// ===== Shared Generation =====

/**
 * Generates role levels for a merc based on their level and innate role.
 * @param levelEntity - int, represents the level of the merc for which you are generating roles.
 */
const generateRoles = (levelEntity=0) => {
    const HIGHEST_CHANCE = 100;
    const chanceToMeet = Math.min((levelEntity ?? 1), (HIGHEST_CHANCE / 2));
    const innateRole = getRandomItemFromArray<keyof MercRoleLevels>(MERC_ROLE_KEYS)!;
    let roleLevels: MercRoleLevels = { ...DEFAULT_MERC_ROLE_LEVELS };

    // Generate the merc's default role levels
    const nonInnateRoles = [...MERC_ROLE_KEYS].filter(x => x !== innateRole);
    const innateSubRolesPossible = getRandomNumber(1, HIGHEST_CHANCE) <= chanceToMeet ? [ innateRole ] : nonInnateRoles; 
    const innateSubRole = getRandomItemFromArray<keyof MercRoleLevels>(innateSubRolesPossible) ?? innateRole;
    roleLevels[innateSubRole] += SCALING_MERC_INNATE_SUB_SKILL_POINTS;
    roleLevels[innateRole] += SCALING_MERC_INNATE_SKILL_POINTS;
    
    // Return early if the level is too low
    if(levelEntity < 1) return { innateRole, innateSubRole, roleLevels }
    
    // Generate the merc's role levels based on their overall level, innateRole and innateSubRole
    let rolesPossible = [ ...MERC_ROLE_KEYS, innateRole, innateRole, innateSubRole ];
    // if(innateSubRole !== innateRole) rolesPossible = [ ...rolesPossible, innateSubRole ];
    for (let i = 0; i < levelEntity; i++) {
        const role = getRandomItemFromArray<keyof MercRoleLevels>(rolesPossible) ?? innateRole;
        roleLevels[role] += 1;
    }

    return { innateRole, innateSubRole, roleLevels };
}

/**
 * Calculates a new level for a merc based on the player level and certain scaling factors.
 * @param level - int, represents the current level of the player.
 */
const generateEntityLevel = (level:number, scaleCore:{ min: number; max: number; }, scaleAdditional:{ min: number; max: number; }) => {
    let levelDifferenceRange = [ 0, ...getRange(scaleCore) ];
    if(level >= 5) levelDifferenceRange = [ ...levelDifferenceRange, ...getRange(scaleAdditional) ];
    const levelDifference = getRandomItemFromArray(levelDifferenceRange) ?? 0;
    return Math.max(0, (level + levelDifference));
}

const generateResources = ({
    level,
    xpEntity,
    innateRole,
    innateSubRole,
    options={},
}: Readonly<{
    level: number;
    xpEntity: number;
    innateRole: keyof MercRoleLevels;
    innateSubRole: keyof MercRoleLevels;
    options?: HandleScalingOptions;
}>): Resources => {
    const scaling = handleMassScaling<"euros" | "compsA" | "compsB" | "compsC">({
        euros: { callback: getEuros, options: {} },
        compsA: { callback: getComps, options: {} },
        compsB: { callback: getComps, options: {} },
        compsC: { callback: getComps, options: {} },
    }, { ...options, xpPlayer: levelToXp(level, SCALING_CORE_MAGIC_NUMBER_PLAYER), xpEntity });
    const values = [ scaling.compsA.value, scaling.compsB.value, scaling.compsC.value ].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);

    let innateRoleScaleValue = values[2];
    let innateSubRoleScaleValue = values[1];
    let innateSubRoleUsed = innateSubRole;

    if(innateRole === innateSubRole){
        innateRoleScaleValue = (values[2] ?? 0) + (values[1] ?? 0);
        innateSubRoleScaleValue = values[0] ?? 0;
        innateSubRoleUsed = getRandomItemFromArray([...MERC_ROLE_KEYS].filter(x => x !== innateRole))!;
    }

    return {
        euros: scaling.euros.value,
        [ROLE_TO_RESOURCE_MAP[innateRole]]: innateRoleScaleValue,
        [ROLE_TO_RESOURCE_MAP[innateSubRoleUsed]]: innateSubRoleScaleValue,
    }
}


//______________________________________________________________________________________    
// ===== Merc Generation =====

/**
 * Generates a random merc with specified level and options.
 * @param level - int, specifies the level of player OR the merc being generated, if `options.shouldUseLevelAsLevelEntity` is set to `true`.
 * @param options
 * @param options.shouldUseLevelAsLevelEntity - boolean, default is `false`. If set to `true`, the 
 * level parameter will be used as the level of the merc entity instead of the player level.
 */
const generateRandomMerc = (level=0, options:Readonly<{ shouldUseLevelAsLevelEntity?: boolean; }>={}): Merc => {
    const { shouldUseLevelAsLevelEntity } = { shouldUseLevelAsLevelEntity: false, ...options };
    const levelEntity = shouldUseLevelAsLevelEntity ? level : generateEntityLevel(level, SCALING_MERC_LEVEL_DIFFERENCE_CORE, SCALING_MERC_LEVEL_DIFFERENCE_ADDITIONAL);
    const xpEntity = levelEntity ? levelToXp(levelEntity, SCALING_CORE_MAGIC_NUMBER) : 0;
    const { innateRole, innateSubRole, roleLevels } = generateRoles(levelEntity)
    return {
        ...generateMercName(),
        innateRole,
        innateSubRole,
        roleLevels,
        xp: xpEntity,
        initialCost: generateResources({ level, xpEntity, innateRole, innateSubRole }),
    };
}

/**
 * Returns a random Merc object that is not already in the provided `mercs` object.
 * @param mercs - object, represents a collection of mercs from the save file
 * @param level - int, specifies the level of player
 */
export const getRandomMerc = (mercs:Mercs={}, level=0): Merc => {
    const randomMerc = generateRandomMerc(level);
    if(!mercs) return randomMerc;
    if(Object.keys(mercs).includes(randomMerc.key)) return getRandomMerc(mercs, level);
    return randomMerc;
}

/**
 * Generates a specified number of random mercs around a given level, with an option to return them combined with existing mercs.
 * @param mercs - object, represents a collection of mercs from the save file
 * @param level - int, specifies the level of player
 * @param amount - int, specifies the number of random mercs that should be generated and returned
 * @param options
 * @param options.shouldReturnMercsCombined - boolean, default is `false`. If set to `true`, the 
 * function will return the generated mercs combined with the existing mercs in the `mercs` object.
 */
export const getRandomMercs = (mercs:Mercs={}, level=0, amount=1, options:Readonly<{ shouldReturnMercsCombined?: boolean; }>={}) => {
    const { shouldReturnMercsCombined } = { shouldReturnMercsCombined: false, ...options };
    let newMercs: Mercs = {};
    for (let i = 0; i < amount; i++) {
        const randomMerc = getRandomMerc({ ...mercs, ...newMercs }, level);
        newMercs[randomMerc.key] = randomMerc;
    }
    if(shouldReturnMercsCombined) return { ...mercs, ...newMercs };
    return newMercs;
}



//______________________________________________________________________________________    
// ===== Contract Generation =====

/**
 * Generates a random contract with specified level and options.
 * @param level - int, specifies the level of player OR the contract being generated, if `options.shouldUseLevelAsLevelEntity` is set to `true`.
 * @param index - int, specifies the index of the contract being generated.
 * @param options
 * @param options.shouldUseLevelAsLevelEntity - boolean, default is `false`. If set to `true`, the 
 * level parameter will be used as the level of the contract entity instead of the player level.
 */
const generateRandomContract = (level=0, index=0, options:Readonly<{ shouldUseLevelAsLevelEntity?: boolean; }>={}): Contract => {
    const { shouldUseLevelAsLevelEntity } = { shouldUseLevelAsLevelEntity: false, ...options };
    const levelEntity = shouldUseLevelAsLevelEntity ? level : generateEntityLevel(level, SCALING_CONTRACT_LEVEL_CORE, SCALING_CONTRACT_LEVEL_ADDITIONAL);
    const xpEntity = levelEntity ? levelToXp(levelEntity, SCALING_CORE_MAGIC_NUMBER) : 0;
    const xpPlayer = levelToXp(level, SCALING_CORE_MAGIC_NUMBER_PLAYER);

    const levelScale = generateEntityLevel(SCALING_CONTRACT_LEVEL, SCALING_CONTRACT_LEVEL_CORE, SCALING_CONTRACT_LEVEL_ADDITIONAL);
    const { innateRole, innateSubRole, roleLevels } = generateRoles(levelEntity + levelScale)

    const createdAt = new Date();
    const type = getRandomItemFromArray<keyof ContractTypes>(CONTRACT_TYPE_KEYS)!;
    const contractType = CONTRACT_TYPES[type];
    const timeScale = handleScaling(getContractTime, { xpPlayer, xpEntity });

    return {
        key:`${createdAt.getTime()}_${index}`,
        createdAt,
        generationIndex: index,
        type,
        innateRole,
        innateSubRole,
        roleLevels,
        stage: "unsigned",
        client: "defaultClient",
        xp: xpEntity,
        visualLevel: levelEntity + levelScale,
        display: `${contractType.display} - ${contractType.roles[innateRole].display}`,
        rewards: {
            ...generateResources({ level, xpEntity, innateRole, innateSubRole, options:{ exponent: 2} }),
            xp: SCALING_CONTRACT_XP_REWARD,
        },
        time: timeScale.value,
        mercSlots: {
            main: null,
        }
    }
}

/**
 * Returns a random Contract object
 * @param level - int, specifies the level of player
 * @param index - int, specifies the index of the contract being generated.
 */
export const getRandomContract = (level=0, index=0) => generateRandomContract(level, index);

/**
 * Generates a specified number of random contracts around a given level.
 * @param level - int, specifies the level of player
 * @param amount - int, specifies the number of random contracts that should be generated and returned
 */
export const getRandomContracts = (level=0, amount=1) => {
    let contracts: Contracts = {};
    for (let i = 0; i < amount; i++) {
        const randomContract = getRandomContract(level, i);
        contracts[randomContract.key] = randomContract;
    }
    return contracts;
}