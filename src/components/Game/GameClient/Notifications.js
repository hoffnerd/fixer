"use client"


// React/Next------------------------------------------------------------------------
import { useEffect } from "react";
// Context---------------------------------------------------------------------------
// Stores----------------------------------------------------------------------------
import { useSaveFileIdStore } from "@/stores/game";
// Hooks-----------------------------------------------------------------------------
import useSaveGame from "@/hooks/useSaveGame";
// Components------------------------------------------------------------------------
// Data------------------------------------------------------------------------------
import { defaultSaveData } from "@/data/defaultSaveData";
// Other-----------------------------------------------------------------------------
import { isArray, isObj } from "@/util";

//______________________________________________________________________________________
// ===== Component =====
export default function Notifications({ saveData }){

    //______________________________________________________________________________________
    // ===== Constants =====
    const { articles, notifications } = isObj(saveData) ? { ...defaultSaveData, ...saveData } : defaultSaveData;



    //______________________________________________________________________________________
    // ===== Stores =====
    const saveFileId = useSaveFileIdStore((state) => state.saveFileId);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveGame } = useSaveGame();



    //______________________________________________________________________________________
    // ===== Use Effects =====
    
    useEffect(() => {
        if(!saveFileId) return;
        if(!isArray(articles)) return;
        
        let articleNotificationsToAdd = [];

        articles.forEach((article, index) => {
            if(article === 0) return;

            const notificationToCheck = `a_${index}`;
            console.log({ trace:"Notifications > useEffect", article, index, notificationToCheck });

            let shouldAddArticleToNotifications = true;

            if(isArray(notifications)){
                for (let i = 0; i < notifications.length; i++) {
                    const notification = notifications[i];
                    if(notification === notificationToCheck){
                        shouldAddArticleToNotifications = false;
                        break;
                    }
                }
            }

            shouldAddArticleToNotifications && articleNotificationsToAdd.push(notificationToCheck);
        });
    }, [saveFileId, articles])
    


    //______________________________________________________________________________________
    // ===== Component Return =====
    return;
        
}