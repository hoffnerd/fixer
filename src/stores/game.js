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



export const useInGameTimeStore = create((set) => ({
    inGameTime: 0,
    setInGameTime: (inGameTime) => set(() => ({ inGameTime })),
}))



export const useResourceStore = create((set) => ({
    e: 0,
    w: 0,
    t: 0,
    q: 0,
    setResource: (key, amount) => set(() => ({ [key]: amount })),
    alterResource: (key, amount) => set((state) => ({ [key]: state[key] + amount })),
}))