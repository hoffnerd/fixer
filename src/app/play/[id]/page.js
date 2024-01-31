
// React/Next------------------------------------------------------------------------
import { unstable_noStore } from "next/cache";
// Actions---------------------------------------------------------------------------
import { readSaveFile } from "@/actions/saveFile"
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/game.module.css";
// Components------------------------------------------------------------------------
import Alert from "@/components/Alert";
import NavigationUser from "@/components/NavigationUser";
import GameClientInitializer from "@/components/Game/GameClientInitializer";
import Desktop from "@/components/Game/Grid/Desktop";
import Tablet from "@/components/Game/Grid/Tablet";
import Mobile from "@/components/Game/Grid/Mobile";
import BottomNav from "@/components/Game/Panels/Mobile/BottomNav";
// Other-----------------------------------------------------------------------------
import { isObj } from "@/util";



//______________________________________________________________________________________
// ===== Component  =====
export default async function Page({ params }){
    unstable_noStore();

    //______________________________________________________________________________________
    // ===== Constants  =====
    const id = isObj(params, [ 'id' ]) ? params.id : null;
    const saveFile = id ? await readSaveFile(id) : null;


    
    //______________________________________________________________________________________
    // ===== Component Return  =====

    if(isObj(saveFile, ["error"]) || (!isObj(saveFile, ["id"]))) return (
        <Alert variant="neonRedWithGlow" title="Error!">
            {(saveFile && saveFile.message) || "An unexpected error has occurred!"}
        </Alert>
    )

    return  (
        <div className="min-h-screen">
            <div className="sticky top-0">
                <div className="flexItemsEvenly">
                    <div className="p-2 overflow-hidden">{saveFile.name}</div>
                    <NavigationUser/>
                </div>
            </div>
            <GameClientInitializer saveFile={saveFile}/>
            <div className={styles.game}>
                <Desktop/>
                <Tablet/>
                <Mobile/>
            </div>
            <BottomNav/>
        </div>
    )
} 