"use client"

// Context---------------------------------------------------------------------------
import { useAppContext } from '@/context/AppContext';
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/game.module.css";
// Other ----------------------------------------------------------------------------
import { isObj } from '@/util';


//______________________________________________________________________________________
// ===== Component =====
export default function Main({ panels }){

    //______________________________________________________________________________________
    // ===== Context =====
    const { gameMobilePanelOpen } = useAppContext();

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <div className={`${styles.panel} ${styles.mobileMain} neonScrollBar neonBorder neonBoxShadowGlow yellow`}>
            <div className={styles.content}>
                {isObj(panels, [gameMobilePanelOpen]) && panels[gameMobilePanelOpen]}
            </div>
        </div>
    )
}