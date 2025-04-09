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
    sessionTime: 0,
    isSessionTimerRunning: true,
    isGameSaving: false,
    inGameTime: 0,
    lastSavedTime: new Date(),
    activeMobilePanel: "resources",

    saveQueue: [],
    activeSaveQueueObj: null,
}



//______________________________________________________________________________________
// ===== Functions =====



//______________________________________________________________________________________
// ===== Store =====

export const useGameStore = create<GameStoreState & GameStoreFunctions>()((set) => ({
    ...DEFAULT_STORE,

    setStoreKeyValuePair: (obj) => set(() => ({ ...obj })),

    pushToSaveQueue: (saveQueueObj) => set((state) => ({ saveQueue: [ ...state.saveQueue, saveQueueObj ] })),
    activateSaveQueueObj: () => set((state) => {
        let clonedSaveQueue = structuredClone(state.saveQueue);
        let saveQueueObj = clonedSaveQueue.shift();
        return { 
            saveQueue: clonedSaveQueue,
            activeSaveQueueObj: saveQueueObj ?? null,
        }
    }),
    finishSaveQueueObj: () => set(() => ({ activeSaveQueueObj: null })),
}))