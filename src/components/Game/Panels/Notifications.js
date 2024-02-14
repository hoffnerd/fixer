"use client"

// React/Next------------------------------------------------------------------------
import { useParams } from "next/navigation";
// ReactQuery------------------------------------------------------------------------
import { useReadSaveFile } from "@/rQuery/hooks/saveFile";
// Stores----------------------------------------------------------------------------
import { useFullScreenDialogStore } from "@/stores/game";
// Data------------------------------------------------------------------------------
import { defaultSaveData } from "@/data/defaultSaveData";
import { fullArticles } from "@/data/fullArticles";
// Components------------------------------------------------------------------------
import Articles from "@/components/Articles";
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/game.module.css";
// Other-----------------------------------------------------------------------------
import { isArray, isObj } from "@/util";
import { Fragment } from "react";
import { Button } from "@/components/shadcn/ui/button";



//______________________________________________________________________________________
// ===== Constants  =====
const regex = /(.+)_(.+)/;


//______________________________________________________________________________________
// ===== Component  =====
export default function Notifications() {

    //______________________________________________________________________________________
    // ===== URL Params  =====
    const params = useParams();
    const saveFileId = isObj(params, [ 'id' ]) ? params.id : null;



    //______________________________________________________________________________________
    // ===== Stores =====
    const setDialog = useFullScreenDialogStore((state) => state.setDialog);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { data:saveFile } = useReadSaveFile(saveFileId);
    const { saveData } = isObj(saveFile) ? saveFile : { saveData:null };
    const { notifications } = isObj(saveData) ? { ...defaultSaveData, ...saveData } : defaultSaveData;
    


    //______________________________________________________________________________________
    // ===== On Click Functions =====

    const openDialog = (key) => setDialog({ 
        isOpen: true,
        title: "Articles",
        content: <Articles initialActiveKey={key} />
    }); 



    //______________________________________________________________________________________
    // ===== Render Functions =====

    const renderNotificationType = (type) => {
        switch (type) {
            case "news": return <span className="neonText neonTextGlow red"> News Article </span>;
            default: return;
        }
    }

    const renderNotificationButton = (detailsObj) => (
        <Button key={detailsObj.key} variant="link" style={{ whiteSpace:"unset" }} onClick={()=>openDialog(detailsObj.key)}>
            <span>--{renderNotificationType(detailsObj.type)}-- {detailsObj.display}</span>
        </Button>
    )

    const renderArticleNotification = (key) => {
        const detailsObj = isObj(fullArticles, [key]) ? fullArticles[key] : null;
        if(!isObj(detailsObj, [ "key", "type" ])) return;
        return renderNotificationButton(detailsObj);
    }



    //______________________________________________________________________________________
    // ===== Component Return =====
    if(!isArray(notifications)) return;

    let notificationsToRender = [];
    notifications.forEach(notification => {
        const extracted = regex.exec(notification);
        if(!isArray(extracted)) return;

        switch (extracted[1]) {
            case "n": notificationsToRender.push( renderArticleNotification(notification) );
            default: return;
        }
    });
    return notificationsToRender;
}