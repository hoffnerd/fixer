// React/Next -----------------------------------------------------------------------
import { Suspense } from "react";
// Components -----------------------------------------------------------------------
import NavigationUser from "@/components/NavigationUser";
import NewSaveFile from "@/components/SaveFile/NewSaveFile";
import Loading from "@/components/Loading";
import SaveFiles from "@/components/SaveFile/SaveFiles";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component  =====
export default async function Play(){

    //______________________________________________________________________________________
    // ===== Component Return  =====
    return <>
        <div className="sticky top-0">
            <div className="flex flex-row-reverse">
                <NavigationUser/>
            </div>
        </div>
        <div className="container">
            <h1 className="text-5xl font-black pb-10">My Saves</h1>
            <NewSaveFile/>
            <Suspense fallback={<Loading/>}>
                <SaveFiles/>
            </Suspense>
        </div>
    </>
} 