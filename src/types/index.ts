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

export interface MercLevels {
    corpo: number;
    solo: number;
    tech: number;
}

export interface Merc {
    key: string;
    display: string;
    levels: MercLevels;
    unusedLevels: number;
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
    isGameSaving?: boolean;
    inGameTime?: number;
    lastSavedTime?: Date;
    activeMobilePanel?: ActiveMobilePanels;
}

export interface GameStoreState {
    isGameSaving: boolean;
    inGameTime: number;
    lastSavedTime: Date;
    activeMobilePanel: ActiveMobilePanels;
}

export interface GameStoreFunctions {
    setStoreKeyValuePair: (obj: GameStoreStateOptional) => void;
}

