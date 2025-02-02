"use client"

// Types ----------------------------------------------------------------------------
import { type ActiveMobilePanels } from "@/types";
// Packages -------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Data -----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== True Constants =====

const BORDER = "border-4 rounded-3xl neonEffect neBorder neBorderGlow neColorPurple"



//______________________________________________________________________________________
// ===== Component =====

export default function Panel({ children, panelKey }: Readonly<{ children?: React.ReactNode; panelKey: ActiveMobilePanels; }>) {

    //______________________________________________________________________________________
    // ===== Stores =====
    const activeMobilePanel = useGameStore((state) => state.activeMobilePanel); 

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <div className={`hidden overflow-hidden lg:block ${activeMobilePanel === panelKey && "xs:block"} ${BORDER}`}>
            <div className={`h-full overflow-auto p-3`}>
                {children}
            </div>
        </div>
    );
}

