"use client"

// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Data -----------------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import Portal from "@/_legoBlocks/nextjsCommon/components/Portal";
import { Button } from "../shadcn/ui/button";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function GameStorePortals(){

    //______________________________________________________________________________________
    // ===== Stores =====
    const gameStore = useGameStore((state) => state);

    //______________________________________________________________________________________
    // ===== Component Return =====
    return <>
        <Portal targetElementId="debuggerContent" childElementId="GameStorePortals.gameStore.activeMobilePanel">
            <ul id="GameStorePortals.gameStore.activeMobilePanel" className="list-disc ml-5">
                <li><strong>gameStore.activeMobilePanel: </strong> {gameStore?.activeMobilePanel}</li>
            </ul>
        </Portal>
        <Portal targetElementId="debuggerCommands" childElementId="GameStorePortals.commands">
            <div id="GameStorePortals.commands" className="flex flex-col">
                <Button
                    variant="neonEffect"
                    className="neColorBlue"
                    onClick={()=>console.log({ trace:"GameStorePortals", gameStore })}
                >
                    Log Game Store
                </Button>
            </div>
        </Portal>
    </>;
}
