"use client"

// Stores------------------------------------------------------------------------
// import { useAppContext } from "@/context/AppContext";
import { useResourceStore } from "@/stores/game";
// Components------------------------------------------------------------------------
import { CenterVertically } from "@/components/MicroComponents";
import { useEffect } from "react";



//______________________________________________________________________________________
// ===== Component  =====

export default function Resource ({ keyResource, display, component=true }) {
    const resource = useResourceStore((state) => state[keyResource])
    
    return <CenterVertically>{component && "⚙"}{display}: {resource}</CenterVertically>
}



// export default function Resource ({ keyResource, display, component=true }) {
//     console.log({ trace:"Resource", keyResource});
    
//     const appContext = useAppContext();
    
//     return <CenterVertically>{component && "⚙"}{display}: {appContext[`gameResources_${keyResource}`]}</CenterVertically>
// }