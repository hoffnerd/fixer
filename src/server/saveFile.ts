"use server"

// Types ----------------------------------------------------------------------------
import { type SaveFile } from "@/types";
// Server ---------------------------------------------------------------------------
import { db } from "./db";
import { serverAction } from "./actions";
// Data -----------------------------------------------------------------------------
import { DEFAULT_SAVE_FILE } from "@/data/_config";
// Other ----------------------------------------------------------------------------
import { getRandomMerc } from "@/utils";
import { sleep } from "@/_nextjsCommon/utils";



//______________________________________________________________________________________
// ===== Reads =====

export const readSaveFile = async (id?: string | null) => serverAction(async () => {
    if(!id) return await rawCreateSaveFile();
    const saveFile = await db.saveFile.findUnique({ where: { id } });
    if(!saveFile?.id) return await rawCreateSaveFile();
    return db.saveFile.update({ where: { id }, data: { updatedAt: new Date() } });
}, { trace: "readSaveFile" });



//______________________________________________________________________________________
// ===== Creates =====

const rawCreateSaveFile = async () => {
    const starterMerc = getRandomMerc();
    return await db.saveFile.create({ 
        data: { 
            ...(DEFAULT_SAVE_FILE as any),
            mercs: {
                [starterMerc.key]: starterMerc,
            }
        } 
    })
};

// export const createSaveFile = () => serverAction(async () => {
//     return await db.saveFile.create({ data: {} });
// }, { trace: "createSaveFile" });



//______________________________________________________________________________________
// ===== Updates =====

export const addRandomMerc = async (id: string) => serverAction(async () => {
    const saveFile: SaveFile = await db.saveFile.findUnique({ where: { id } }) as any;
    const existingMercs = saveFile?.mercs || {};
    const randomMerc = getRandomMerc(existingMercs);
    return await db.saveFile.update({ 
        where: { id }, 
        data: ({ 
            mercs: { 
                ...existingMercs,
                [randomMerc.key]: randomMerc 
            } 
        } as any)
    });
}, { trace: "addRandomMerc" });

