import { type SaveFile as SaveFilePrisma } from "@prisma/client";



//______________________________________________________________________________________
// ===== GenericObject =====

export type GenericObject = Record<string, unknown>;



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

export type MercSlot = "main" | "manager" | "security" | "unassign";

export interface MercSlotObject {
    type: MercAssignType;
    slot: MercSlot;
    contractKey?: Contract["key"];
    businessKey?: Business["key"];
}

export interface MercRoleLevels {
    corpo: number;
    solo: number;
    tech: number;
}

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

export interface BusinessMercSlot {
    key: Merc["key"];
}

export interface Business {
    key: string;
    display: string;
    description?: string;
    income: ResourceRewards;
    time: number;
    xp: number;
    mercSlots?: {
        manager?: BusinessMercSlot,
        security?: BusinessMercSlot,
    };

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

export interface ContractType {
    display: string;
    dangerLevel: number;
    roles: Record<keyof MercRoleLevels, ContractRole>;
}

export type ContractTypeKey = "specialDelivery" | "agentSaboteur" | "gunForHire" | "thievery" | "sos" | "cyberpsycho";

export type ContractTypes = Record<ContractTypeKey, ContractType>;

export interface ContractMercSlot {
    key: Merc["key"];
}

export interface Contract {
    key: string; // `${createdAt.getTime()}_${generationIndex}`
    createdAt: Date;
    generationIndex: number;
    type: ContractTypeKey;
    innateRole: keyof MercRoleLevels;
    innateSubRole: keyof MercRoleLevels;
    roleLevels: MercRoleLevels;
    stage: "unsigned" | "signed" | "researching" | "inProgress" | "completed";
    client: string;
    xp: number;
    visualLevel: number;
    display: string;
    roleDisplay: string
    description?: string;
    rewards: ResourceRewards;
    time: number;
    mercSlots: {
        main?: ContractMercSlot | null;
    };
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
    'resources' | 'mercs' | 'businesses' | 'contracts' | 'potentialMercs' | 'potentialBusinesses' | 'potentialContracts' | 'flags'
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
    xp?: number;
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
        | "regenerateContractsMutation"
        | "cancelContractMutation"

        ;
    props?: {
        income?: ResourceRewards;
        assignType?: "contract" | "business"
        slot?: MercSlot
        mercKey?: string;
        contractKey?: string;
        businessKey?: string;
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
    saveQueue: Array<SaveQueueObj>;
    activeSaveQueueObj: SaveQueueObj | null;
}

export interface GameStoreFunctions {
    setStoreKeyValuePair: (obj: GameStoreStateOptional) => void;
    pushToSaveQueue: (saveQueueObj: SaveQueueObj) => void;
    activateSaveQueueObj: () => void;
    finishSaveQueueObj: () => void;
}

