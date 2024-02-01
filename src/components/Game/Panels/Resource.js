"use client"

// Components------------------------------------------------------------------------
import { useAppContext } from "@/context/AppContext";
// Components------------------------------------------------------------------------
import { CenterVertically } from "@/components/MicroComponents";



//______________________________________________________________________________________
// ===== Component  =====
export default function Resource ({ keyResource, display, component=true }) {
    console.log({ trace:"Resource", keyResource, display, component });
    
    const appContext = useAppContext();
    
    return <CenterVertically>{component && "⚙"}{display}: {appContext[`gameResources_${keyResource}`]}</CenterVertically>
}