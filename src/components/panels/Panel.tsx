"use client"

// Types ----------------------------------------------------------------------------
import { type ActiveMobilePanels } from "@/types";
// Packages -------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
import { Button } from "../shadcn/ui/button";
import { useSaveFile } from "@/hooks/useSaveFile";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../shadcn/ui/sheet";
import { EntityCarousel } from "../EntityCarousel";
import { ReadableTime } from "@/_legoBlocks/nextjsCommon/components/microComponents";
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
        sheetSide: "bottom",
        sheetTitle: "Businesses Available to Buy",
        sheetDescription: "until the next Businesses are available to buy."
    },
    mercs: { 
        buttonText: "Hire More Mercs",
        sheetSide: "bottom",
        sheetTitle: "Mercs Available to Hire",
        sheetDescription: "until the next Mercs are available to hire."
    },
    contracts: { 
        buttonText: "Find More Contracts",
        sheetSide: "bottom",
        sheetTitle: "Contracts Available to Sign",
        sheetDescription: "until the next Contracts are available to sign."
    }, 
    other: { 
        buttonText: "",
        sheetSide: "top",
        sheetTitle: "",
        sheetDescription: ""
    },
}



//______________________________________________________________________________________
// ===== Pure Functions =====

const panelKeyToEntityType = (panelKey: ActiveMobilePanels) => {
    switch (panelKey) {
        case "resources": return "businesses";
        case "contracts": return "contracts";
        default: return "mercs";
    }
}



//______________________________________________________________________________________
// ===== Micro-Components =====

function TimeDisplay(){
    const { saveFile } = useSaveFile();
    const sessionTime = useGameStore((state) => state.sessionTime);
    if(saveFile?.potentialMercs?.regeneratedTime === undefined) return <></>;
    return <ReadableTime timeInSeconds={saveFile.potentialMercs.regeneratedTime - (sessionTime % saveFile.potentialMercs.regeneratedTime)} />
}

function PanelButton({ panelKey }: Readonly<{ panelKey: ActiveMobilePanels; }>) {
    const { buttonText, sheetSide, sheetTitle, sheetDescription } = PANEL_BUTTON_CONFIGS[panelKey];
    const isGameSaving = useGameStore((state) => state.isGameSaving); 
    return (
        <Sheet>
            <div className="absolute bottom-0 left-0 w-full">
                <SheetTrigger asChild>
                    <Button 
                        size="lg" 
                        variant="neonEffectWithGlow" 
                        className="neColorPurple w-full rounded-none"
                        disabled={isGameSaving}
                    >
                        {buttonText}
                    </Button>
                </SheetTrigger>
            </div>
            <SheetContent side={sheetSide}>
                <SheetHeader>
                    <SheetTitle className="flex justify-center">{sheetTitle}</SheetTitle>
                    <SheetDescription className="flex justify-center">
                        <TimeDisplay />
                        {` `}{sheetDescription}
                    </SheetDescription>
                </SheetHeader>
                <div className="flex justify-center">
                    <div className="w-[1400px]">
                        <div className="flex justify-center">
                            <EntityCarousel type={panelKeyToEntityType(panelKey)} />
                        </div>
                    </div>
                </div>
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
            <div className={`h-full overflow-auto p-3 pb-11 neonEffect neScrollBar neColorPurple`}>
                {children}
                <PanelButton panelKey={panelKey}/>
            </div>
        </div>
    );
}