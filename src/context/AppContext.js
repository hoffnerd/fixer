"use client";

// React/Next -----------------------------------------------------------------------
import { createContext, useContext, useState } from "react";
// Data -----------------------------------------------------------------------------
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Create React Context =====
export const AppContext = createContext();



//______________________________________________________________________________________
// ===== Initial State of Context =====
const initialState = {
    openMobileMenu: false,
    openSubMobileMenu: false,
}



//______________________________________________________________________________________
// ===== Context Provider (Basically the "Component") =====
export const AppContextProvider = ({children}) => {

    //______________________________________________________________________________________
    // ===== Provider State =====
    const [openMobileMenu, setOpenMobileMenu] = useState(initialState.openMobileMenu);
    const [openSubMobileMenu, setOpenSubMobileMenu] = useState(initialState.openSubMobileMenu);



    //______________________________________________________________________________________
    // ===== State and Sets that other Components can access =====
    const values = { 
        openMobileMenu, setOpenMobileMenu,
        openSubMobileMenu, setOpenSubMobileMenu,
    };

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