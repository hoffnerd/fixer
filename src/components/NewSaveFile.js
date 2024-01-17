"use client"

// React/Next------------------------------------------------------------------------
// import { useEffect, useState } from "react";
// import Link from "next/link";
// Context---------------------------------------------------------------------------
// Components------------------------------------------------------------------------
import { Button } from "@/components/shadcn/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn/ui/dialog"
import { Input } from "@/components/shadcn/ui/input"
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/components/SaveFile.module.css";
// Other-----------------------------------------------------------------------------


//______________________________________________________________________________________
// ===== Constants =====


//______________________________________________________________________________________
// ===== Component =====

export default function NewSaveFile({ }) {

    //______________________________________________________________________________________
    // ===== State =====
    // const [fixerName, setFixerName] = useState("fdfdf");

    // useEffect(() => {
    //     console.log({fixerName})
    // }, [fixerName])
    

    //______________________________________________________________________________________
    // ===== Component Constants =====

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
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Input id="name" className="col-span-4" placeholder="Name" value={fixerName} onChange={(e)=>setFixerName(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="neonWhiteWithGlow" type="submit">Start Game</Button>
                    </DialogFooter>
                </DialogContent>    
            </Dialog>
        </div>
    )
}
