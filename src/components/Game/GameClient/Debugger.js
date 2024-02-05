"use client"

// Packages--------------------------------------------------------------------------
import { useSession } from "next-auth/react";
// Stores---------------------------------------------------------------------------
import { useDebugModeStore } from "@/stores/game";
// Components------------------------------------------------------------------------
import { Button } from "@/components/shadcn/ui/button";
// Other-----------------------------------------------------------------------------
import { checkRoleAccessLevel } from "@/util";
import { renderFontAwesomeIcons } from "@/util/icons";


//______________________________________________________________________________________
// ===== Component =====
export default function Debugger({ children }){

    //______________________________________________________________________________________
    // ===== Context =====
    const { data:session, status} = useSession();



    //______________________________________________________________________________________
    // ===== Stores =====
    const { debugMode, toggleDebugMode } = useDebugModeStore((state) => state)

    

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <div className="absolute">
            {checkRoleAccessLevel(session, "ADMIN") && <>
                <Button variant="ghost" onClick={toggleDebugMode}>
                    {renderFontAwesomeIcons({ key:"faScrewdriverWrench", className:"h-10" })}
                </Button>
            </>}
            <div className={checkRoleAccessLevel(session, "ADMIN") && debugMode ? "bg-background p-5" : ""}>
                {children}
            </div>
        </div>
    )
        
}