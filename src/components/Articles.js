"use client"


// React/Next------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// ReactQuery------------------------------------------------------------------------
import { useReadSaveFile } from "@/rQuery/hooks/saveFile";
// Context---------------------------------------------------------------------------
// Stores----------------------------------------------------------------------------
import { useFullScreenDialogStore } from "@/stores/game";
// Hooks-----------------------------------------------------------------------------
import useSaveGame from "@/hooks/useSaveGame";
// Components------------------------------------------------------------------------
import CardButton from "./CardButton";
import { CenterVertically } from "./MicroComponents";
import ComboBox from "./ComboBox";
// Data------------------------------------------------------------------------------
import { defaultSaveData } from "@/data/defaultSaveData";
import { fullArticles } from "@/data/fullArticles";
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/components/InnerDialog.module.css";
// Other-----------------------------------------------------------------------------
import { convertObjToArray, isArray, isObj } from "@/util";

//______________________________________________________________________________________
// ===== Component =====
export default function Articles({ initialActiveKey=null }){

    //______________________________________________________________________________________
    // ===== URL Params  =====
    const params = useParams();
    const saveFileId = isObj(params, [ 'id' ]) ? params.id : null;



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { data:saveFile } = useReadSaveFile(saveFileId);
    const { saveData } = isObj(saveFile) ? saveFile : { saveData:null };
    const { articles } = isObj(saveData) ? { ...defaultSaveData, ...saveData } : defaultSaveData;



    //______________________________________________________________________________________
    // ===== State =====
    const [activeKey, setActiveKey] = useState(initialActiveKey);

    

    //______________________________________________________________________________________
    // ===== Render Functions =====

    const renderContent = () => {
        if(!activeKey) return (
            <CenterVertically className="text-center">
                <p>Select an article to read</p>
            </CenterVertically>
        )

        const { display, content } = fullArticles[activeKey];
        return <>
            <h3 className="text-xl sticky top-[-1px] bg-background p-2 hiddenOnMobile">{display}</h3>
            <br className="hiddenOnMobile"/>
            <div className={styles.main}>{content}</div>
        </>
    }

    const renderCardButtons = () => {
        if(!(isObj(articles) && isArray(Object.keys(articles)))) return;

        return Object.keys(articles).map(articleKey => (
            <div key={articleKey} className="p-2">
                <CardButton
                    onClick={() => setActiveKey(articleKey === activeKey ? null : articleKey)}
                    title="New Fixers Rise in Wake of the Lady of Westbrook Estate's Death"
                    className={articleKey === activeKey ? "bg-slate-700" : ""}
                />
            </div>
        ))        
    }


    //______________________________________________________________________________________
    // ===== Component Return =====
    return(
        <div className={styles.container}>
            <aside>
                <div className="hiddenOnMobile">{renderCardButtons()}</div>
                <div className="hiddenOnTablet hiddenOnDesktop">
                    <ComboBox data={convertObjToArray(fullArticles)} active={activeKey} setActive={setActiveKey}/>
                </div>
            </aside>
            <div className={styles.content}>
                {renderContent()}
            </div>
        </div>
    )
        
}