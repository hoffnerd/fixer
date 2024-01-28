
// React/Next------------------------------------------------------------------------
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/game.module.css";
// Components------------------------------------------------------------------------
import Notifications from "@/components/Game/Panels/Notifications";
import Resources from "@/components/Game/Panels/Resources";
import Mercs from "@/components/Game/Panels/Mercs";
import Contracts from "@/components/Game/Panels/Contracts";
import BottomBar from "@/components/Game/Panels/BottomBar";
// Other-----------------------------------------------------------------------------
import { isObj } from "@/util";



//______________________________________________________________________________________
// ===== Component  =====
export default function Tablet({ }){

    //______________________________________________________________________________________
    // ===== Component Return  =====
    return(
        <div className={`${styles.gameGrid} ${styles.tablet} hiddenOnDesktop hiddenOnMobile`}>
            <div className={styles.sidebarLeft}>
                <div className={`${styles.panel} ${styles.notifications} neonBorder neonBoxShadowGlow blue`}>
                    <div className={styles.content}>
                        <Notifications/>
                    </div>
                </div>
            </div>
            <div className={styles.center}>
                <div className={`${styles.panel} ${styles.resources} neonBorder neonBoxShadowGlow blue`}>
                    <Resources/>
                </div>
                <div className="p-4"/>
                <div className={`${styles.panel} ${styles.mercs} neonScrollBar neonBorder neonBoxShadowGlow yellow`}>
                    <div className={styles.content}>
                        <Mercs/>
                    </div>
                </div>
                <div className="p-4"/>
                <div className={`${styles.panel} ${styles.contracts} neonScrollBar neonBorder neonBoxShadowGlow yellow`}>
                    <div className={styles.content}>
                        <Contracts/>
                    </div>
                </div>
            </div>
            <div className={styles.bottomBar}>
                <div className={`${styles.panel} ${styles.resources} neonBorder neonBoxShadowGlow white`}>
                    <BottomBar/>
                </div>
            </div>
        </div>
    )
} 