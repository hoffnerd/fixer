"use server"

// Types ----------------------------------------------------------------------------
import { type PotentialMercs, type ResourceRewards, type SaveFile } from "@/types";
// Server ---------------------------------------------------------------------------
import { db } from "./db";
import { serverAction } from "@/_legoBlocks/nextjsCommon/server/actions";
// Data -----------------------------------------------------------------------------
import { DEFAULT_SAVE_FILE, SCALING_CORE_MAGIC_NUMBER_PLAYER, SCALING_REGENERATED_TIME } from "@/data/_config";
import { addResourceRewards, xpToLevel } from "@/utils";
import { canHireMerc, getRandomMercs } from "@/utils/mercs";
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
    return await db.saveFile.create({ 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: { 
            ...(DEFAULT_SAVE_FILE as any),
            potentialMercs: {
                ...DEFAULT_SAVE_FILE.potentialMercs,
                mercs,
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
})

