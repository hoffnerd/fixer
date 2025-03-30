"use client"

// Types ----------------------------------------------------------------------------
import { type ActiveMobilePanels } from "@/types";
// Packages -------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
import { Button } from "../shadcn/ui/button";
import { useSaveFile } from "@/hooks/useSaveFile";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../shadcn/ui/sheet";
// Data -----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Types =====

interface PanelButtonConfig{
    buttonText: string;
    sheetSide: "top" | "right" | "bottom" | "left";
    sheetTitle: string;
    sheetDescription: string;
}

type PanelButtonConfigs = Record<ActiveMobilePanels, PanelButtonConfig>;



//______________________________________________________________________________________
// ===== True Constants =====

const BORDER = "border-4 rounded-3xl neonEffect neBorder neBorderGlow neColorPurple"

const PANEL_BUTTON_CONFIGS: PanelButtonConfigs = {
    resources: { 
        buttonText: "Buy More Businesses",
        sheetSide: "left",
        sheetTitle: "Businesses Available to Buy",
        sheetDescription: "These businesses are available to purchase.",
    },
    mercs: { 
        buttonText: "Find More Mercs",
        sheetSide: "bottom",
        sheetTitle: "Mercs Available to Hire",
        sheetDescription: "These mercs are available to hire.",
    },
    contracts: { 
        buttonText: "Find More Contracts",
        sheetSide: "right",
        sheetTitle: "Contracts Available to Sign",
        sheetDescription: "These contracts are available to sign.",
    }, 
    other: { 
        buttonText: "",
        sheetSide: "top",
        sheetTitle: "",
        sheetDescription: "",
    },
}



//______________________________________________________________________________________
// ===== Micro-Components =====

function PanelButton({ panelKey }: Readonly<{ panelKey: ActiveMobilePanels; }>) {
    const { buttonText, sheetSide, sheetTitle, sheetDescription } = PANEL_BUTTON_CONFIGS[panelKey];
    const { saveFileId } = useSaveFile();
    const isGameSaving = useGameStore((state) => state.isGameSaving); 
    const onClick = () => {
        if(!saveFileId) return;
        // if(panelKey === "mercs") addRandomMercMutation.mutate(saveFileId);
    };
    return (
        <Sheet>
            <div className="absolute bottom-0 left-0 w-full">
                <SheetTrigger asChild>
                    <Button 
                        size="lg" 
                        variant="neonEffectWithGlow" 
                        className="neColorPurple w-full rounded-none"
                        onClick={onClick}
                        disabled={isGameSaving}
                    >
                        {buttonText}
                    </Button>
                </SheetTrigger>
            </div>
            <SheetContent side={sheetSide}>
                <SheetHeader>
                    <SheetTitle>{sheetTitle}</SheetTitle>
                    <SheetDescription>{sheetDescription}</SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
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