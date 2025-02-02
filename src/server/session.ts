"use server"

// Types ----------------------------------------------------------------------------
import { type Session } from "@prisma/client";
// Server ---------------------------------------------------------------------------
import { db } from "./db";
import { serverAction } from "./actions";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Reads =====

export const readSession = async (id?: string | null) => serverAction(async () => {
    if(!id) return await db.session.create({ data: {} });
    const session = await db.session.findUnique({ where: { id } });
    if(!session?.id) return await db.session.create({ data: {} });
    return db.session.update({ where: { id }, data: { updatedAt: new Date() } });
}, { trace: "readSession" });



//______________________________________________________________________________________
// ===== Creates =====

// export const createSession = () => serverAction(async () => {
//     return await db.session.create({ data: {} });
// }, { trace: "createSession" });



//______________________________________________________________________________________
// ===== Updates =====

// export const updateSession = (id: string) => serverAction(async () => {
//     return await db.session.update({ where: { id }, data: { updatedAt: new Date() } });
// }, { trace: "updateSession" });
