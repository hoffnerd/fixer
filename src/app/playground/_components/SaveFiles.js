"use client"

// React/Next -----------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import Alert from "@/components/Alert";
import SaveFile from "@/components/SaveFile/SaveFile";
// Other-----------------------------------------------------------------------------
import { isArray, isObj } from "@/util";
import { useReadSaveFilesByUserId } from "@/rQuery/hooks/saveFile";

//______________________________________________________________________________________
// ===== Component  =====
export default function SaveFiles({initialSaveFiles=null}){
    
    const { data, error } = useReadSaveFilesByUserId();
    const saveFiles = data || initialSaveFiles;

    //______________________________________________________________________________________
    // ===== Component Return  =====

    if(error || isObj(saveFiles, ["error"])) return (
        <Alert variant="neonRedWithGlow" title="Error!">
            {saveFiles.message || "An unexpected error has occurred!"}
        </Alert>
    )

    return isArray(saveFiles) && saveFiles.map((saveFile)=> <SaveFile key={saveFile.id} saveFile={saveFile} />)
}  