"use client"


// React/Next------------------------------------------------------------------------
import { useEffect } from "react";
// Context---------------------------------------------------------------------------
// Stores----------------------------------------------------------------------------
import { useFullScreenDialogStore, useSaveFileIdStore } from "@/stores/game";
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
    // ===== Constants =====
    const { chapter, articles } = saveData ? { ...defaultSaveData, ...saveData } : defaultSaveData;



    //______________________________________________________________________________________
    // ===== Stores =====
    const setDialog = useFullScreenDialogStore((state) => state.setDialog);
    const saveFileId = useSaveFileIdStore((state) => state.saveFileId);



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

    // useEffect(() => {
    //     if(!saveFileId) return;
    //     if(chapter !== 1) return;
    //     if(!isArray(articles)) return;
    //     if(articles[0] !== 0) return;
    //     setTimeout(() => {
    //         let newArticles = [ ...defaultSaveData.articles, ...articles ];
    //         newArticles[0] = 1;
    //         saveGame({ newsArticles: newArticles })
    //     }, 1000);
    // }, [saveFileId, chapter, saveData]) 
    


    //______________________________________________________________________________________
    // ===== Component Return =====
    return;
        
}