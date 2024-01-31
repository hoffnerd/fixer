
// React/Next -----------------------------------------------------------------------
import { unstable_noStore} from "next/cache";
// Components -----------------------------------------------------------------------
import Alert from "../Alert";
import SaveFile from "@/components/SaveFile/SaveFile";
// Server----------------------------------------------------------------------------
import { readSaveFilesByUserId } from "@/actions/saveFile";
// Other-----------------------------------------------------------------------------
import { isArray, isObj } from "@/util";

//______________________________________________________________________________________
// ===== Component  =====
export default async function SaveFiles(){
    unstable_noStore();

    //______________________________________________________________________________________
    // ===== Constants  =====
    const saveFiles = await readSaveFilesByUserId();



    //______________________________________________________________________________________
    // ===== Component Return  =====

    if(isObj(saveFiles, ["error"])) return (
        <Alert variant="neonRedWithGlow" title="Error!">
            {saveFiles.message || "An unexpected error has occurred!"}
        </Alert>
    )

    return isArray(saveFiles) && saveFiles.map((saveFile)=> <SaveFile key={saveFile.id} saveFile={saveFile} />)
} 