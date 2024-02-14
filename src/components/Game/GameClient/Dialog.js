"use client"

// React/Next------------------------------------------------------------------------
// Context---------------------------------------------------------------------------
import { useSession } from "next-auth/react";
// Stores----------------------------------------------------------------------------
import { useDebugModeStore, useFullScreenDialogStore } from "@/stores/game"
// Components------------------------------------------------------------------------
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/shadcn/ui/dialog"
import { Button } from "@/components/shadcn/ui/button"
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/components/GameDialog.module.css";
// Other-----------------------------------------------------------------------------
import { checkRoleAccessLevel } from "@/util";



//______________________________________________________________________________________
// ===== Component =====
export default function GameDialog({ }) {

    //______________________________________________________________________________________
    // ===== Context =====
    const { data: session, status} = useSession();



    //______________________________________________________________________________________
    // ===== Stores =====
    const debugMode = useDebugModeStore((state) => state.debugMode);
    const { 
        isOpen, 
        isFullScreen,
        isBorderNeon,
        isTextNeon,
        neonColor,
        className,
        title, 
        description, 
        content, 
        closeButtonText, 
        extraCloseFunction,
        toggleOpen, 
        setDialog, 
        resetDialog
    } = useFullScreenDialogStore((state) => state);



    //______________________________________________________________________________________
    // ===== Functions  =====
    const close = () => {
        extraCloseFunction();
        resetDialog();
    }



    //______________________________________________________________________________________
    // ===== Component Return  =====
    return <>
        {(checkRoleAccessLevel(session, "ADMIN") && debugMode) && <>
            <Button variant="link" onClick={()=>setDialog({ isOpen:true, content:"Hello World" })}>
                Debug Open Dialog
            </Button>
        </>}
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent 
                style={{ maxWidth:"unset", display:"unset" }} 
                className={`
                    ${isFullScreen ? "w-[96%] h-[85%]" : ""} 
                    ${isBorderNeon ? "neonBorder neonBoxShadowGlow" : ""} 
                    ${neonColor} 
                    ${className}
                `}
            >
                <DialogHeader className={`${isTextNeon ? "neonText neonTextGlow" : ""} ${neonColor}`}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                    {!(title || description) && <div className="py-3"/>}
                    {(title && (!description)) && <div className="py-1"/>}
                    {((!title) && description) && <div className="py-1"/>}
                </DialogHeader>
                <div className={`${styles.content} py-1`}>{content}</div>
                <DialogFooter>{/* className="sticky top-[200vh]" */}
                    <Button variant="neonWhiteWithGlow" type="submit" onClick={close}>
                        {closeButtonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}
