"use server"

// Types ----------------------------------------------------------------------------
import { type ResourceRewards, type SaveFile } from "@/types";
// Server ---------------------------------------------------------------------------
import { db } from "./db";
import { serverAction } from "@/_legoBlocks/nextjsCommon/server/actions";
// Data -----------------------------------------------------------------------------
import { DEFAULT_SAVE_FILE } from "@/data/_config";
// Other ----------------------------------------------------------------------------
// import { getRandomMerc } from "@/utils";



//______________________________________________________________________________________
// ===== Reads =====

const rawReadSaveFile = async (id: string) => {
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
    // const starterMerc = getRandomMerc();
    return await db.saveFile.create({ 
        data: { 
            ...(DEFAULT_SAVE_FILE as any),
            // mercs: {
            //     [starterMerc.key]: starterMerc,
            // }
        } 
    })
};

// export const createSaveFile = () => serverAction(async () => {
//     return await db.saveFile.create({ data: {} });
// }, { trace: "createSaveFile" });



//______________________________________________________________________________________
// ===== Updates =====

export const updateResources = async ({id, income}: Readonly<{ id: string, income: ResourceRewards }>) => serverAction<SaveFile>(async () => {
// export const updateResources = async (id: string) => serverAction<SaveFile>(async () => {
//     const income: ResourceRewards = {}
    const saveFile = await rawReadSaveFile(id);
    const existingResources = saveFile?.resources || {};

    let updatedResources: ResourceRewards = { ...existingResources };
    Object.keys(income).forEach((value) => {
        const key = value as keyof ResourceRewards;
        if(!income[key]) return;
        updatedResources[key] = (updatedResources[key] || 0) + income[key];
    });

    console.log({ trace: "updateResources", income, updatedResources });
    
    return await db.saveFile.update({ 
        where: { id }, 
        data: { 
            resources: { ...updatedResources },
        }
    });
}, { trace: "updateResources" });

// export const addRandomMerc = async (id: string) => serverAction<SaveFile>(async () => {
//     const saveFile: SaveFile = await db.saveFile.findUnique({ where: { id } }) as any;
//     const existingMercs = saveFile?.mercs || {};
//     // const randomMerc = getRandomMerc(existingMercs);
//     return await db.saveFile.update({ 
//         where: { id }, 
//         data: ({ 
//             mercs: { 
//                 ...existingMercs,
//                 // [randomMerc.key]: randomMerc 
//             } 
//         } as any)
//     });
// }, { trace: "addRandomMerc" });

