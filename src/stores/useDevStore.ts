"use client"

// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
import { create } from 'zustand'
// Actions --------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Other ----------------------------------------------------------------------------
import { getComps, getEuros, getJobShare, type HandleScalingOptions, type ScalingCallback } from '@/utils/scaling';



//______________________________________________________________________________________
// ===== Stores =====

export type DevHighlightColor = "purple" | "blue" | "yellow" | "green" | "pink" | "red" | "orange" | "white";

interface DevStoreStateOptional {
    playerLevelMin?: number;
    playerLevelMax?: number;
    entityLevelMin?: number;
    entityLevelMax?: number;
    highlightColor?: DevHighlightColor;
    highlights? : Record<DevHighlightColor, Array<string>>;
    selectedScales?: Array<keyof typeof DEV_SCALES>;
}

interface DevStoreState {
    playerLevelMin?: number;
    playerLevelMax?: number;
    entityLevelMin?: number;
    entityLevelMax?: number;
    highlightColor: DevHighlightColor;
    highlights : Record<DevHighlightColor, Array<string>>;
    selectedScales: Array<DevScaleKey>;
}

interface DevStoreFunctions {
    reset: () => void;
    setStoreKeyValuePair: (obj: DevStoreStateOptional) => void;
}

type DevScaleKey = "levels" | "euroSmall" | "euroMedium" | "euroLarge" | "compSmall" | "compMedium" | "compLarge" | "jobShare";

export interface DevScale {
    display: string;
    callback?: ScalingCallback;
    options: HandleScalingOptions;
}

export type DevScales = Record<DevScaleKey, DevScale>;




//______________________________________________________________________________________
// ===== True Constants =====

export const DEV_SCALES: DevScales = {
    levels: {
        display: "Levels",
        options: {},
    },
    euroSmall: {
        display: "Euro (Small)",
        callback: getEuros,
        options: { scale: "small" },
    },
    euroMedium: {
        display: "Euro (Medium)",
        callback: getEuros,
        options: { scale: "medium" },
    },
    euroLarge: {
        display: "Euro (Large)",
        callback: getEuros,
        options: { scale: "large" },
    },
    compSmall: {
        display: "Comp (Small)",
        callback: getComps,
        options: { scale: "small" },
    },
    compMedium: {
        display: "Comp (Medium)",
        callback: getComps,
        options: { scale: "medium" },
    },
    compLarge: {
        display: "Comp (Large)",
        callback: getComps,
        options: { scale: "large" },
    },
    jobShare: {
        display: "Job Share",
        callback: getJobShare,
        options: {},
    },
}

export const DEFAULT_DEV_STORE: DevStoreState = {
    playerLevelMin: 0,
    playerLevelMax: 10,
    entityLevelMin: 0,
    entityLevelMax: 10,
    highlightColor: "purple",
    highlights: {
        purple: [],
        blue: [],
        yellow: [],
        green: [],
        pink: [],
        red: [],
        orange: [],
        white: [],
    },
    selectedScales: ["levels"],
}



//______________________________________________________________________________________
// ===== Functions =====



//______________________________________________________________________________________
// ===== Store =====

export const useDevStore = create<DevStoreState & DevStoreFunctions>()((set) => ({
    ...DEFAULT_DEV_STORE,

    reset: () => set(() => ({ ...DEFAULT_DEV_STORE })),

    setStoreKeyValuePair: (obj) => set(() => ({ ...obj })),
}))