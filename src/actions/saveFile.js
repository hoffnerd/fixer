'use server'

// import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { readServerSession } from '@/lib/protector';
import { checkRoleAccessLevel } from '@/util';



//______________________________________________________________________________________
// ===== Read Actions =====

export const readSaveFilesByUserId = async (userId) => await prisma.saveFile.findMany({
    select: { id:true, name:true, chapter:true, type:true, saveData:true, inGameTime:true, createdAt:true, updatedAt:true },
    where: { userId },
    orderBy: [ { updatedAt: 'desc' } ]  
});

export const readSaveFile = async (id) => await prisma.saveFile.findUnique({ where: { id } });



//______________________________________________________________________________________
// ===== Create Action =====

export const createSaveFile = async (name) => {

    const session = await readServerSession();
    if(!checkRoleAccessLevel(session, "USER")){
        console.error("Unauthorized!", { trace:"createSaveFile", session });
        return { error:true, message:"Unauthorized!" }
    }

    const cleanedName = name.trim().replace( /\s\s+/g, ' ' ).replace(/(<([^>]+)>)/gi, "");
    if(!cleanedName) return { error:true, message:"Hmmmmm, I wonder why you are seeing this message? 🤔 Try not to use < > and limit your spaces." }

    let saveFile = null;
    try {
        saveFile = await prisma.saveFile.create({
            data:{ userId:session.user.id, name:cleanedName }
        })
    } catch (error) {
        console.error("Unexpected error creating save file!", { trace:"createSaveFile", error });
        return { error:true, message:"Unexpected error creating save file!" }
    }

    // revalidatePath("/play");
    redirect(`/play/${saveFile.id}`);
}