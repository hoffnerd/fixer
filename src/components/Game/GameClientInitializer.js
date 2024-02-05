"use client"

// React/Next------------------------------------------------------------------------
import { useEffect, useState } from 'react';
// Context---------------------------------------------------------------------------
import { useSession } from "next-auth/react";
import { useAppContext } from '@/context/AppContext';
import { useReadSaveFile } from '@/rQuery/hooks/saveFile';
import { useDebugModeStore } from '@/stores/game';
// Components------------------------------------------------------------------------
import InGameTime from './Timers/InGameTime';
// Other-----------------------------------------------------------------------------
import { checkRoleAccessLevel, isObj } from '@/util';
import { renderFontAwesomeIcons } from '@/util/icons';
import { Button } from '../shadcn/ui/button';

//______________________________________________________________________________________
// ===== Component =====
export default function GameClientInitializer({ saveFileId }){

    //______________________________________________________________________________________
    // ===== Context =====
    const { data:session, status} = useSession();
    const { 
        // ===== State - Core =====
        gameSaving, 
        setGameSaveFileId, 
        setGameInGameTime, 
        setGameLastSavedTime, 

        // ===== State - Resources =====
        setGameResources_e,
        setGameResources_w,
        setGameResources_t,
        setGameResources_q,
    } = useAppContext();
    


    //______________________________________________________________________________________
    // ===== hooks =====
    const { data:saveFile, error } = useReadSaveFile(saveFileId);
    const debugMode = useDebugModeStore((state) => state.debugMode)
    const toggleDebugMode = useDebugModeStore((state) => state.toggleDebugMode)



    //______________________________________________________________________________________
    // ===== State =====
    const [initialized, setInitialized] = useState(false);



    //______________________________________________________________________________________
    // ===== Use Effects =====

    useEffect(() => {
        if(initialized) return;

        if(!isObj(saveFile, [ "id" ])) return;

        // ===== Core =====
        setGameSaveFileId(saveFile.id);
        setGameInGameTime(saveFile.inGameTime);
        setGameLastSavedTime(saveFile.inGameTime);

        if(!isObj(saveFile.saveData)){
            setInitialized(true);
            return;
        }

        // ===== Resources =====
        if(isObj(saveFile.saveData.resources, [ "e", "w", "t", "q" ], false)){
            saveFile.saveData.resources.e && setGameResources_e(saveFile.saveData.resources.e);
            saveFile.saveData.resources.w && setGameResources_w(saveFile.saveData.resources.w);
            saveFile.saveData.resources.t && setGameResources_t(saveFile.saveData.resources.t);
            saveFile.saveData.resources.q && setGameResources_q(saveFile.saveData.resources.q);
        }


        setInitialized(true);
    }, [initialized, saveFile])
    


    //______________________________________________________________________________________
    // ===== Render Functions =====
    const renderDebug = () => {
        if(!checkRoleAccessLevel(session, "ADMIN")) return;

        return(
            <Button variant="ghost" onClick={toggleDebugMode}>
                {renderFontAwesomeIcons({ key:"faScrewdriverWrench", className:"h-10" })}
            </Button>
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