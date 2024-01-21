// React/Next -----------------------------------------------------------------------
import Link from "next/link";
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/ui2077.module.css";
// Components -----------------------------------------------------------------------
import NavigationUser from "@/components/NavigationUser";
// Other ----------------------------------------------------------------------------
import { renderFontAwesomeIcons } from "@/util/icons";



//______________________________________________________________________________________
// ===== Constants =====
const data = [
    // { link:"/", icon:"faCircleQuestion", display:"?", position:"first" },
    // { link:"/", icon:"faCircleQuestion", display:"?", position:"second" },
    { link:"/about", icon:"faCircleInfo", display:"Information", position:"first" },
    { link:"/about/how", icon:"faCircleQuestion", display:"How to Play", position:"second" },
    { link:"/play", icon:"faCircleUser", display:"Join Wait List", position:"third" },
];



//______________________________________________________________________________________
// ===== Component =====

export default function Page() {

    //______________________________________________________________________________________
    // ===== Render Functions =====

    /**
     * Renders links for the main content.
     */
    const renderContent = () => data.map(dataObj => (
        <Link key={dataObj.link} className={`${styles.contentItem} ${styles[dataObj.position]}`} href={dataObj.link}>
            <div className={`${styles.menu} ${styles.menuGlow}`}>
                <div className="centerChildren">
                    {renderFontAwesomeIcons({ key:dataObj.icon, className:styles.icon })}
                </div>
                <h3 className={`${styles.title} neonText neonTextGlow blue`}>{dataObj.display}</h3>
            </div>
        </Link>
    ));

    /**
     * Renders elements that renders the inner borders of a monitor.
     */
    const renderInnerMonitorBorder = () => <>
        <div className={`${styles.monitor} ${styles.innerTop}`}/>
        <div className={`${styles.monitor} ${styles.innerRight}`}/>
        <div className={`${styles.monitor} ${styles.innerBottom}`}/>
        <div className={`${styles.monitor} ${styles.innerLeft}`}/>
    </>



    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <div className={`flexItemsEvenly ${styles.monitor}`}>
            {renderInnerMonitorBorder()}
            <div className={styles.content}>
                <div className={styles.contentItemFull}>
                    <div className="flex flex-row-reverse">
                        <NavigationUser/>
                    </div>
                </div>
                {renderContent()}
            </div>
        </div>
    )

    // return (
    //     <div style={{position:"relative"}}>
    //         <div style={{position:"absolute"}}>
    //             <div className={`flexItemsEvenly ${styles.monitor} ${styles.black}`}>
    //             </div>
    //         </div>
    //         <div style={{position:"absolute"}}>
    //             <div className={`flexItemsEvenly ${styles.monitor}`}>
    //                 {renderInnerMonitorBorder()}
    //                 <div className={styles.content}>
    //                     {renderContent()}
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )
}