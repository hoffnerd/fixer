import { type SaveFile as SaveFilePrisma } from "@prisma/client";



//______________________________________________________________________________________
// ===== GenericObject =====

export type GenericObject = Record<string, unknown>;



//______________________________________________________________________________________
// ===== Resources =====

export interface ResourcesExist {
    euros: number;
    weapons: number;
    medicals: number;
    hacks: number;
}

export interface Resources {
    euros?: number;
    weapons?: number;
    medicals?: number;
    hacks?: number;
}

export interface ResourceRewards {
    euros?: number;
    weapons?: number;
    medicals?: number;
    hacks?: number;
    xp?: number;
}



//______________________________________________________________________________________
// ===== Mercs =====

export interface MercRoleLevels {
    corpo: number;
    solo: number;
    tech: number;
}

export interface Merc {
    key: string;
    display: string;
    innateRole: keyof MercRoleLevels;
    innateSubRole?: keyof MercRoleLevels;
    roleLevels: MercRoleLevels;
    xp: number;
    initialCost: Resources;
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

export interface ContractMercAssigned {
    key: Merc["key"];
}

export type ContractMercsAssigned = Array<ContractMercAssigned>

export interface Contract {
    key: string;
    display: string;
    description?: string;
    rewards: ResourceRewards;
    time: number;
    mercsAssigned?: ContractMercsAssigned;
}

export type Contracts = Record<Contract["key"], Contract>;

export interface PotentialContracts {
    regeneratedTime: number;
    contracts?: Contracts;
}



//______________________________________________________________________________________
// ===== SaveFile =====

export interface SaveFile extends Omit<
    SaveFilePrisma, 
    'resources' | 'mercs' | 'businesses' | 'contracts' | 'potentialMercs' | 'potentialBusinesses' | 'potentialContracts'
> {
    resources: Resources;
    mercs: Mercs;
    businesses: Businesses;
    contracts: Contracts;
    potentialMercs: PotentialMercs;
    potentialBusinesses: PotentialBusinesses;
    potentialContracts: PotentialContracts;
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
    inGameTime?: number;
    createdAt?: Date;
    updatedAt?: Date;
}



//______________________________________________________________________________________
// ===== Actions =====



//______________________________________________________________________________________
// ===== Stores =====

export interface SaveQueueObj {
    mutationKey: "hireMercMutation" | "updateResourcesMutation" | "regenerateMercsMutation";
    props?: {
        income?: ResourceRewards;
        mercKey?: string;
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

