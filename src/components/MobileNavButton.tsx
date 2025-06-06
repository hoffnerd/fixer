"use client";

// Types ----------------------------------------------------------------------------=
import { type ActiveMobilePanels } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Components -----------------------------------------------------------------------
import { Button } from "./shadcn/ui/button";
// Other ----------------------------------------------------------------------------

//______________________________________________________________________________________
// ===== Components =====

export default function MobileNavButton({
    children,
    panelKey,
}: Readonly<{ 
    children?: React.ReactNode; 
    panelKey: ActiveMobilePanels 
}>) {
    //______________________________________________________________________________________
    // ===== Stores =====
    const setStoreKeyValuePair = useGameStore((state) => state.setStoreKeyValuePair);



    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <Button
            variant="ghost"
            className="h-full w-1/4 *:!h-1/2 *:!w-1/2"
            onClick={() => setStoreKeyValuePair({ activeMobilePanel: panelKey })}
        >
            {children}
        </Button>
    );
}
