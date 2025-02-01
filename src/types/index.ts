import { type SaveFile as SaveFilePrisma } from "@prisma/client";



//______________________________________________________________________________________
// ===== Resources =====

export interface Resources {
    euros: number;
    weapons: number;
    techs: number;
    hacks: number;
}

export interface ResourceRewards {
    euros?: number;
    weapons?: number;
    techs?: number;
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
}

export interface Mercs {
    [key: Merc["key"]]: Merc;
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
    mercSlots?: {
        manager?: BusinessMercSlot,
        security?: BusinessMercSlot,
    };

}

export interface Businesses {
    [key: Business["key"]]: Business;
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

export interface Contracts {
    [key: Contract["key"]]: Contract;
}



//______________________________________________________________________________________
// ===== SaveFile =====

export interface SaveFile extends Omit<SaveFilePrisma, 'resources' | 'mercs' | 'businesses' | 'contracts'> {
    resources: Resources;
    mercs: Mercs;
    businesses: Businesses;
    contracts: Contracts;
}