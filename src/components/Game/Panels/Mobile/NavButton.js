"use client"

// Context---------------------------------------------------------------------------
import { useAppContext } from '@/context/AppContext';
// Components------------------------------------------------------------------------
import { Button } from "@/components/shadcn/ui/button";
import { Badge } from '@/components/shadcn/ui/badge';
// Other-----------------------------------------------------------------------------
import { renderFontAwesomeIcons } from "@/util/icons";



//______________________________________________________________________________________
// ===== Component =====
export default function NavButton({ panelKey, iconKey="", children }){

    //______________________________________________________________________________________
    // ===== Context =====
    const appContext = useAppContext();
    const { gameMobilePanelOpen, setGameMobilePanelOpen } = appContext



    //______________________________________________________________________________________
    // ===== Render Functions =====

    const renderBadge = () => {
        if(!appContext[`gameMobileNavBadge_${panelKey}`]) return;

        return (
            <Badge 
                variant="neonRedWithGlow"
                className="absolute top-0 left-7 max-[310px]:left-5"
            >
                {appContext[`gameMobileNavBadge_${panelKey}`]}
            </Badge>
        )
    }


    //______________________________________________________________________________________
    // ===== Component Return =====

    if(!panelKey) return;

    return (
        <Button variant={gameMobilePanelOpen === panelKey ? "" : "ghost"} className="h-14 w-full" onClick={()=>setGameMobilePanelOpen(panelKey)}>
            <div className="relative">
                {iconKey ? renderFontAwesomeIcons({ key:iconKey, className:"h-10" }) : children}
                {renderBadge()}
            </div>
        </Button>
    )
}