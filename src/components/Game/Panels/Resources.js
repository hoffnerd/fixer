
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/game.module.css";
// Components------------------------------------------------------------------------
import Resource from "./Resource";



//______________________________________________________________________________________
// ===== Component  =====
export default function Resources () {
    return (
        <div className={styles.resourcesGrid}>
            <div className={`${styles.resourcesGridColumn} ${styles.border} neonBorder blue text-center`}>
                <Resource keyResource="e" display="€" component={false} />
            </div>
            <div className={`${styles.resourcesGridColumn} ${styles.border} neonBorder blue text-center`}>
                <Resource keyResource="w" display="W" />
            </div>
            <div className={`${styles.resourcesGridColumn} ${styles.border} neonBorder blue text-center`}>
                <Resource keyResource="t" display="T" />
            </div>
            <div className={`${styles.resourcesGridColumn} neonBorder blue text-center`}>
                <Resource keyResource="q" display="Q" />
            </div>
        </div>
    )
}