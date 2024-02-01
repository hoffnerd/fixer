"use client";

// React/Next -----------------------------------------------------------------------
import { createContext, useContext, useEffect, useState } from "react";
// Context---------------------------------------------------------------------------
import { useSession } from "next-auth/react";
// Server Actions -------------------------------------------------------------------
import { updateSaveFile } from "@/actions/saveFile";
// Data -----------------------------------------------------------------------------
import { saveInterval } from "@/data/_config";
import { defaultSaveData } from "@/data/defaultSaveData";
// Other ----------------------------------------------------------------------------
import { checkRoleAccessLevel, isObj } from '@/util';



//______________________________________________________________________________________
// ===== Create React Context =====
export const AppContext = createContext();



//______________________________________________________________________________________
// ===== Initial State of Context =====
const initialStateCore = {
    gameSaving: false,
    gameSaveFileId: null,
    gameInGameTime: 0,
}

const initialStateMobile = {
    gameMobilePanelOpen: "notifications",
    gameMobileNavBadge_notifications: 0,
    gameMobileNavBadge_mercs: 1,
    gameMobileNavBadge_contracts: 0,
}


//______________________________________________________________________________________
// ===== Context Provider (Basically the "Component") =====
export const AppContextProvider = ({children}) => {

    //______________________________________________________________________________________
    // ===== Context =====
    const { data: session, status} = useSession();



    //______________________________________________________________________________________
    // ===== State - Core =====
    const [debugMode, setDebugMode] = useState(false);
    const [gameSaving, setGameSaving] = useState(initialStateCore.gameSaving);
    const [gameSaveFileId, setGameSaveFileId] = useState(initialStateCore.gameSaveFileId);
    const [gameInGameTime, setGameInGameTime] = useState(initialStateCore.gameInGameTime);
    const [gameLastSavedTime, setGameLastSavedTime] = useState(initialStateCore.gameInGameTime);



    //______________________________________________________________________________________
    // ===== State - Mobile =====
    const [gameMobilePanelOpen, setGameMobilePanelOpen] = useState(initialStateMobile.gameMobilePanelOpen);
    const [gameMobileNavBadge_notifications, setGameMobileNavBadge_notifications] = useState(initialStateMobile.gameMobileNavBadge_notifications);
    const [gameMobileNavBadge_mercs, setGameMobileNavBadge_mercs] = useState(initialStateMobile.gameMobileNavBadge_mercs);
    const [gameMobileNavBadge_contracts, setGameMobileNavBadge_contracts] = useState(initialStateMobile.gameMobileNavBadge_contracts);



    //______________________________________________________________________________________
    // ===== State - Resources =====
    const [gameResources_e, setGameResources_e] = useState(defaultSaveData.resources.e);
    const [gameResources_w, setGameResources_w] = useState(defaultSaveData.resources.w);
    const [gameResources_t, setGameResources_t] = useState(defaultSaveData.resources.t);
    const [gameResources_q, setGameResources_q] = useState(defaultSaveData.resources.q);


    //______________________________________________________________________________________
    // ===== State and Sets that other Components can access =====
    
    const values = {
        // =============== State - Core ===============
        debugMode, setDebugMode,
        gameSaving, setGameSaving,
        gameSaveFileId, setGameSaveFileId,
        gameInGameTime, setGameInGameTime,
        gameLastSavedTime, setGameLastSavedTime,

        // =============== State - Mobile ===============
        gameMobilePanelOpen, setGameMobilePanelOpen,
        gameMobileNavBadge_notifications, setGameMobileNavBadge_notifications,
        gameMobileNavBadge_mercs, setGameMobileNavBadge_mercs,
        gameMobileNavBadge_contracts, setGameMobileNavBadge_contracts,

        // =============== State - Resources ===============
        gameResources_e, setGameResources_e,
        gameResources_w, setGameResources_w,
        gameResources_t, setGameResources_t,
        gameResources_q, setGameResources_q,
    };



    //______________________________________________________________________________________
    // ===== Use Effects =====

    useEffect(() => {
        if(checkRoleAccessLevel(session, "ADMIN")) return;
        if(debugMode) setDebugMode(false);
    }, [session, debugMode])

    /**
     * Checks if it's time to save the game and if so, set `gameSaving` to true to activate the next useEffect
     * @dependencies gameSaveFileId, gameInGameTime, gameLastSavedTime
     */
    useEffect(() => {

        // return early if we haven't set the save file id
        if(!gameSaveFileId) return;

        // return early if the time since the last save is more than our `saveInterval`
        if((gameInGameTime - gameLastSavedTime) <= saveInterval) return;
        
        if(gameSaving) return;
        
        setGameSaving(true);
    }, [gameSaveFileId, gameInGameTime, gameLastSavedTime]);

    /**
     * Checks if we should save and if so, it calls an async function to update a save file.
     * @dependencies gameSaving
     */
    useEffect(() => {
        if(!gameSaving) return;

        // declare that we are subscribed and want the async function below to happen
        let isSubscribed = true;

        // create an async function that fetches the data so that this `useEffect` may call it below
        const saveGame = async () => {

            // return early if an unexpected render happened so that the code below does not run twice
            if(!isSubscribed) return;

            const timeInSeconds = gameInGameTime;

            // create our save file and take us there or wait for a response
            const response = await updateSaveFile(gameSaveFileId, gameInGameTime);

            if(isObj(response, ["error"])){
                // setErrorMessage(response.message || "Something went wrong creating your save file!");
                return;
            }

            // assume there is no error that we need to display to the user
            setGameLastSavedTime(timeInSeconds);
            setGameSaving(false);
        }

        // execute the async function defined above
        saveGame();

        // cancel any future `fetchData` functions
        return () => isSubscribed = false;
    }, [gameSaving]);

    /**
     * Use Effect that checks if a badge value exists for a specific game panel and resets it to 0 if it does.
     * @dependency gameMobilePanelOpen
     */
    useEffect(() => {
        
        // make sure we have `gameMobilePanelOpen` set to something
        if(!gameMobilePanelOpen) return;

        // make sure there is an existing value for that badge
        if(!values[`gameMobileNavBadge_${gameMobilePanelOpen}`]) return;

        // run the set function to reset that badge
        values[`setGameMobileNavBadge_${gameMobilePanelOpen}`](0);
    }, [gameMobilePanelOpen])


    
    //______________________________________________________________________________________
    // ===== Provider Return =====
    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}



//______________________________________________________________________________________
// ===== Function other Components will call to get state we set above =====
export const useAppContext = () => {
    const context = useContext(AppContext)
    return context;
}