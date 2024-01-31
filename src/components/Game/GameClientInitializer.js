"use client"

// React/Next------------------------------------------------------------------------
import { useEffect, useState } from 'react';
// Context---------------------------------------------------------------------------
import { useSession } from "next-auth/react";
import { useAppContext } from '@/context/AppContext';
// Components------------------------------------------------------------------------
import InGameTime from './Timers/InGameTime';
// Other-----------------------------------------------------------------------------
import { checkRoleAccessLevel, isObj } from '@/util';
import { renderFontAwesomeIcons } from '@/util/icons';

//______________________________________________________________________________________
// ===== Component =====
export default function GameClientInitializer({ saveFile }){

    //______________________________________________________________________________________
    // ===== Context =====
    const { data: session, status} = useSession();
    const { debugMode, setDebugMode, gameSaving, setGameSaveFileId, setGameInGameTime, setGameLastSavedTime } = useAppContext();
    


    //______________________________________________________________________________________
    // ===== State =====
    const [initialized, setInitialized] = useState(false);



    //______________________________________________________________________________________
    // ===== Use Effects =====

    useEffect(() => {
        if(initialized) return;

        if(!isObj(saveFile, [ "id" ])) return;

        setGameSaveFileId(saveFile.id);
        setGameInGameTime(saveFile.inGameTime);
        setGameLastSavedTime(saveFile.inGameTime);
        setInitialized(true);
    }, [initialized, saveFile])
    


    //______________________________________________________________________________________
    // ===== Render Functions =====
    const renderDebug = () => {
        if(!checkRoleAccessLevel(session, "ADMIN")) return;

        return(
            <a href="#" onClick={(e)=>{
                e.preventDefault();
                setDebugMode((prevDebugMode)=>!prevDebugMode);
            }}>
                {renderFontAwesomeIcons({ key:"faScrewdriverWrench", className:"h-10" })}
            </a>
        )
    }


    //______________________________________________________________________________________
    // ===== Component Return =====
    if(!initialized) return;

    return(
        <div className="absolute">
            {gameSaving && renderFontAwesomeIcons({ key:"faFloppyDisk", className:"h-10" })}
            {renderDebug()}
            <div className={checkRoleAccessLevel(session, "ADMIN") && debugMode ? "bg-background p-5" : ""}>
                <InGameTime inGameTime={saveFile.inGameTime}/>
            </div>
        </div>
    )
        
}