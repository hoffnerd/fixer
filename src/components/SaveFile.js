// React/Next------------------------------------------------------------------------
import Link from "next/link";
// Context---------------------------------------------------------------------------
// Components------------------------------------------------------------------------
import { Badge } from "./shadcn/ui/badge";
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/components/SaveFile.module.css";
// Other-----------------------------------------------------------------------------
import { isObj } from "@/util";



//______________________________________________________________________________________
// ===== Constants =====
const defaultSaveFile = { id:null, userId:null, name:null, chapter:0, type:null, saveData:null, inGameTime:null, createdAt:null, updatedAt:null };



//______________________________________________________________________________________
// ===== Micro Components =====

const Item = ({ children, col=null }) => (
    <div className={`${styles.item} ${col ? styles[col] : ""}`}>
        <div className={styles.table}>
            <div className={styles.cell}>{children}</div>
        </div>
    </div>
);

const TypeBadge = ({ children, type }) => {
    if(type === "Story") return <Badge className="text-lg" variant="neonGreenWithGlow">{children}</Badge>
    else if(type === "Unlimited") return <Badge className="text-lg" variant="neonPinkWithGlow">{children}</Badge>
    return <Badge className="text-lg">{children}</Badge>
}



//______________________________________________________________________________________
// ===== Component =====

export default function SaveFile({ saveFile }) {

    //______________________________________________________________________________________
    // ===== Component Constants =====
    const { id, userId, name, chapter, type, saveData, inGameTime, createdAt, updatedAt } = isObj(saveFile) ? { ...defaultSaveFile, ...saveFile } : defaultSaveFile;



    //______________________________________________________________________________________
    // ===== Render Functions  =====

    const renderNameAndChapter = () => <>{name} | Chapter {chapter || 0}: Chapter Name</>
    const renderLastSavedTime = () => <>Last Saved:<br />MMM DD, YYYY hh:mm a</>
    const renderStartedDate = () => <>Started: MMM DD, YYYY</>



    //______________________________________________________________________________________
    // ===== Render Functions for Large Content Mode =====

    const renderContentSmall = () => (
        <div className={`${styles.content} ${styles.small}`}>
            <Item col="firstCol"><TypeBadge type={type}>{type}</TypeBadge></Item>
            <Item col="secondCol">
                <div className="flex flex-row-reverse">00:00:00</div>
            </Item>

            <Item col="regularCol">
                <div className="text-center">{renderNameAndChapter()}</div>
            </Item>
            <Item col="regularCol">
                <div className="text-center">€ 0</div>
            </Item>

            <Item col="regularCol"><hr/></Item>
            <Item col="regularCol">
                <div className="text-center">Components</div>
            </Item>
            <Item col="regularCol">
                <div className="text-center">Weapon: 0</div>
            </Item>
            <Item col="regularCol">
                <div className="text-center">Tech: 0</div>
            </Item>
            <Item col="regularCol">
                <div className="text-center">Quickhack: 0</div>
            </Item>
            <Item col="regularCol"><hr/></Item>

            <Item col="regularCol">
                <div className="text-center">{renderStartedDate()}</div>
            </Item>
            <Item col="regularCol">
                <div className="text-center">{renderLastSavedTime()}</div>
            </Item>
        </div>
    )

    const renderContentMedium = () => (
        <div className={`${styles.content} ${styles.medium}`}>
            <Item col="firstCol"><TypeBadge type={type}>{type}</TypeBadge></Item>
            <Item col="secondCol">
                <div className="flex flex-row-reverse">00:00:00</div>
            </Item>
            
            <Item col="firstCol">{renderNameAndChapter()}</Item>
            <Item col="secondCol">
                <div className="flex flex-row-reverse">€ 0</div>
            </Item>

            <Item col="firstColComponents">Components | </Item>
            <Item>
                <div className="text-center">Weapon: 0</div>
            </Item>
            <Item>
                <div className="text-center">Tech: 0</div>
            </Item>
            <Item col="forthColComponents">
                <div className="flex flex-row-reverse">Quickhack: 0</div>
            </Item>

            <Item col="firstCol">{renderStartedDate()}</Item>
            <Item col="secondCol">
                <div className="flex flex-row-reverse">{renderLastSavedTime()}</div>
            </Item>
        </div>
    )

    const renderContentLarge = () => (
        <div className={`${styles.content} ${styles.large}`}>
            <Item col="firstCol"><TypeBadge type={type}>{type}</TypeBadge></Item>
            <Item col="secondCol">
                <div className="flex flex-row-reverse">Weapon Components:</div>
            </Item>
            <Item col="thirdCol">0</Item>
            <Item col="forthCol">
                <div className="flex flex-row-reverse">00:00:00</div>
            </Item>
            
            <Item col="firstCol">{renderNameAndChapter()}</Item>
            <Item col="secondCol">
                <div className="flex flex-row-reverse">Tech Components:</div>
            </Item>
            <Item col="thirdCol">0</Item>
            <Item col="forthCol">
                <div className="flex flex-row-reverse">{renderStartedDate()}</div>
            </Item>
            
            <Item col="firstCol">€ 0</Item>
            <Item col="secondCol">
                <div className="flex flex-row-reverse">Quickhack Components:</div>
            </Item>
            <Item col="thirdCol">0</Item>
            <Item col="forthCol">
                <div className="flex flex-row-reverse">{renderLastSavedTime()}</div>
            </Item>
        </div>
    )


    //______________________________________________________________________________________
    // ===== Component Return  =====

    if (!(id && name && type)) return console.error("SaveFile Invalid!", { saveFile, save: { id, userId, name, chapter, type, createdAt, updatedAt } });
    
    return (
        <div className="py-5">
            <Link href={`/play/${id}`} className={styles.saveFileLink}>
                <div className={`${styles.saveFile} ${styles.saveFileGlow} neonText neonTextGlow yellow`}>
                    {renderContentLarge()}
                    {renderContentMedium()}
                    {renderContentSmall()}
                </div>
            </Link>
        </div>
    )
}
