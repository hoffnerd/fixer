
// React/Next------------------------------------------------------------------------
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/game.module.css";
// Components------------------------------------------------------------------------
import Notifications from "@/components/Game/Panels/Notifications";
import Resources from "@/components/Game/Panels/Resources";
import Mercs from "@/components/Game/Panels/Mercs";
import Contracts from "@/components/Game/Panels/Contracts";
import Main from "@/components/Game/Panels/Mobile/Main";
// Other-----------------------------------------------------------------------------
import { isObj } from "@/util";



//______________________________________________________________________________________
// ===== Constants  =====
const panelsObj = {
    notifications: <Notifications/>,
    mercs: <Mercs/>,
    contracts: <Contracts/>
}



//______________________________________________________________________________________
// ===== Component  =====
export default function Mobile({ }){

    //______________________________________________________________________________________
    // ===== Component Return  =====
    return(
        <div className={`${styles.gameGrid} ${styles.mobile} hiddenOnDesktop hiddenOnTablet`}>
            <div className={styles.center}>
                <div className={`${styles.panel} ${styles.resources} neonBorder neonBoxShadowGlow blue`}>
                    <Resources/>
                </div>
                <div className="p-4"/>
                <Main panels={panelsObj} />
            </div>
        </div>
    )
} 