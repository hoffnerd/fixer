
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/game.module.css";
// Components------------------------------------------------------------------------
import { CenterVertically } from "@/components/MicroComponents";



//______________________________________________________________________________________
// ===== Component  =====
export default function Resources () {
    return (
        <div className={styles.resourcesGrid}>
            <div className={`${styles.resourcesGridColumn} ${styles.border} neonBorder blue text-center`}>
                <CenterVertically>€ 1000</CenterVertically>
            </div>
            <div className={`${styles.resourcesGridColumn} ${styles.border} neonBorder blue text-center`}>
                <CenterVertically>⚙W 5</CenterVertically>
            </div>
            <div className={`${styles.resourcesGridColumn} ${styles.border} neonBorder blue text-center`}>
                <CenterVertically>⚙T 5</CenterVertically>
            </div>
            <div className={`${styles.resourcesGridColumn} neonBorder blue text-center`}>
                <CenterVertically>⚙Q 5</CenterVertically>
            </div>
        </div>
    )
}