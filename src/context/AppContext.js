"use client";

// React/Next -----------------------------------------------------------------------
import { createContext, useContext, useEffect, useState } from "react";
// Data -----------------------------------------------------------------------------
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Create React Context =====
export const AppContext = createContext();



//______________________________________________________________________________________
// ===== Initial State of Context =====
const initialState = {
    gameMobilePanelOpen: "notifications",

    gameMobileNavBadge_notifications: 0,
    gameMobileNavBadge_mercs: 1,
    gameMobileNavBadge_contracts: 0,
}



//______________________________________________________________________________________
// ===== Context Provider (Basically the "Component") =====
export const AppContextProvider = ({children}) => {

    //______________________________________________________________________________________
    // ===== Provider State =====

    const [gameMobilePanelOpen, setGameMobilePanelOpen] = useState(initialState.gameMobilePanelOpen);

    const [gameMobileNavBadge_notifications, setGameMobileNavBadge_notifications] = useState(initialState.gameMobileNavBadge_notifications);
    const [gameMobileNavBadge_mercs, setGameMobileNavBadge_mercs] = useState(initialState.gameMobileNavBadge_mercs);
    const [gameMobileNavBadge_contracts, setGameMobileNavBadge_contracts] = useState(initialState.gameMobileNavBadge_contracts);



    //______________________________________________________________________________________
    // ===== State and Sets that other Components can access =====
    
    const values = { 
        gameMobilePanelOpen, setGameMobilePanelOpen,

        gameMobileNavBadge_notifications, setGameMobileNavBadge_notifications,
        gameMobileNavBadge_mercs, setGameMobileNavBadge_mercs,
        gameMobileNavBadge_contracts, setGameMobileNavBadge_contracts,
    };



    //______________________________________________________________________________________
    // ===== Use Effects =====

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