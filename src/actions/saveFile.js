'use server'

// import { revalidatePath } from 'next/cache';
import { unstable_noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { readServerSession } from '@/lib/protector';
import { defaultSaveData } from '@/data/defaultSaveData';
import { isObj } from '@/util';



//______________________________________________________________________________________
// ===== Read Actions =====

const requiredRole = "TESTER";



//______________________________________________________________________________________
// ===== Read Actions =====

/**
 * Reads save files from the database for a specific user.
 * @returns array of objects where each object is a save file
 */
export const readSaveFilesByUserId = async () => {
    unstable_noStore();

    const session = await readServerSession({ trace:"readSaveFilesByUserId", requiredRole });
    if(isObj(session, ["error"])) return session;
    
    try {
        return await prisma.saveFile.findMany({
            select: { id:true, name:true, chapter:true, type:true, saveData:true, inGameTime:true, createdAt:true, updatedAt:true },
            where: { userId:session.user.id },
            orderBy: [ { updatedAt: 'desc' } ]  
        });
    } catch (error) {
        const message = "Unexpected error reading save files!"
        console.error(message, { trace:"readSaveFilesByUserId", error, session });
        return { error:true, message }
    }
}

/**
 * Reads save file from the database for a specific user.
 * @returns object that represents the saveFile
 */
export const readSaveFile = async (id) => {
    unstable_noStore();
    
    console.log({ trace:"readSaveFile", id })

    const session = await readServerSession({ trace:"readSaveFile", requiredRole });
    if(isObj(session, ["error"])) return session;

    try {
        return await prisma.saveFile.findUnique({ where: { id, userId:session.user.id } });
    } catch (error) {
        const message = "Unexpected error reading save file!"
        console.error(message, { trace:"readSaveFile", error, session });
        return { error:true, message }
    }
}



//______________________________________________________________________________________
// ===== Create Action =====

/**
 * Creates a save file with a given name and saves it to the server.
 * @param name - string, represents the name of the save file to be created.
 * @returns a redirect or an obj with an error bool and error message
 */
export const createSaveFile = async (name) => {

    const session = await readServerSession({ trace:"createSaveFile", requiredRole });
    if(isObj(session, ["error"])) return session;

    const cleanedName = name.trim().replace( /\s\s+/g, ' ' ).replace(/(<([^>]+)>)/gi, "");
    if(!cleanedName) return { error:true, message:"Hmmmmm, I wonder why you are seeing this message? 🤔 Try not to use < > and limit your spaces." }

    let saveFile = null;
    try {
        saveFile = await prisma.saveFile.create({
            data:{ userId:session.user.id, name:cleanedName, saveData:defaultSaveData }
        })
    } catch (error) {
        console.error("Unexpected error creating save file!", { trace:"createSaveFile", error });
        return { error:true, message:"Unexpected error creating save file!" }
    }

    // revalidatePath("/play");
    redirect(`/play/${saveFile.id}`);
}



//______________________________________________________________________________________
// ===== Update Action =====

/**
 * Updates the in-game time and the save date of a save file in a database.
 * @param id - string, unique identifier of the save file that you want to update.
 * @param inGameTime - int, represents the in-game time that needs to be saved in the database.
 * @param additionalSaveData - obj, represents the save data to be saved in the database.
 * @returns obj, the full saveFile from the database or an object with an error bool and error message
 */
export const updateSaveFile = async (id, inGameTime, additionalSaveData) => {

    const session = await readServerSession({ trace:"updateSaveFile", requiredRole });
    if(isObj(session, ["error"])) return session;

    try {
        const saveFile = await prisma.saveFile.findUnique({ 
            select: { saveData:true },
            where: { id, userId:session.user.id }
        });

        let saveData = { ...defaultSaveData };
        if(isObj(saveFile.saveData) && isObj(additionalSaveData)) saveData = { ...defaultSaveData, ...saveFile.saveData, ...additionalSaveData };
        else if(isObj(saveFile.saveData)) saveData = { ...defaultSaveData, ...saveFile.saveData };

        return await prisma.saveFile.update({
            where: { id, userId:session.user.id },
            data:{ saveData, inGameTime, updatedAt: new Date(), }
        })
    } catch (error) {
        console.error("Unexpected error updating save file!", { trace:"updateSaveFile", error });
        return { error:true, message:"Unexpected error creating save file!" }
    }
}

/**
 * Updates the in-game time of a save file in a database.
 * @param id - string, unique identifier of the save file that you want to update.
 * @param inGameTime - int, represents the in-game time that needs to be saved in the database.
 * @returns obj, the full saveFile from the database or an object with an error bool and error message
 */
export const updateInGameTime = async (id, inGameTime) => {

    const session = await readServerSession({ trace:"updateSaveFile", requiredRole });
    if(isObj(session, ["error"])) return session;

    try {
        return await prisma.saveFile.update({
            where: { id, userId:session.user.id },
            data:{ inGameTime, updatedAt: new Date(), }
        })
    } catch (error) {
        console.error("Unexpected error updating save file!", { trace:"updateSaveFile", error });
        return { error:true, message:"Unexpected error creating save file!" }
    }
}