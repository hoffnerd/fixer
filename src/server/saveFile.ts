"use server"

// Types ----------------------------------------------------------------------------
// Server ---------------------------------------------------------------------------
import { db } from "./db";
import { serverAction } from "./actions";
import { DEFAULT_SAVE_FILE } from "@/data/_config";
// Other ----------------------------------------------------------------------------



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

const rawCreateSaveFile = async () => await db.saveFile.create({ data: { ...(DEFAULT_SAVE_FILE as any) } });

// export const createSaveFile = () => serverAction(async () => {
//     return await db.saveFile.create({ data: {} });
// }, { trace: "createSaveFile" });



//______________________________________________________________________________________
// ===== Updates =====

// export const updateSaveFile = (id: string) => serverAction(async () => {
//     return await db.saveFile.update({ where: { id }, data: { updatedAt: new Date() } });
// }, { trace: "updateSaveFile" });
