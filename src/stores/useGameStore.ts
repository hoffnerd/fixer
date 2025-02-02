"use client"

// Types ----------------------------------------------------------------------------
import { type GameStoreState, type GameStoreFunctions } from '@/types'
// Packages -------------------------------------------------------------------------
import { create } from 'zustand'
// Actions --------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Other ----------------------------------------------------------------------------




//______________________________________________________________________________________
// ===== True Constants =====

const DEFAULT_STORE: GameStoreState = {
    isGameSaving: false,
    inGameTime: 0,
    lastSavedTime: new Date(),
    activeMobilePanel: "resources",
}



//______________________________________________________________________________________
// ===== Functions =====



//______________________________________________________________________________________
// ===== Store =====

export const useGameStore = create<GameStoreState & GameStoreFunctions>()((set) => ({
    ...DEFAULT_STORE,

    setStoreKeyValuePair: (obj) => set(() => ({ ...obj })),
}))