"use client"

// React/Next------------------------------------------------------------------------
import { useParams } from "next/navigation";
// ReactQuery------------------------------------------------------------------------
import { useReadSaveFile } from "@/rQuery/hooks/saveFile";
// Data------------------------------------------------------------------------------
import { defaultSaveData } from "@/data/defaultSaveData";
import { fullArticles } from "@/data/fullArticles";
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/game.module.css";
// Other-----------------------------------------------------------------------------
import { isArray, isObj } from "@/util";



//______________________________________________________________________________________
// ===== Component  =====
export default function Notifications () {

    //______________________________________________________________________________________
    // ===== URL Params  =====
    const params = useParams();
    const saveFileId = isObj(params, [ 'id' ]) ? params.id : null;



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { data:saveFile } = useReadSaveFile(saveFileId);
    const { saveData } = isObj(saveFile) ? saveFile : { saveData:null };
    const { notifications } = isObj(saveData) ? { ...defaultSaveData, ...saveData } : defaultSaveData;
    


    //______________________________________________________________________________________
    // ===== Render Functions =====
    const renderArticles = () => {
        if(!isArray(notifications)) return;

        notifications.forEach(notification => {
            
        });
    }



    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <ul>
            <li className={styles.notification}>--Text Message-- from Lux Quartz</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--News Article-- New Fixers Rise in Wake of the Lady of Westbrook Estate's Death</li>
            <li className={styles.notification}><hr/></li>
            <li className={styles.notification}>--Text Message-- from Lux Quartz</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--News Article-- New Fixers Rise in Wake of the Lady of Westbrook Estate's Death</li>
            <li className={styles.notification}><div className="border-2 neonBorder neonBoxShadowGlow blue"/></li>
            <li className={styles.notification}>--Text Message-- from Lux Quartz</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--News Article-- New Fixers Rise in Wake of the Lady of Westbrook Estate's Death</li>
            <li className={styles.notification}><hr/></li>
            <li className={styles.notification}>--Text Message-- from Lux Quartz</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--Text Message-- from Lynx Coan</li>
            <li className={styles.notification}>--News Article-- New Fixers Rise in Wake of the Lady of Westbrook Estate's Death</li>
        </ul>
    )
}