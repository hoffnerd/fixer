"use client"


// React/Next------------------------------------------------------------------------
// rQuery----------------------------------------------------------------------------
import { useReadSaveFile } from "@/rQuery/hooks/saveFile";
// Context---------------------------------------------------------------------------
// Components------------------------------------------------------------------------
import Debugger from "./Debugger";
import SaveFileId from "./SaveFileId";
import InGameTime from "./InGameTime";
import SaveGame from "./SaveGame";
import Resources from "./Resources";
import Dialog from "./Dialog";
import Events from "./Events";
// Other-----------------------------------------------------------------------------
import { isObj } from "@/util";

//______________________________________________________________________________________
// ===== Component =====
export default function Manager({ saveFileId }){

    //______________________________________________________________________________________
    // ===== hooks =====
    const { data:saveFile } = useReadSaveFile(saveFileId);

    //______________________________________________________________________________________
    // ===== Component Return =====

    if(!isObj(saveFile, ["id"])) return;

    return (
        <Debugger>


            <SaveFileId saveFile={saveFile}/>
            <InGameTime propInGameTime={saveFile.inGameTime}/>
            <SaveGame propInGameTime={saveFile.inGameTime}/>
            <Resources resources={saveFile?.saveData?.resources}/>
            <Dialog/>

            <Events saveData={saveFile?.saveData}/>

        </Debugger>
    )
        
}