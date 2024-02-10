"use client"


// React/Next------------------------------------------------------------------------
import { useEffect } from "react";
// rQuery----------------------------------------------------------------------------
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateSaveFile } from "@/rQuery/hooks/saveFile";
// Context---------------------------------------------------------------------------
// Stores---------------------------------------------------------------------------
import { useFullScreenDialogStore } from "@/stores/game";
// Components------------------------------------------------------------------------
import Chapter0 from "@/components/story/Chapter0";
// Data------------------------------------------------------------------------------
import { defaultSaveData } from "@/data/defaultSaveData";
// Other-----------------------------------------------------------------------------
import { isObj } from "@/util";

//______________________________________________________________________________________
// ===== Component =====
export default function Events({ saveData }){

    //______________________________________________________________________________________
    // ===== Constants =====
    const { chapter } = saveData ? { ...defaultSaveData, ...saveData } : defaultSaveData;



    //______________________________________________________________________________________
    // ===== React Query =====
    const queryClient = useQueryClient()
    const { mutate } = useUpdateSaveFile();


    //______________________________________________________________________________________
    // ===== Stores =====
    const setDialog = useFullScreenDialogStore((state) => state.setDialog);



    //______________________________________________________________________________________
    // ===== Use Effects =====

    useEffect(() => {
        if(chapter !== 0) return;
        setDialog({ 
            isOpen: true,
            description: "Sometime after 2077, a message appears on holos everywhere...",
            content: <Chapter0/>,
            extraCloseFunction: () => {

            }
        });
    }, [chapter])
    


    //______________________________________________________________________________________
    // ===== Component Return =====
    return;
        
}