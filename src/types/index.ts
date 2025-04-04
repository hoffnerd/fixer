import { type SaveFile as SaveFilePrisma } from "@prisma/client";



//______________________________________________________________________________________
// ===== GenericObject =====

export type GenericObject = Record<string, unknown>;



//______________________________________________________________________________________
// ===== Resources =====

export interface Resources {
    euros: number;
    weapons: number;
    medicals: number;
    hacks: number;
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
}

export type Mercs = Record<Merc["key"], Merc>;



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



//______________________________________________________________________________________
// ===== SaveFile =====

export interface SaveFile extends Omit<SaveFilePrisma, 'resources' | 'mercs' | 'businesses' | 'contracts'> {
    resources: Resources;
    mercs: Mercs;
    businesses: Businesses;
    contracts: Contracts;
}

export interface SaveFileOptional {
    id?: string;
    xp?: number;
    resources?: Resources;
    mercs?: Mercs;
    businesses?: Businesses;
    contracts?: Contracts;
    inGameTime?: number;
    createdAt?: Date;
    updatedAt?: Date;
}



//______________________________________________________________________________________
// ===== Stores =====

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
}

export interface GameStoreFunctions {
    setStoreKeyValuePair: (obj: GameStoreStateOptional) => void;
}

