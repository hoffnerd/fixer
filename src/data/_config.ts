import { type SaveFile, type SaveFileOptional } from "@/types";
import { BadgeEuroIcon, CircuitBoardIcon, DrillIcon, HeartPulseIcon } from "lucide-react";



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
// ===== SaveFile =====

export const DEFAULT_SAVE_FILE: SaveFileOptional = {
    resources: {
        euros: 100,
        weapons: 5,
        medicals: 5,
        hacks: 5,
    },
    mercs: {},
    businesses: {},
    contracts: {},
}



//______________________________________________________________________________________
// ===== Resources =====

export const RESOURCES_INFO = {
    euros: {    
        display: "Eurodollars",
        description: "The European Currency Unit (symbol: €$ or §; and abbreviated to ecu), more commonly referred to as Eurodollar (ed) or Eurobuck (eb), and colloquially known as eddie and ebuck, is the main currency of Europe and North America.",
        IconComponent: BadgeEuroIcon,
    },
    weapons: {
        display: "Weapon Components",
        description: "Broken pieces weapons that can be repurposed into new weapons. Some clients may pay you in weapons components.",
        IconComponent: DrillIcon,
    },
    medicals: {
        display: "Medical Components",
        description: "Medical components are used to heal bio. Some clients may pay you in medical components.",
        IconComponent: HeartPulseIcon,
    },
    hacks: {
        display: "QuickHack Components",
        description: "Components used to upgrade cyberware. Some clients may pay you in quickhack components.",
        IconComponent: CircuitBoardIcon,
    },
}