import { type Business, type ContractTypes, type MercRoleLevels, type Resources, type ResourcesExist, type SaveFile, type SaveFileOptional } from "@/types";
import { BadgeEuroIcon, CircuitBoardIcon, DrillIcon, HeartPulseIcon, Search } from "lucide-react";



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

export const SCALING_MERC_LEVEL_DIFFERENCE_CORE = { min: -2, max: 2 };

export const SCALING_MERC_LEVEL_DIFFERENCE_ADDITIONAL = { min: -5, max: 5 };

export const SCALING_REGENERATED_TIME = 60 * 5;


//______________________________________________________________________________________
// ===== SaveFile =====

export const DEFAULT_RESOURCES: ResourcesExist = {
    euros: 0,
    weapons: 0,
    medicals: 0,
    hacks: 0,
}

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
    potentialMercs: {
        regeneratedTime: SCALING_REGENERATED_TIME,
        mercs: {},
    },
    potentialBusinesses: {
        regeneratedTime: SCALING_REGENERATED_TIME,
        businesses: {},
    },
    potentialContracts: {
        regeneratedTime: SCALING_REGENERATED_TIME,
        contracts: {},
    },
    xp: 0,
}



//______________________________________________________________________________________
// ===== Resources =====

export const ROLE_TO_RESOURCE_MAP = {
    corpo: "medicals",
    solo: "weapons",
    tech: "hacks",
}

export const RESOURCE_TO_ROLE_MAP = {
    medicals: "corpo",
    weapons: "solo",
    hacks: "tech",
}

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



//______________________________________________________________________________________
// ===== Contract =====

export const CONTRACT_TYPES: ContractTypes = {
    specialDelivery: {
        display: "Special Delivery",
        dangerLevel: 1,
        subTypes: {
            solo: { display: "Weaponry" },
            tech: { display: "Cyberware" },
            corpo: { display: "Intel" },
        },
    },
    agentSaboteur: {
        display: "Agent Saboteur",
        dangerLevel: 2,
        subTypes: {
            tech: { display: "Hacking" },
            solo: { display: "Destruction" },
            corpo: { display: "Espionage" },
        },
    },
    gunForHire: {
        display: "Gun For Hire",
        dangerLevel: 3,
        subTypes: {
            tech: { display: "Assassination" },
            solo: { display: "Elimination" },
            corpo: { display: "Reconnaissance" },
        },
    },
    thievery: {
        display: "Thievery",
        dangerLevel: 4,
        subTypes: {
            solo: { display: "Weaponry" },
            tech: { display: "Cyberware" },
            corpo: { display: "Intel" },
        },
    },
    sos: {
        display: "SOS",
        dangerLevel: 5,
        subTypes: {
            corpo : { display: "Search and Rescue" },
            tech: { display: "Security" },
            solo: { display: "Cover Fire Needed" },
        },
    },
    cyberpsycho: {
        display: "Cyberpsycho",
        dangerLevel: 6,
        subTypes: {
            tech: { display: "Unknown" },
            corpo: { display: "Unknown" },
            solo: { display: "Unknown" },
        }
    } 
}



//______________________________________________________________________________________
// ===== Random =====

export const COLOR_TO_CLASS_MAP = {
    purple: "neColorPurple",
    blue: "neColorBlue",
    yellow: "neColorYellow",
    green: "neColorGreen",
    pink: "neColorPink",
    red: "neColorRed",
    orange: "neColorOrange",
    white: "neColorWhite",
}

export const CLASS_TO_COLOR_MAP = {
    neColorPurple: "purple",
    neColorBlue: "blue",
    neColorYellow: "yellow",
    neColorGreen: "green",
    neColorPink: "pink",
    neColorRed: "red",
    neColorOrange: "orange",
    neColorWhite: "white",
}

export const COLOR_MAP = {
    ...COLOR_TO_CLASS_MAP,
    ...CLASS_TO_COLOR_MAP,
}