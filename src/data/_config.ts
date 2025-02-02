import { type SaveFile, type SaveFileOptional } from "@/types";



//______________________________________________________________________________________
// ===== Project Configuration =====

/** the readable name of the project. */
export const PROJECT_DISPLAY_NAME = "Fixer";

/** the description of the project. */
export const PROJECT_DESCRIPTION = "A Cyberpunk experience where you manage your resources, mercenaries, businesses, and contracts. Developed by the NextGenScripts team."; 

/** Object that lists errors that can occur across the project */
export const PROJECT_ERRORS = {
    // e: { key:"e", display:"" },
    e_unauthorized: { key:"e_unauthorized", display:"Unauthorized!" },
    e_forbidden: { key:"e_forbidden", display:"Forbidden!" },
}



//______________________________________________________________________________________
// ===== Project Configuration =====

export const DEFAULT_SAVE_FILE: SaveFileOptional = {
    resources: {
        euros: 100,
        weapons: 5,
        techs: 5,
        hacks: 5,
    },
    mercs: {},
    businesses: {},
    contracts: {},
}

