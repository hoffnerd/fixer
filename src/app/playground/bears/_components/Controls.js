"use client"

import { useBearStore } from "./store"

export default function Controls() {
    const increasePopulation = useBearStore((state) => state.increasePopulation)
    return <button onClick={increasePopulation}>one up</button>
}