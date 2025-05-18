import type { BUSINESS_TYPES, CONTRACT_TYPES, DEFAULT_MERC_ROLE_LEVELS } from "@/data/_config";
import { type SaveFile as SaveFilePrisma } from "@prisma/client";



//______________________________________________________________________________________
// ===== GenericObject =====

export type GenericObject = Record<string, unknown>;

export interface DynamicMessage {
    text: string;
    className?: string;
}


//______________________________________________________________________________________
// ===== Resources =====

export interface ResourcesExist {
    xp: number;
    euros: number;
    weapons: number;
    medicals: number;
    hacks: number;
}

export interface Resources {
    xp?: number;
    euros?: number;
    weapons?: number;
    medicals?: number;
    hacks?: number;
}

export interface ResourceRewards {
    xp?: number;
    euros?: number;
    weapons?: number;
    medicals?: number;
    hacks?: number;
}



//______________________________________________________________________________________
// ===== Mercs =====

export type MercAssignType = "contract" | "business";

export type MercSlot = keyof BusinessMercSlots | keyof ContractMercSlots | "unassign";

export interface MercSlotObject {
    type: MercAssignType;
    slot: MercSlot;
    contractKey?: Contract["key"];
    businessKey?: Business["key"];
}

export type MercRoleLevels = typeof DEFAULT_MERC_ROLE_LEVELS;

export interface Merc {
    key: string;
    display: string;
    innateRole: keyof MercRoleLevels;
    innateSubRole: keyof MercRoleLevels;
    roleLevels: MercRoleLevels;
    xp: number;
    initialCost: Resources;
    mercSlot?: MercSlotObject;
}

export type Mercs = Record<Merc["key"], Merc>;

export interface PotentialMercs {
    regeneratedTime: number;
    mercs?: Mercs;
}



//______________________________________________________________________________________
// ===== Business =====

export interface BusinessTypeMercSlotInfoRole{ 
    display: string;
}

export interface BusinessTypeMercSlotInfoObject {
    display: string;

    /** 
     * Optional number, default is `0`. The number of levels the player 
     * needs to earn on that business to unlock the merc slot. 
     **/
    unlockedAt?: number;

    /** The innate role of the merc slot. If undefined, will be generated */
    innateRole?: keyof MercRoleLevels;
    
    roles?: Record<keyof MercRoleLevels, ContractRole>;

}  

export interface BusinessType {
    display: string;
    nameGeneration: Array<{ 
        prefix: string, 
        postfix: string, 
        chanceMultiple?: number 
    }>;
    mercSlotsInfo: Record<keyof Business["mercSlots"], BusinessTypeMercSlotInfoObject>;

}

export interface BusinessMercSlot {
    key: Merc["key"];
}

export interface BusinessMercSlots {
    manager?: BusinessMercSlot | null,
    security?: BusinessMercSlot | null,
    illicitActivity?: BusinessMercSlot | null,
}

export interface Business {
    key: string; // `${createdAt.getTime()}_${generationIndex}`
    createdAt: Date;
    generationIndex: number;
    type: keyof typeof BUSINESS_TYPES;
    innateRole: keyof MercRoleLevels;
    innateSubRole: keyof MercRoleLevels;
    roleLevels: MercRoleLevels;
    stage: "open" | "closed";
    xp: number;
    display: string;
    roleDisplay: string;
    staticIncome: ResourceRewards;
    time: number;
    mercSlots?: BusinessMercSlots;
}

export type Businesses = Record<Business["key"], Business>;

export interface PotentialBusinesses {
    regeneratedTime: number;
    businesses?: Businesses;
}


//______________________________________________________________________________________
// ===== Contracts =====


export interface ContractRole {
    display: string;
}

export interface ContractMercSlot {
    key: Merc["key"];
}

export interface ContractMercSlots {
    main?: ContractMercSlot | null;
}

export type ContractStageSwappable = "signed" | "researching" | "inProgress";

export type ContractStage = "unsigned" | ContractStageSwappable | "completed";

export interface Contract {
    key: string; // `${createdAt.getTime()}_${generationIndex}`
    createdAt: Date;
    generationIndex: number;
    type: keyof typeof CONTRACT_TYPES;
    innateRole: keyof MercRoleLevels;
    innateSubRole: keyof MercRoleLevels;
    roleLevels: MercRoleLevels;
    stage: ContractStage;
    client: string;
    xp: number;
    display: string;
    roleDisplay: string
    description?: string;
    rewards: ResourceRewards;
    time: number;
    mercSlots: ContractMercSlots;
}

export type Contracts = Record<Contract["key"], Contract>;

export interface PotentialContracts {
    regeneratedTime: number;
    contracts?: Contracts;
}



//______________________________________________________________________________________
// ===== SaveFile =====

export interface SaveFileFlags {
    hasHiredFirstMerc: boolean;
    // ...
}

export interface SaveFile extends Omit<
    SaveFilePrisma, 
    'xp' | 'resources' | 'mercs' | 'businesses' | 'contracts' | 'potentialMercs' | 'potentialBusinesses' | 'potentialContracts' | 'flags'
> {
    resources: Resources;
    mercs: Mercs;
    businesses: Businesses;
    contracts: Contracts;
    potentialMercs: PotentialMercs;
    potentialBusinesses: PotentialBusinesses;
    potentialContracts: PotentialContracts;
    // flags: SaveFileFlags;
}

export interface SaveFileOptional {
    id?: string;
    resources?: Resources;
    mercs?: Mercs;
    businesses?: Businesses;
    contracts?: Contracts;
    potentialMercs?: PotentialMercs;
    potentialBusinesses?: PotentialBusinesses;
    potentialContracts?: PotentialContracts;
    flags?: SaveFileFlags;
    inGameTime?: number;
    createdAt?: Date;
    updatedAt?: Date;
}



//______________________________________________________________________________________
// ===== Actions =====



//______________________________________________________________________________________
// ===== Stores =====

export interface SaveQueueObj {
    mutationKey: 
        "updateResourcesMutation" 
        | "hireMercMutation"
        | "assignMercMutation"
        | "regenerateMercsMutation"
        | "signContractMutation"
        | "updateContractStageMutation"
        | "completeContractMutation"
        | "regenerateContractsMutation"
        | "regenerateBusinessesMutation"
        | "cancelContractMutation"

        ;
    props?: {
        income?: ResourceRewards;
        assignType?: "contract" | "business"
        slot?: MercSlot
        mercKey?: string;
        contractKey?: string;
        businessKey?: string;
        stage?: ContractStageSwappable;
    }
}

export type ActiveMobilePanels = "resources" | "mercs" | "contracts" | "other";

export interface GameStoreStateOptional {
    sessionTime?: number;
    isSessionTimerRunning?: boolean;
    isGameSaving?: boolean;
    inGameTime?: number;
    lastSavedTime?: Date;
    activeMobilePanel?: ActiveMobilePanels;
}

export interface GameStoreState {
    sessionTime: number;
    isSessionTimerRunning: boolean;
    isGameSaving: boolean;
    inGameTime: number;
    lastSavedTime: Date;
    activeMobilePanel: ActiveMobilePanels;

    // Not controllable by basic `setStoreKeyValuePair`function
    saveQueue: Array<SaveQueueObj>;
    activeSaveQueueObj: SaveQueueObj | null;
    contractTimes: Record<Contract["key"], {
        time: number;
        timeLeft: number;
    }>;
    businessTimes: Record<Business["key"], {
        time: number;
        timeLeft: number;
    }>;
}

export interface GameStoreFunctions {
    setStoreKeyValuePair: (obj: GameStoreStateOptional) => void;
    pushToSaveQueue: (saveQueueObj: SaveQueueObj) => void;
    activateSaveQueueObj: () => void;
    finishSaveQueueObj: () => void;
    setInitialTimes: ({
        contractKey,
        businessKey,
        time,
        timeLeft,
    }: Readonly<{
        contractKey?: Contract["key"];
        businessKey?: Business["key"];
        time: number;
        timeLeft: number;
    }>) => void;
    updateTimes: ({
        contractKey,
        businessKey,
    }: Readonly<{
        contractKey?: Contract["key"];
        businessKey?: Business["key"];
    }>) => void;
    removeTimes: ({
        contractKey,
        businessKey,
    }: Readonly<{
        contractKey?: Contract["key"];
        businessKey?: Business["key"];
    }>) => void;
}

