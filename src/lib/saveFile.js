
import prisma from './db';

export const readSaveFilesByUserId = async (userId) => {
    // const saveFiles = await prisma.saveFile.findMany({
    const saveFiles = await prisma.saveFiles.findMany({
        // select: { id:true, name:true, chapter:true, type:true, safeData:true, inGameTime:true, createdAt:true, updatedAt:true },
        select: { id:true, name:true, chapter:true, type:true, saveData:true },
        where: { userId },
        // orderBy: [ { updatedAt: 'desc' } ]  
    });
    return saveFiles;
}