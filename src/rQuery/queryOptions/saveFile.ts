

// Types ----------------------------------------------------------------------------
import { type SaveFile } from "@/types";
// Packages -------------------------------------------------------------------------
import { queryOptions } from "@tanstack/react-query";
// Server ---------------------------------------------------------------------------
// import { readSaveFile } from "@/server/saveFile";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Query Options =====

// export const queryOptionsReadSaveFile = (id: SaveFile["id"]) => queryOptions({
//     queryKey: [ `readSaveFile`, { id } ],
//     queryFn: () => readSaveFile(id),
// })