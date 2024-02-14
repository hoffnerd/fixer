"use client"


// React/Next------------------------------------------------------------------------
import { useEffect } from "react";
import { useParams } from "next/navigation";
// Context---------------------------------------------------------------------------
// Stores----------------------------------------------------------------------------
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
    // ===== URL Params  =====
    const params = useParams();
    const saveFileId = isObj(params, [ 'id' ]) ? params.id : null;



    //______________________________________________________________________________________
    // ===== Constants =====
    const { articles, notifications } = isObj(saveData) ? { ...defaultSaveData, ...saveData } : defaultSaveData;



    //______________________________________________________________________________________
    // ===== Stores =====



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveGame } = useSaveGame();



    //______________________________________________________________________________________
    // ===== Use Effects =====
    
    useEffect(() => {
        if(!saveFileId) return;
        if(!isObj(articles)) return;
        
        let articleNotificationsToAdd = [];

        Object.keys(articles).forEach((key) => {
            const article = articles[key];
            if(article === 0) return;

            let shouldAddArticleToNotifications = true;
            
            if(isArray(notifications)){
                for (let i = 0; i < notifications.length; i++) {
                    const notification = notifications[i];
                    if(notification === key){
                        shouldAddArticleToNotifications = false;
                        break;
                    }
                }
            }

            if(shouldAddArticleToNotifications){
                console.log({ trace:"Notifications adder process", key, article });
                articleNotificationsToAdd.push(key);
            }
        });

        if(!isArray(articleNotificationsToAdd)) return;

        saveGame({ notifications: [ ...notifications, ...articleNotificationsToAdd ] })
    }, [saveFileId, articles])
    


    //______________________________________________________________________________________
    // ===== Component Return =====
    return;
        
}