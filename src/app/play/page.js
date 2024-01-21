// React/Next -----------------------------------------------------------------------
import { Suspense } from "react";
import Link from "next/link";
// Components -----------------------------------------------------------------------
import NavigationUser from "@/components/NavigationUser";
import NewSaveFile from "@/components/SaveFile/NewSaveFile";
import Loading from "@/components/Loading";
import SaveFiles from "@/components/SaveFile/SaveFiles";
// Other ----------------------------------------------------------------------------
import { readServerSession } from "@/lib/protector";
import { checkRoleAccessLevel } from "@/util";



//______________________________________________________________________________________
// ===== Component  =====
export default async function Page(){

    //______________________________________________________________________________________
    // ===== Constants =====
    const session = await readServerSession();
    


    //______________________________________________________________________________________
    // ===== Functions =====

    const renderWaitList = () => <>
        <h1 className="text-center text-5xl font-black pt-20 pb-10">You have joined the wait list!</h1>
        <p className="text-center neonText neonTextGlow green py-5">You will be emailed when Chapter 1 is released</p>
        <p className="text-center neonText neonTextGlow blue py-5"><Link href="/about">Click Here to learn more about the game</Link></p>
        <p className="text-center neonText neonTextGlow blue py-5"><Link href="/about/how">Click Here to learn how to play</Link></p>
        <p className="text-center py-5">
            <span className="neonText neonTextGlow yellow">Still have questions? Reach out! I am </span>
            <a className="neonText neonTextGlow blue" href="https://nextgenscripts.vercel.app" target="_blank">@NextGenScripts</a>
            <span className="neonText neonTextGlow yellow"> on all major social platforms.</span>
        </p>
    </>

    const renderSaves = () => <>
        <h1 className="text-5xl font-black pb-10">My Saves</h1>
        <NewSaveFile/>
        <Suspense fallback={<Loading/>}>
            <SaveFiles/>
        </Suspense>
    </>



    //______________________________________________________________________________________
    // ===== Component Return  =====
    return <>
        <div className="sticky top-0">
            <div className="flex flex-row-reverse">
                <NavigationUser/>
            </div>
        </div>
        <div className="container">
            {checkRoleAccessLevel(session, "TESTER") ? renderSaves() : renderWaitList()}
        </div>
    </>
} 