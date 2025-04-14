"use server"

// Types ----------------------------------------------------------------------------
import { type Contracts, type MercAssignType, type MercSlot, type PotentialContracts, type PotentialMercs, type ResourceRewards, type SaveFile, type SaveFileOptional } from "@/types";
// Server ---------------------------------------------------------------------------
import { db } from "./db";
import { serverAction } from "@/_legoBlocks/nextjsCommon/server/actions";
// Data -----------------------------------------------------------------------------
import { DEFAULT_SAVE_FILE, SCALING_CORE_MAGIC_NUMBER_PLAYER, SCALING_REGENERATED_TIME } from "@/data/_config";
import { addResourceRewards, xpToLevel } from "@/utils";
import { canHireMerc, getRandomContracts, getRandomMercs } from "@/utils/mercs";
// Other ----------------------------------------------------------------------------
// import { getRandomMerc } from "@/utils";



//______________________________________________________________________________________
// ===== Reads =====

const rawReadSaveFile = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const saveFile: SaveFile = await db.saveFile.findUnique({ where: { id } }) as any;
    if(!saveFile?.id) throw new Error("Error reading save file");
    return saveFile;
}

export const readSaveFile = async (id?: string | null) => serverAction<SaveFile>(async () => {
    if(!id) return await rawCreateSaveFile();
    const saveFile = await rawReadSaveFile(id);
    if(!saveFile?.id) return await rawCreateSaveFile();
    return db.saveFile.update({ where: { id }, data: { updatedAt: new Date() } });
}, { trace: "readSaveFile" });



//______________________________________________________________________________________
// ===== Creates =====

const rawCreateSaveFile = async () => {
    const mercs = getRandomMercs({}, 0, 3);
    const contracts = getRandomContracts(0, 3);
    return await db.saveFile.create({ 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: { 
            ...(DEFAULT_SAVE_FILE as any),
            potentialMercs: {
                ...DEFAULT_SAVE_FILE.potentialMercs,
                mercs,
            },
            potentialContracts: {
                ...DEFAULT_SAVE_FILE.potentialContracts,
                contracts,
            },
        } 
    })
};

// export const createSaveFile = () => serverAction(async () => {
//     return await db.saveFile.create({ data: {} });
// }, { trace: "createSaveFile" });



//______________________________________________________________________________________
// ===== Updates =====

export const updateResources = async ({
    id, 
    income,
    inGameTime
}: Readonly<{
    id: string;
    income: ResourceRewards;
    inGameTime?: number;
}>) => serverAction<SaveFile>(async () => {
    const saveFile = await rawReadSaveFile(id);
    const existingResources = saveFile?.resources || {};
    const updatedResources = addResourceRewards(existingResources, income);
    return await db.saveFile.update({ 
        where: { id }, 
        data: { 
            resources: { ...updatedResources },
            inGameTime: inGameTime ?? saveFile?.inGameTime,
            updatedAt: new Date(),
        }
    });
}, { trace: "updateResources" });



//______________________________________________________________________________________
// ===== Merc Updates =====

export const hireMerc = async ({
    id, 
    mercKey,
    inGameTime,
    timeLeft,
}: Readonly<{ 
    id: string;
    mercKey: string;
    inGameTime?: number; 
    timeLeft?: number;
}>) => serverAction<SaveFile>(async () => {
    const timeLeftToUse = timeLeft ?? SCALING_REGENERATED_TIME;
    const saveFile = await rawReadSaveFile(id);
    if(!saveFile?.potentialMercs) return;

    const selectedMerc = saveFile.potentialMercs.mercs?.[mercKey];
    if(!selectedMerc) return;
    if(!canHireMerc({ resources: saveFile?.resources, merc: selectedMerc })) return;

    let newResources = { ...saveFile.resources };
    Object.entries(selectedMerc.initialCost).forEach(([k, value]) => {
        const key = k as keyof typeof newResources;
        if(newResources[key]) newResources[key] -= value;
    });

    let potentialMercs: PotentialMercs = { ...saveFile.potentialMercs };
    if(potentialMercs.mercs?.[mercKey]) delete potentialMercs.mercs[mercKey];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await db.saveFile.update({ 
        where: { id }, 
        data: {
            resources: newResources,
            mercs: {
                ...saveFile.mercs,
                [mercKey]: selectedMerc
            },
            potentialMercs: {
                ...potentialMercs,
                regeneratedTime: timeLeftToUse,
            },
            inGameTime: inGameTime ?? saveFile?.inGameTime,
            updatedAt: new Date(),
        }
    } as any);
}, { trace: "hireMerc" });

export const regenerateMercs = async ({ 
    id, 
    inGameTime,
    timeLeft 
}: Readonly<{ 
    id: string; 
    inGameTime?: number; 
    timeLeft?: number; 
}>) => serverAction<SaveFile>(async () => {
    const timeLeftToUse = timeLeft ?? SCALING_REGENERATED_TIME;
    const saveFile = await rawReadSaveFile(id);
    const levelPlayer = xpToLevel((saveFile?.xp ?? 0), SCALING_CORE_MAGIC_NUMBER_PLAYER) || 0;
    const mercs = getRandomMercs(saveFile.mercs, levelPlayer, 3);
    return await db.saveFile.update({ 
        where: { id }, 
        data: { 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            potentialMercs: { regeneratedTime: timeLeftToUse, mercs } as any,
            inGameTime: inGameTime ?? saveFile?.inGameTime,
            updatedAt: new Date(),
        }
    });
}, { trace: "regenerateMercs" })

export const assignMerc = async ({
    id,
    assignType,
    mercKey,
    contractKey,
    businessKey,
    slot="main",
    inGameTime,
}: Readonly<{ 
    id: string;
    assignType: MercAssignType;
    mercKey: string;
    contractKey?: string;
    businessKey?: string;
    slot?: MercSlot;
    inGameTime?: number; 
}>) => serverAction<SaveFile>(async () => {
    const saveFile = await rawReadSaveFile(id);
    if(!saveFile?.mercs) throw new Error("No Mercs to available!");

    let selectedMerc = saveFile.mercs?.[mercKey];
    if(!selectedMerc) throw new Error("Merc not found");
    selectedMerc.mercSlot = { type: assignType, slot, contractKey, businessKey };

    let data: SaveFileOptional = {
        inGameTime: inGameTime ?? saveFile?.inGameTime,
        mercs: {
            ...saveFile.mercs,
            [mercKey]: selectedMerc
        },
    } 

    if(assignType === "contract" && contractKey && slot === "main"){
        let selectedContract = saveFile.contracts?.[contractKey];
        if(!selectedContract) throw new Error("Contract not found");
        selectedContract.mercSlots[slot] = { key: mercKey };
        data.contracts = { ...saveFile.contracts, [contractKey]: selectedContract };
    }

    if(assignType === "business" && businessKey && (slot === "manager" || slot === "security")){
        let selectedBusiness = saveFile.businesses?.[businessKey];
        if(!selectedBusiness) throw new Error("Business not found");
        if(!selectedBusiness.mercSlots) selectedBusiness.mercSlots = {};
        selectedBusiness.mercSlots[slot] = { key: mercKey };
        data.businesses = { ...saveFile.businesses, [businessKey]: selectedBusiness };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await db.saveFile.update({ 
        where: { id }, 
        data: { ...data, updatedAt: new Date() }
    } as any);
}, { trace: "assignMerc" });



//______________________________________________________________________________________
// ===== Contract Updates =====

export const signContract = async ({
    id, 
    contractKey,
    inGameTime,
    timeLeft,
}: Readonly<{ 
    id: string;
    contractKey: string;
    inGameTime?: number; 
    timeLeft?: number;
}>) => serverAction<SaveFile>(async () => {
    const timeLeftToUse = timeLeft ?? SCALING_REGENERATED_TIME;
    const saveFile = await rawReadSaveFile(id);
    if(!saveFile?.potentialContracts) throw new Error("No potential contracts to sign");

    let selectedContract = saveFile.potentialContracts.contracts?.[contractKey];
    if(!selectedContract) throw new Error("Contract not found");
    selectedContract.stage = "signed";

    let potentialContracts: PotentialContracts = { ...saveFile.potentialContracts };
    if(potentialContracts.contracts?.[contractKey]) delete potentialContracts.contracts[contractKey];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await db.saveFile.update({ 
        where: { id }, 
        data: {
            contracts: {
                ...saveFile.contracts,
                [contractKey]: selectedContract
            },
            potentialContracts: {
                ...potentialContracts,
                regeneratedTime: timeLeftToUse,
            },
            inGameTime: inGameTime ?? saveFile?.inGameTime,
            updatedAt: new Date(),
        }
    } as any);
}, { trace: "signContract" });

export const cancelContract = async ({
    id, 
    contractKey,
    inGameTime,
}: Readonly<{ 
    id: string;
    contractKey: string;
    inGameTime?: number; 
}>) => serverAction<SaveFile>(async () => {
    const saveFile = await rawReadSaveFile(id);
    if(!saveFile?.contracts) throw new Error("No contracts to cancel");

    let selectedContract = saveFile.contracts?.[contractKey];
    if(!selectedContract) throw new Error("Contract not found");
    
    let contracts: Contracts = { ...saveFile.contracts };
    if(contracts[contractKey]) delete contracts[contractKey];

    let newResources = { ...saveFile.resources };
    if(newResources?.xp && newResources.xp > 0) newResources.xp -= (selectedContract.rewards.xp ?? 0);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await db.saveFile.update({ 
        where: { id }, 
        data: {
            resources: newResources,
            contracts,
            inGameTime: inGameTime ?? saveFile?.inGameTime,
            updatedAt: new Date(),
        }
    } as any);
}, { trace: "cancelContract" });

export const regenerateContracts = async ({ 
    id, 
    inGameTime,
    timeLeft 
}: Readonly<{ 
    id: string; 
    inGameTime?: number; 
    timeLeft?: number; 
}>) => serverAction<SaveFile>(async () => {
    const timeLeftToUse = timeLeft ?? SCALING_REGENERATED_TIME;
    const saveFile = await rawReadSaveFile(id);
    const levelPlayer = xpToLevel((saveFile?.xp ?? 0), SCALING_CORE_MAGIC_NUMBER_PLAYER) || 0;
    const contracts = getRandomContracts(levelPlayer, 3);
    return await db.saveFile.update({ 
        where: { id }, 
        data: { 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            potentialContracts: { regeneratedTime: timeLeftToUse, contracts } as any,
            inGameTime: inGameTime ?? saveFile?.inGameTime,
            updatedAt: new Date(),
        }
    });
}, { trace: "regenerateContracts" })