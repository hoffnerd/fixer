"use server"

// Types ----------------------------------------------------------------------------
import type {
    Businesses,
    BusinessMercSlot,
    BusinessMercSlots,
    Contracts,
    ContractStageSwappable,
    DynamicMessage,
    Merc,
    MercAssignType,
    Mercs,
    MercSlot,
    PotentialBusinesses,
    PotentialContracts,
    PotentialMercs,
    ResourceRewards,
    SaveFile,
    SaveFileOptional,
} from "@/types";
// Server ---------------------------------------------------------------------------
import { db } from "./db";
import { serverAction } from "@/_legoBlocks/nextjsCommon/server/actions";
// Data -----------------------------------------------------------------------------
import { CONTRACT_MERC_DEATH_CHANCE_ON_FAILURE, DEFAULT_SAVE_FILE, SCALING_BUSINESS_INCOME_MULTIPLIER, SCALING_CORE_MAGIC_NUMBER_PLAYER, SCALING_REGENERATED_TIME } from "@/data/_config";
// Other ----------------------------------------------------------------------------
import { addResourceRewards, getRandomNumber, xpToLevel } from "@/utils";
import { canHireMerc, getRandomBusinesses, getRandomContracts, getRandomMercs } from "@/utils/mercs";
import { calculateSuccessChance } from "@/utils/contracts";
import { getJobShare, handleScaling } from "@/utils/scaling";
import { calculateBusinessSuccessChance, calculateBusinessTotalJobShare, getBusinessDisplay, getBusinessMercs } from "@/utils/businesses";



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
    const businesses = getRandomBusinesses(0, 3);
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
            potentialBusinesses: {
                ...DEFAULT_SAVE_FILE.potentialBusinesses,
                businesses,
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
    const levelPlayer = xpToLevel((saveFile?.resources?.xp ?? 0), SCALING_CORE_MAGIC_NUMBER_PLAYER) || 0;
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

    if(slot === "unassign") delete selectedMerc.mercSlot;
    else selectedMerc.mercSlot = { type: assignType, slot, contractKey, businessKey };

    let data: SaveFileOptional = {
        inGameTime: inGameTime ?? saveFile?.inGameTime,
        mercs: {
            ...saveFile.mercs,
            [mercKey]: selectedMerc
        },
    } 

    if(assignType === "contract" && contractKey){
        let selectedContract = saveFile.contracts?.[contractKey];
        if(!selectedContract) throw new Error("Contract not found");
        if(!selectedContract.mercSlots) selectedContract.mercSlots = {};

        if(slot === "unassign"){
            let newMercSlots = { ...selectedContract.mercSlots };
            for (const [k, value] of Object.entries(newMercSlots)) {
                const key = k as keyof typeof newMercSlots;
                if(value?.key && value.key === mercKey) delete newMercSlots[key];
            }
            selectedContract.mercSlots = newMercSlots;
        } else {
            // @ts-ignore
            selectedContract.mercSlots[slot] = { key: mercKey };
        } 

        data.contracts = { ...saveFile.contracts, [contractKey]: selectedContract };
    }

    if(assignType === "business" && businessKey){
        let selectedBusiness = saveFile.businesses?.[businessKey];
        if(!selectedBusiness) throw new Error("Business not found");
        if(!selectedBusiness.mercSlots) selectedBusiness.mercSlots = {};
        
        if(slot === "unassign"){
            let newMercSlots = { ...selectedBusiness.mercSlots };
            for (const [k, v] of Object.entries(newMercSlots)) {
                const key = k as keyof typeof newMercSlots;
                const value = v as typeof newMercSlots[typeof key];
                if(value?.key === mercKey) delete newMercSlots[key];
            }
            selectedBusiness.mercSlots = newMercSlots;
        } else {
            // @ts-ignore
            selectedBusiness.mercSlots[slot] = { key: mercKey };
        }

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

export const updateContractStage = async ({
    id, 
    contractKey,
    stage,
    inGameTime,
}: Readonly<{ 
    id: string;
    contractKey: string;
    stage: ContractStageSwappable;
    inGameTime?: number; 
}>) => serverAction<SaveFile>(async () => {
    const saveFile = await rawReadSaveFile(id);
    if(!saveFile?.contracts) throw new Error("No contracts found!");

    let selectedContract = saveFile.contracts[contractKey];
    if(!selectedContract) throw new Error("Contract not found!");

    if(stage === "signed" && selectedContract.stage === "researching"){
        // add intel bonus
    }
    selectedContract.stage = stage;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await db.saveFile.update({ 
        where: { id }, 
        data: {
            contracts: {
                ...saveFile.contracts,
                [contractKey]: selectedContract
            },
            inGameTime: inGameTime ?? saveFile?.inGameTime,
            updatedAt: new Date(),
        }
    } as any);
}, { trace: "updateContractStage" });

export const completeContract = async ({
    id, 
    contractKey,
    inGameTime,
}: Readonly<{ 
    id: string;
    contractKey: string;
    inGameTime?: number; 
}>) => serverAction<{ newSaveFile: SaveFile; hasSucceeded: boolean; message?: String; }>(async () => {
    const saveFile = await rawReadSaveFile(id);
    if(!saveFile?.contracts) throw new Error("No contracts found!");

    let hasSucceeded = false;
    let hasMercDied = false;
    let message = "";
    let data: SaveFileOptional = {
        inGameTime: inGameTime ?? saveFile?.inGameTime,
    };
    let selectedContract = saveFile.contracts[contractKey];
    if(!selectedContract) throw new Error("Contract not found!");

    let newResources = { ...saveFile.resources };
    let merc = (selectedContract.mercSlots?.main?.key && saveFile.mercs[selectedContract.mercSlots.main.key]
        ? { ...saveFile.mercs[selectedContract.mercSlots.main.key] }
        : null
    ) as Merc | null;
    if(!merc?.key) throw new Error("Merc not found");

    const { value: jobShare } = handleScaling(getJobShare, { xpPlayer: saveFile.resources.xp, xpEntity: merc.xp });

    const { successChance, unforeseenEvent } = calculateSuccessChance(selectedContract, merc);
    const roll = getRandomNumber(0, 100);
    if(roll <= successChance){
        // Success
        message = `Success! ${merc.display} has successfully completed the ${selectedContract.display} - ${selectedContract.roleDisplay} contract!`;
        hasSucceeded = true;

        Object.entries(selectedContract.rewards).forEach(([k, v]) => {
            const key = k as keyof typeof newResources;

            if(key === "xp") {
                newResources[key] = (newResources[key] ?? 0) + v;
                return;
            };

            let valueShared = Math.floor(v * (jobShare / 100));
            if(valueShared < 1) valueShared = 1;

            let value = v - valueShared;
            if(value < 1) value = 1;

            const newResourcesValue = Math.floor((newResources[key] ?? 0) + value);
            newResources[key] = newResourcesValue;
        });
        data.resources = newResources;
        merc.xp += (selectedContract.rewards.xp ?? 0);
    } else {
        // Failure
        message = `Failure! ${merc.display} has failed the ${selectedContract.display} - ${selectedContract.roleDisplay} contract!`;

        let deathChance = 0;
        if(unforeseenEvent.value === "criticalFailure"){
            deathChance = CONTRACT_MERC_DEATH_CHANCE_ON_FAILURE * 2;
        }
        else if(unforeseenEvent.value === "failure"){
            deathChance = CONTRACT_MERC_DEATH_CHANCE_ON_FAILURE;
        }
        if(deathChance > 0){
            const deathRoll = getRandomNumber(0, 100);
            if(deathRoll <= deathChance){
                // Merc dies
                let newMercs = { ...saveFile.mercs };
                delete newMercs[merc.key];
                data.mercs = newMercs;
                message = `${message} Unfortunately, ${merc.display} has died!`;
                hasMercDied = true;
            }
        }
    }

    if(!hasMercDied) {
        delete merc.mercSlot;
        data.mercs = { ...saveFile.mercs, [merc.key]: merc };
    }

    let contracts: Contracts = { ...saveFile.contracts };
    delete contracts[contractKey];
    data.contracts = contracts;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newSaveFile = await db.saveFile.update({
        where: { id },
        data: { ...data, updatedAt: new Date() }
    } as any) as unknown as SaveFile;
    
    return { newSaveFile, hasSucceeded, message };
}, { trace: "completeContract" });

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

    let mercs: Mercs = { ...saveFile.mercs };
    if(selectedContract.mercSlots.main?.key && saveFile.mercs?.[selectedContract.mercSlots.main.key]?.mercSlot?.type === "contract"){
        let selectedMerc = { ...saveFile.mercs[selectedContract.mercSlots.main.key] } as Merc;
        delete selectedMerc.mercSlot;
        mercs[selectedContract.mercSlots.main.key] = selectedMerc;
    }
    
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
            mercs,
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
    const levelPlayer = xpToLevel((saveFile?.resources?.xp ?? 0), SCALING_CORE_MAGIC_NUMBER_PLAYER) || 0;
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
}, { trace: "regenerateContracts" });



//______________________________________________________________________________________
// ===== Businesses Up =====

export const purchaseBusiness = async ({
    id, 
    businessKey,
    inGameTime,
    timeLeft,
}: Readonly<{ 
    id: string;
    businessKey: string;
    inGameTime?: number; 
    timeLeft?: number;
}>) => serverAction<SaveFile>(async () => {
    const timeLeftToUse = timeLeft ?? SCALING_REGENERATED_TIME;
    const saveFile = await rawReadSaveFile(id);
    if(!saveFile?.potentialBusinesses) throw new Error("No potential businesses to sign");

    let selectedBusiness = saveFile.potentialBusinesses.businesses?.[businessKey];
    if(!selectedBusiness) throw new Error("Business not found");
    selectedBusiness.stage = "open";

    let potentialBusinesses: PotentialBusinesses = { ...saveFile.potentialBusinesses };
    if(potentialBusinesses.businesses?.[businessKey]) delete potentialBusinesses.businesses[businessKey];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await db.saveFile.update({ 
        where: { id }, 
        data: {
            businesses: {
                ...saveFile.businesses,
                [businessKey]: selectedBusiness
            },
            potentialBusinesses: {
                ...potentialBusinesses,
                regeneratedTime: timeLeftToUse,
            },
            inGameTime: inGameTime ?? saveFile?.inGameTime,
            updatedAt: new Date(),
        }
    } as any);
}, { trace: "purchaseBusiness" });

export const forecloseBusiness = async ({
    id, 
    businessKey,
    inGameTime,
}: Readonly<{ 
    id: string;
    businessKey: string;
    inGameTime?: number; 
}>) => serverAction<SaveFile>(async () => {
    const saveFile = await rawReadSaveFile(id);
    if(!saveFile?.businesses) throw new Error("No businesses to foreclose!");

    let selectedBusiness = saveFile.businesses?.[businessKey];
    if(!selectedBusiness) throw new Error("Business not found!");

    let mercs: Mercs = { ...saveFile.mercs };
    Object.entries(selectedBusiness?.mercSlots ?? {}).forEach(([k, v]) => {
        const slotKey = k as keyof BusinessMercSlots;
        const slotObj = v as BusinessMercSlot;
        if(!slotObj?.key) return;
        let selectedMerc = { ...saveFile.mercs[slotObj.key] } as Merc;
        delete selectedMerc.mercSlot;
        mercs[slotObj.key] = selectedMerc;
    });

    let businesses: Businesses = { ...saveFile.businesses };
    if(businesses[businessKey]) delete businesses[businessKey];

    let newResources = { ...saveFile.resources };
    if(newResources?.xp && newResources.xp > 0) newResources.xp -= ((selectedBusiness.staticIncome.xp ?? 0) * SCALING_BUSINESS_INCOME_MULTIPLIER);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await db.saveFile.update({ 
        where: { id }, 
        data: {
            resources: newResources,
            businesses,
            mercs,
            inGameTime: inGameTime ?? saveFile?.inGameTime,
            updatedAt: new Date(),
        }
    } as any);
}, { trace: "forecloseBusiness" });

export const sellBusiness = async ({
    id, 
    businessKey,
    inGameTime,
}: Readonly<{ 
    id: string;
    businessKey: string;
    inGameTime?: number; 
}>) => serverAction<{ newSaveFile: SaveFile; hasSucceeded: boolean; message?: String; }>(async () => {
    const saveFile = await rawReadSaveFile(id);
    if(!saveFile?.businesses) throw new Error("No businesses to foreclose!");

    let hasSucceeded = false;
    let message = "";
    let selectedBusiness = saveFile.businesses?.[businessKey];
    if(!selectedBusiness) throw new Error("Business not found!");

    let mercs: Mercs = { ...saveFile.mercs };
    Object.entries(selectedBusiness?.mercSlots ?? {}).forEach(([k, v]) => {
        const slotKey = k as keyof BusinessMercSlots;
        const slotObj = v as BusinessMercSlot;
        if(!slotObj?.key) return;
        let selectedMerc = { ...saveFile.mercs[slotObj.key] } as Merc;
        delete selectedMerc.mercSlot;
        mercs[slotObj.key] = selectedMerc;
    });

    let businesses: Businesses = { ...saveFile.businesses };
    if(businesses[businessKey]) delete businesses[businessKey];

    hasSucceeded = true;
    message = "Successfully sold business for: TODO";

    let newResources = { ...saveFile.resources };
    if(newResources?.xp && newResources.xp > 0) newResources.xp += ((selectedBusiness.staticIncome.xp ?? 0) * SCALING_BUSINESS_INCOME_MULTIPLIER);

    // TODO: ADD SELLING OF BUSINESS INCOME


    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newSaveFile = await db.saveFile.update({ 
        where: { id }, 
        data: {
            resources: newResources,
            businesses,
            mercs,
            inGameTime: inGameTime ?? saveFile?.inGameTime,
            updatedAt: new Date(),
        }
    } as any);
    
    return { newSaveFile, hasSucceeded, message };
}, { trace: "sellBusiness" });

export const incomeBusiness = async ({
    id, 
    businessKey,
    inGameTime,
}: Readonly<{ 
    id: string;
    businessKey: string;
    inGameTime?: number; 
}>) => serverAction<{ newSaveFile: SaveFile; hasSucceeded: boolean; message?: String; }>(async () => {
    const saveFile = await rawReadSaveFile(id);
    if(!saveFile?.businesses) throw new Error("No businesses found!");

    let hasSucceeded = false;
    let hasMercDied = false;
    let message = "";
    let data: SaveFileOptional = {
        inGameTime: inGameTime ?? saveFile?.inGameTime,
    };
    let selectedBusiness = saveFile.businesses[businessKey];
    if(!selectedBusiness) throw new Error("Business not found!");

    const assignedMercs = getBusinessMercs({ saveFile, business: selectedBusiness });
    if((assignedMercs?.count ?? 0) <= 0) throw new Error("No mercs assigned to business!");

    let newResources = { ...saveFile.resources };

    const { value: jobShare } = calculateBusinessTotalJobShare({ saveFile, business: selectedBusiness, assignedMercs });
    
    const { successChance, unforeseenEvent } = calculateBusinessSuccessChance({ business: selectedBusiness, assignedMercs });
    const roll = getRandomNumber(0, 100);

    message = `Rolled ${roll} for ${getBusinessDisplay(selectedBusiness)} with a share of ${jobShare}. TODO`;
    hasSucceeded = true;
    
    // TODO: ADD INCOME TO BUSINESS

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newSaveFile = await db.saveFile.update({
        where: { id },
        data: { ...data, updatedAt: new Date() }
    } as any) as unknown as SaveFile;
    
    return { newSaveFile, hasSucceeded, message };
}, { trace: "incomeBusiness" });

export const regenerateBusinesses = async ({
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
    const levelPlayer = xpToLevel((saveFile?.resources?.xp ?? 0), SCALING_CORE_MAGIC_NUMBER_PLAYER) || 0;
    const businesses = getRandomBusinesses(levelPlayer, 3);
    return await db.saveFile.update({ 
        where: { id }, 
        data: { 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            potentialBusinesses: { regeneratedTime: timeLeftToUse, businesses } as any,
            inGameTime: inGameTime ?? saveFile?.inGameTime,
            updatedAt: new Date(),
        }
    });
}, { trace: "regenerateBusinesses" });