// React/Next -----------------------------------------------------------------------
import { Suspense } from "react";
// Components -----------------------------------------------------------------------
import NavigationUser from "@/components/NavigationUser";
import NewSaveFile from "@/components/NewSaveFile";
import Loading from "@/components/Loading";
import SaveFiles from "@/components/SaveFiles";
// Other ----------------------------------------------------------------------------

// const testSaves = [
//     { id:1, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
//     { id:2, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
//     { id:3, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
//     { id:4, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
//     { id:5, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
//     { id:6, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
//     { id:7, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
//     { id:8, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
//     { id:9, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
//     { id:10, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
//     { id:11, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
//     { id:12, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
//     { id:13, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
//     { id:14, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
//     { id:15, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
//     { id:16, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
// ]

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