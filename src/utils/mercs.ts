
// Types ----------------------------------------------------------------------------
import type { Merc, MercRoleLevels, Mercs } from "@/types";
// Data -----------------------------------------------------------------------------
import { 
    SCALING_CORE_MAGIC_NUMBER, 
    SCALING_MERC_INNATE_SKILL_POINTS, 
    SCALING_MERC_INNATE_SUB_SKILL_POINTS, 
    SCALING_MERC_LEVEL_DIFFERENCE_CORE,
    SCALING_MERC_LEVEL_DIFFERENCE_ADDITIONAL,
    DEFAULT_MERC_ROLE_LEVELS, 
    MERC_ROLE_KEYS, 
} from "@/data/_config";
// Other ----------------------------------------------------------------------------
import { generateMercName } from "./nameGeneration";
import { getRandomItemFromArray, getRandomNumber, getRange, levelToXp } from ".";



//______________________________________________________________________________________    
// ===== Merc Generation =====

/**
 * Generates role levels for a merc based on their level and innate role.
 * @param levelEntity - int, represents the level of the merc for which you are generating roles.
 */
const generateMercRoles = (levelEntity=0) => {
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
const generateMercLevel = (level:number) => {
    let levelDifferenceRange = [ ...getRange(SCALING_MERC_LEVEL_DIFFERENCE_CORE) ];
    if(level >= 5) levelDifferenceRange = [ ...levelDifferenceRange, ...getRange(SCALING_MERC_LEVEL_DIFFERENCE_ADDITIONAL) ];
    const levelDifference = getRandomItemFromArray(levelDifferenceRange) ?? 0;
    return Math.max(0, (level + levelDifference));
}

/**
 * Generates a random merc with specified level and options.
 * @param level - int, specifies the level of player OR the merc being generated, if `options.shouldUseLevelAsLevelEntity` is set to `true`.
 * @param options
 * @param options.shouldUseLevelAsLevelEntity - boolean, default is `false`. If set to `true`, the 
 * level parameter will be used as the level of the merc entity instead of the player level.
 */
const generateRandomMerc = (level=0, options:Readonly<{ shouldUseLevelAsLevelEntity?: boolean; }>={}) => {
    const { shouldUseLevelAsLevelEntity } = { shouldUseLevelAsLevelEntity: false, ...options };
    const levelEntity = shouldUseLevelAsLevelEntity ? level : generateMercLevel(level);
    return {
        ...generateMercName(),
        ...generateMercRoles(levelEntity),
        xp: levelEntity ? levelToXp(levelEntity, SCALING_CORE_MAGIC_NUMBER) : 0,
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