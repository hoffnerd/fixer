
// Types ----------------------------------------------------------------------------
import type { Merc, Business, MercRoleLevels, GameStoreFunctions, SaveFile, BusinessMercSlots } from "@/types";
// Data -----------------------------------------------------------------------------
import { CONTRACT_WEIGHT_ROLE_FACTOR, CONTRACT_WEIGHT_UNFORESEEN, DEFAULT_MERC_ROLE_LEVELS, SCALING_CONTRACT_LEVEL, SCALING_CORE_MAGIC_NUMBER_PLAYER } from "@/data/_config";
// Other ----------------------------------------------------------------------------
import { getRandomItemFromArray, getRandomNumber, getRange, getRangeDisplay, xpToLevel } from ".";
import { getJobShare, handleScaling, type HandleScalingOptions } from "./scaling";


//______________________________________________________________________________________    
// ===== True Constants =====

const EMPTY_RANGE_WRAPPED = { range: [] };



//______________________________________________________________________________________    
// ===== Functions =====


export const getBusinessDisplay = (business?: Business | null) => business?.roleDisplay ? `${business.display} - ${business.roleDisplay}` : business?.display;

export const getBusinessMercs = ({ saveFile, business }:Readonly<{saveFile?: SaveFile, business?: Business}>) => {
    const mercKeyManager = business?.mercSlots?.manager?.key;
    const mercKeySecurity = business?.mercSlots?.security?.key;
    const mercKeyIllicitActivity = business?.mercSlots?.illicitActivity?.key;
    const mercs = {
        manager: mercKeyManager && saveFile?.mercs?.[mercKeyManager]?.key ? saveFile.mercs[mercKeyManager] : null,
        security: mercKeySecurity && saveFile?.mercs?.[mercKeySecurity]?.key ? saveFile.mercs[mercKeySecurity] : null,
        illicitActivity: mercKeyIllicitActivity && saveFile?.mercs?.[mercKeyIllicitActivity]?.key ? saveFile.mercs[mercKeyIllicitActivity] : null,
    }

    let count = 0;
    Object.entries(mercs).forEach(([k, v]) => {
        const merc = v as Merc;
        if(!merc?.key) return;
        count++;
    });
    
    return { ...mercs, count };
}

export const businessUnassignClick = ({ 
    pushToSaveQueue,
    business,
    merc,
    mercKey,
}: Readonly<{
    pushToSaveQueue: GameStoreFunctions["pushToSaveQueue"];
    business?: Business;
    merc?: Merc | null;
    mercKey?: string;
}>) => {
    if(!business?.key) return;
    pushToSaveQueue({ 
        mutationKey: "assignMercMutation",
        props: { 
            assignType: "business", 
            mercKey: merc?.key ?? mercKey ?? "", 
            businessKey: business.key,
            slot: "unassign",
        }
    })
}

export const getHighestRoleLevel = (roleLevels: MercRoleLevels, scalingLevel=SCALING_CONTRACT_LEVEL) => {
    let highestRoleLevel = 0;
    Object.keys(roleLevels).forEach(key => {
        const level = roleLevels[key as keyof typeof roleLevels];
        if(level > highestRoleLevel) highestRoleLevel = level;
    });
    highestRoleLevel -= scalingLevel;
    if(highestRoleLevel < 0) return 0;
    return highestRoleLevel;
}

const findBusinessRoles = ({
    roleLevels,
    innateRole,
    innateSubRole,
}: Readonly<{
    roleLevels: MercRoleLevels;
    innateRole: keyof MercRoleLevels;
    innateSubRole: keyof MercRoleLevels;
}>) => {
    let businessNonInnateRoles = Object.keys(roleLevels)
        .filter(x => x !== innateRole && x !== innateSubRole) as Array<keyof MercRoleLevels>;

    let businessInnateSubRole = innateSubRole;
    if(innateRole === innateSubRole){
        businessInnateSubRole = getRandomItemFromArray<keyof MercRoleLevels>(businessNonInnateRoles)!;
        businessNonInnateRoles.splice(businessNonInnateRoles.indexOf(businessInnateSubRole), 1);
    }

    return { 
        businessInnateSubRole, 
        businessNonInnateRole: getRandomItemFromArray<keyof MercRoleLevels>(businessNonInnateRoles)!
    };
}

const getMergedMerc = (assignedMercs: { manager?: Merc | null; security?: Merc | null; illicitActivity?: Merc | null; }): Merc => {
    let possibleSlotKeys: Array<keyof BusinessMercSlots> = [];
    let roleLevels: MercRoleLevels = { ...DEFAULT_MERC_ROLE_LEVELS };
    Object.entries(assignedMercs).forEach(([k, v]) => {
        const slotKey = k as keyof BusinessMercSlots;
        const merc = v as Merc | null;
        if(!merc?.key) return;
        possibleSlotKeys.push(slotKey);
        Object.entries(merc.roleLevels).forEach(([k, v]) => {
            const role = k as keyof MercRoleLevels;
            roleLevels[role] += v;
        });
    })
    const selectedSlotKey = getRandomItemFromArray<keyof BusinessMercSlots>(possibleSlotKeys)!;
    const selectedMerc: Merc = assignedMercs[selectedSlotKey]!;
    return { ...selectedMerc, roleLevels };
}



//______________________________________________________________________________________    
// ===== Calculations =====

const calculateRoleFactor = (businessRoleLevel: number, mercRoleLevel: number) => {
    if(businessRoleLevel === 0) return 100;
    const roleFactor = Math.floor((mercRoleLevel / businessRoleLevel) * 100);
    return roleFactor > 100 ? 100 : roleFactor;
}

const calculateTotalRoleFactor = (business: Business, merc: Merc) => {
    const { businessInnateSubRole, businessNonInnateRole } = findBusinessRoles(business);
    const innateRoleFactor = calculateRoleFactor(business.roleLevels[business.innateRole], merc.roleLevels[business.innateRole]);
    const innateSubRoleFactor = calculateRoleFactor(business.roleLevels[businessInnateSubRole], merc.roleLevels[businessInnateSubRole]);
    const nonInnateRoleFactor = calculateRoleFactor(business.roleLevels[businessNonInnateRole], merc.roleLevels[businessNonInnateRole]);
    return Math.floor((innateRoleFactor * 0.50) + (innateSubRoleFactor * 0.33) + (nonInnateRoleFactor * 0.17));
}

const calculateIntelBonus = (business: Business) => {
    return 0;
}

const calculateUnforeseenEvent = (business: Business, intelBonus: number = 0) => {
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

export const calculateBusinessSuccessChance = ({
    business,
    assignedMercs,
}:Readonly<{
    business: Business,
    assignedMercs: { manager?: Merc | null; security?: Merc | null; illicitActivity?: Merc | null; count: number; }
}>) => {
    const mergedMerc = getMergedMerc(assignedMercs);
    const totalRoleFactor = calculateTotalRoleFactor(business, mergedMerc);
    const intelBonus = calculateIntelBonus(business);
    const unforeseenEvent = calculateUnforeseenEvent(business, intelBonus);
    let successChance = Math.floor(
        (totalRoleFactor * CONTRACT_WEIGHT_ROLE_FACTOR) + (unforeseenEvent.number * CONTRACT_WEIGHT_UNFORESEEN)
    ) + unforeseenEvent.criticalBonus;
    // console.log({ trace:"calculateSuccessChance", totalRoleFactor, intelBonus, successChance });
    if(successChance > 100) successChance = 100;
    return { successChance, unforeseenEvent };
}

export const calculateBusinessTotalJobShare = ({ 
    saveFile, 
    business,
    assignedMercs,
}:Readonly<{
    saveFile?: SaveFile, 
    business?: Business,
    assignedMercs?: { manager?: Merc | null; security?: Merc | null; illicitActivity?: Merc | null; count: number; }
}>) => {
    const defaultJobShareProps: HandleScalingOptions = { 
        xpPlayer: (saveFile?.resources?.xp ?? 0), 
        entityType: "business" 
    }
    const mercs = assignedMercs ?? getBusinessMercs({ saveFile, business });
    const { range: managerRange } = mercs.manager ? handleScaling(getJobShare, { ...defaultJobShareProps, xpEntity: mercs.manager?.xp ?? 0 }) : EMPTY_RANGE_WRAPPED
    const { range: securityRange } = mercs.security ? handleScaling(getJobShare, { ...defaultJobShareProps, xpEntity: mercs.security?.xp ?? 0 }) : EMPTY_RANGE_WRAPPED;
    const { range: illicitActivityRange } = mercs.illicitActivity ? handleScaling(getJobShare, { ...defaultJobShareProps, xpEntity: mercs.illicitActivity?.xp ?? 0 }) : EMPTY_RANGE_WRAPPED;

    const managerMin = managerRange && managerRange.length > 0 ? managerRange[0] ?? 0 : 0;
    const managerMax = managerRange && managerRange.length > 1 ? managerRange[ managerRange.length-1 ] ?? managerMin : managerMin;
    const securityMin = securityRange && securityRange.length > 0 ? securityRange[0] ?? 0 : 0;
    const securityMax = securityRange && securityRange.length > 1 ? securityRange[ securityRange.length-1 ] ?? securityMin : securityMin;
    const illicitActivityMin = illicitActivityRange && illicitActivityRange.length > 0 ? illicitActivityRange[0] ?? 0 : 0;
    const illicitActivityMax = illicitActivityRange && illicitActivityRange.length > 1 ? illicitActivityRange[ illicitActivityRange.length-1 ] ?? illicitActivityMin : illicitActivityMin;

    const step = 1;
    const min = managerMin + securityMin + illicitActivityMin;
    const max = managerMax + securityMax + illicitActivityMax;
    const range = getRange({ min, max, step });
    return { step, min, max, range, value: getRandomItemFromArray(range)! };
}



//______________________________________________________________________________________    
// ===== Gets Based on Calculations =====

export const getBusinessTotalJobShareDisplay = ({ 
    saveFile, 
    business,
    assignedMercs,
}:Readonly<{
    saveFile?: SaveFile, 
    business?: Business,
    assignedMercs?: { manager?: Merc | null; security?: Merc | null; illicitActivity?: Merc | null; count: number; }
}>) => {
    const mercs = assignedMercs ?? getBusinessMercs({ saveFile, business });
    if(mercs.count === 0) return "Unknown";

    const { range } = calculateBusinessTotalJobShare({ saveFile, business, assignedMercs });
    return getRangeDisplay(range);
}

export const getBusinessJobShareDisplay = (xpPlayer: number, merc: Merc) => {
    const { range } = handleScaling(getJobShare, { xpPlayer, xpEntity: merc.xp, entityType: "business" });
    return getRangeDisplay(range);
}

const getBusinessMinMaxSuccessChance = ({ business, merc }: Readonly<{ business: Business; merc: Merc; }>) => {
    const totalRoleFactor = calculateTotalRoleFactor(business, merc);
    const intelBonus = calculateIntelBonus(business);

    const unforeseenEventChanceDisplay = CONTRACT_WEIGHT_UNFORESEEN * 100;
    let max = unforeseenEventChanceDisplay + totalRoleFactor;
    if(max > 100) max = 100;

    let min = totalRoleFactor + intelBonus;
    if(min > 100) min = 100;

    return { min, max };
}

export const getBusinessSuccessChanceDisplay = (business: Business, merc: Merc) => {
    const { min, max } = getBusinessMinMaxSuccessChance({ business, merc });
    if(max === min) return `${min}%`;
    return `${min}%-${max}%`;
}

export const getBusinessAvgSuccessChanceDisplay = ({ 
    saveFile, 
    business,
    assignedMercs,
}:Readonly<{
    saveFile?: SaveFile, 
    business: Business,
    assignedMercs?: { manager?: Merc | null; security?: Merc | null; illicitActivity?: Merc | null; count: number; }
}>) => {
    const mercs = assignedMercs ?? getBusinessMercs({ saveFile, business });
    if(mercs.count === 0) return "Unknown";
    
    const managerMinMax = mercs.manager ? getBusinessMinMaxSuccessChance({ business, merc: mercs.manager }) : { min: 0, max: 0 };
    const securityMinMax = mercs.security ? getBusinessMinMaxSuccessChance({ business, merc: mercs.security }) : { min: 0, max: 0 };
    const illicitActivityMinMax = mercs.illicitActivity ? getBusinessMinMaxSuccessChance({ business, merc: mercs.illicitActivity }) : { min: 0, max: 0 };

    const min = Math.floor((managerMinMax.min + securityMinMax.min + illicitActivityMinMax.min) / mercs.count);
    const max = Math.floor((managerMinMax.max + securityMinMax.max + illicitActivityMinMax.max) / mercs.count);
    if(max === min) return `${min}%`;
    return `${min}%-${max}%`;
}

export const getBusinessTotalSuccessChanceDisplay = ({
    business,
    assignedMercs,
}:Readonly<{
    business: Business,
    assignedMercs: { manager?: Merc | null; security?: Merc | null; illicitActivity?: Merc | null; count: number; }
}>) => {
    const mergedMerc = getMergedMerc(assignedMercs);
    const { min, max } = getBusinessMinMaxSuccessChance({ business, merc: mergedMerc });
    if(max === min) return `${min}%`;
    return `${min}%-${max}%`;
}