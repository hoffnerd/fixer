"use client"


// React/Next------------------------------------------------------------------------
import { useEffect } from "react";
import { useParams } from "next/navigation";
// Context---------------------------------------------------------------------------
// Stores----------------------------------------------------------------------------
import { useFullScreenDialogStore } from "@/stores/game";
// Hooks-----------------------------------------------------------------------------
import useSaveGame from "@/hooks/useSaveGame";
// Components------------------------------------------------------------------------
import Chapter0 from "@/components/story/Chapter0";
// Data------------------------------------------------------------------------------
import { defaultSaveData } from "@/data/defaultSaveData";
// Other-----------------------------------------------------------------------------
import { isArray, isObj } from "@/util";

//______________________________________________________________________________________
// ===== Component =====
export default function Events({ saveData }){

    //______________________________________________________________________________________
    // ===== URL Params  =====
    const params = useParams();
    const saveFileId = isObj(params, [ 'id' ]) ? params.id : null;



    //______________________________________________________________________________________
    // ===== Constants =====
    const { chapter, articles, notifications } = isObj(saveData) ? { ...defaultSaveData, ...saveData } : defaultSaveData;



    //______________________________________________________________________________________
    // ===== Stores =====
    const setDialog = useFullScreenDialogStore((state) => state.setDialog);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveGame } = useSaveGame();



    //______________________________________________________________________________________
    // ===== Use Effects =====

    useEffect(() => {
        if(!saveFileId) return;
        if(chapter !== 0) return;
        setDialog({ 
            isOpen: true,
            description: "Sometime after 2077, a message appears on holos all over Night City...",
            content: <Chapter0/>,
            extraCloseFunction: () => saveGame({ chapter: 1 })
        }); 
    }, [saveFileId, chapter]) 

    useEffect(() => {
        if(!saveFileId) return;
        if(chapter !== 1) return;
        if(!isObj(articles)) return;
        if(articles.n_0 !== 0) return;
        setTimeout(() => saveGame({ 
            articles: { ...defaultSaveData.articles, ...articles, n_0:1 },
            notifications: isArray(notifications) ? [ ...notifications, "n_0" ] : [ "n_0" ]
        }), 1000);
    }, [saveFileId, chapter, saveData]) 
    


    //______________________________________________________________________________________
    // ===== Component Return =====
    return;
        
}