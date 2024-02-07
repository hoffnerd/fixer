"use client"

import { create } from 'zustand'



export const useDebugModeStore = create((set) => ({
    debugMode: false,
    toggleDebugMode: () => set((state) => ({ debugMode: !state.debugMode })),
}))



export const useSaveFileIdStore = create((set) => ({
    saveFileId: null,
    setSaveFileId: (saveFileId) => set(() => ({ saveFileId })),
}))



export const useGameSavingStore = create((set) => ({
    gameSaving: false,
    toggleGameSaving: () => set((state) => ({ gameSaving: !state.gameSaving })),
    saveGame: async (id, inGameTime, additionalSaveData) => {
        
    }
}))



export const useInGameTimeStore = create((set) => ({
    inGameTime: 0,
    lastSavedTime: 0,
    setInGameTime: (inGameTime) => set(() => ({ inGameTime })),
    setLastSavedTime: (lastSavedTime) => set(() => ({ lastSavedTime })),
}))



export const useResourceStore = create((set) => ({
    e: 0,
    w: 0,
    t: 0,
    q: 0,
    setResource: (key, amount) => set(() => ({ [key]: amount })),
    alterResource: (key, amount) => set((state) => ({ [key]: state[key] + amount })),
}))