

// Types ----------------------------------------------------------------------------
import { type Session } from "@prisma/client";
// Packages -------------------------------------------------------------------------
import { queryOptions } from "@tanstack/react-query";
// Server ---------------------------------------------------------------------------
import { readSession } from "@/server/session";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Query Options =====

export const queryOptionsReadSession = (id: Session["id"]) => queryOptions({
    queryKey: [ `readSession`, { id } ],
    queryFn: () => readSession(id),
})