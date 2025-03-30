import { type Business, type MercRoleLevels, type SaveFile, type SaveFileOptional } from "@/types";
import { BadgeEuroIcon, CircuitBoardIcon, DrillIcon, HeartPulseIcon } from "lucide-react";



//______________________________________________________________________________________
// ===== Project Configuration =====

/** the readable name of the project. */
export const PROJECT_DISPLAY_NAME = "Fixer";

/** the description of the project. */
export const PROJECT_DESCRIPTION = "A Cyberpunk experience where you manage your resources, mercenaries, businesses, and contracts. Developed by the NextGenScripts team."; 



//______________________________________________________________________________________
// ===== Scaling =====

export const SCALING_CORE_MAGIC_NUMBER = 5;

export const SCALING_CORE_MAGIC_NUMBER_PLAYER = SCALING_CORE_MAGIC_NUMBER * 5;

export const SCALING_EURO_MAGIC_NUMBER = 5;

export const SCALING_COMP_MAGIC_NUMBER = 1;

export const SCALING_JOB_SHARE_SPEED = 0.2;

export const SCALING_JOB_SHARE_BUFFER = 6.5;

export const SCALING_MERC_INNATE_SKILL_POINTS = 3;

export const SCALING_MERC_INNATE_SUB_SKILL_POINTS = 2;

export const SCALING_MERC_LEVEL_DIFFERENCE_CORE = {
    start: -5,
    end: 5,
};

export const SCALING_MERC_LEVEL_DIFFERENCE_ADDITIONAL = {
    start: -10,
    end: 10,
};


//______________________________________________________________________________________
// ===== SaveFile =====

export const DEFAULT_BUSINESS: Business = {
    key: "defaultBusiness",
    display: "Default Business",
    description: "This is a default business",
    time: 0,
    xp: 0,
    income: {},
}

export const DEFAULT_MERC_ROLE_LEVELS: MercRoleLevels = {
    corpo: 0,
    solo: 0,
    tech: 0,
}

export const MERC_ROLE_KEYS = Object.keys(DEFAULT_MERC_ROLE_LEVELS) as Array<keyof MercRoleLevels>;


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