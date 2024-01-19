
// React/Next------------------------------------------------------------------------
import Link from "next/link";
// Actions---------------------------------------------------------------------------
import { readSaveFile } from "@/actions/saveFile"
// Other-----------------------------------------------------------------------------
import { isObj } from "@/util";



//______________________________________________________________________________________
// ===== Component  =====
export default async function Game({ params }){

    const id = isObj(params, [ 'id' ]) ? params.id : null;
    const saveFile = id ? await readSaveFile(id) : null;
    console.log(saveFile)

    //______________________________________________________________________________________
    // ===== Component Return  =====
    return <div>
        <div>{id}</div>
        <Link href="/play">Play</Link>
    </div>
} 