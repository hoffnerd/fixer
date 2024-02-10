"use client"

// Stores------------------------------------------------------------------------
import { useResourceStore } from "@/stores/game";
// Components------------------------------------------------------------------------
import { CenterVertically } from "@/components/MicroComponents";



//______________________________________________________________________________________
// ===== Component  =====

export default function Resource ({ keyResource, display, component=true }) {
    const resource = useResourceStore((state) => state[keyResource])
    
    return <CenterVertically>{component && "⚙"}{display}: {resource}</CenterVertically>
}