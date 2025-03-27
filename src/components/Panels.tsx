"use client"

// Types ----------------------------------------------------------------------------
import { type ActiveMobilePanels } from "@/types";
// Packages -------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
import { Button } from "./shadcn/ui/button";
import { useSaveFile } from "@/hooks/useSaveFile";
// Data -----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== True Constants =====

const BORDER = "border-4 rounded-3xl neonEffect neBorder neBorderGlow neColorPurple"

const PANEL_BUTTON_CONFIGS = {
    resources: { buttonText: "Buy More Businesses" },
    mercs: { buttonText: "Find More Mercs" },
    contracts: { buttonText: "Find More Contracts" }, 
    other: { buttonText:"" },
}



//______________________________________________________________________________________
// ===== Micro-Components =====

function PanelButton({ panelKey }: Readonly<{ panelKey: ActiveMobilePanels; }>) {
    const { buttonText } = PANEL_BUTTON_CONFIGS[panelKey];
    const { saveFileId } = useSaveFile();
    const isGameSaving = useGameStore((state) => state.isGameSaving); 
    const onClick = () => {
        if(!saveFileId) return;
        // if(panelKey === "mercs") addRandomMercMutation.mutate(saveFileId);
    };
    return (
        <div className="absolute bottom-0 left-0 w-full">
            <Button 
                size="lg" 
                variant="neonEffectWithGlow" 
                className="neColorPurple w-full rounded-none"
                onClick={onClick}
                disabled={isGameSaving}
            >
                {buttonText}
            </Button>
        </div>
    )
}



//______________________________________________________________________________________
// ===== Component =====

export default function Panel({ children, panelKey }: Readonly<{ children?: React.ReactNode; panelKey: ActiveMobilePanels; }>) {

    //______________________________________________________________________________________
    // ===== Stores =====
    const activeMobilePanel = useGameStore((state) => state.activeMobilePanel); 

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <div className={`hidden overflow-hidden lg:block ${activeMobilePanel === panelKey && "xs:block"} ${BORDER} relative`}>
            <div className={`h-full overflow-auto p-3 pb-11`}>
                {children}
                <PanelButton panelKey={panelKey}/>
            </div>
        </div>
    );
}