// React/Next------------------------------------------------------------------------
// Context---------------------------------------------------------------------------
// Components------------------------------------------------------------------------
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn/ui/dialog"
import FixerNameForm from "./FixerNameForm";
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/components/SaveFile.module.css";
// Other-----------------------------------------------------------------------------


//______________________________________________________________________________________
// ===== Constants =====


//______________________________________________________________________________________
// ===== Component =====

export default function NewSaveFile({ }) {

    //______________________________________________________________________________________
    // ===== Component Return  =====

    return (
        <div className="py-5">
            <Dialog>
                <DialogTrigger asChild>
                    <button className={`${styles.saveFileLink} w-full`}>
                        <div className={`${styles.saveFile} ${styles.saveFileGlow} neonText neonTextGlow yellow`}>
                            <div className={`${styles.item}`}>
                                <div className={styles.table}>
                                    <div className={styles.cell}>
                                        <div className="text-center text-[8.7rem]">+</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] neonBorder neonText neonTextGlow neonBoxShadowGlow yellow">
                    <DialogHeader>
                        <DialogTitle>New Save File</DialogTitle>
                        <DialogDescription>What is your fixer's name?</DialogDescription>
                    </DialogHeader>
                    <FixerNameForm />
                </DialogContent>    
            </Dialog>
        </div>
    )
}
