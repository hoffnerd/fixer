// Components -----------------------------------------------------------------------
import SaveFile from "@/components/SaveFile";
// Server----------------------------------------------------------------------------
import { readServerSession } from "@/lib/protector";
import { readSaveFilesByUserId } from "@/lib/saveFile";
// Other-----------------------------------------------------------------------------
import { isArray, isObj } from "@/util";

const testSaves = [
    { id:1, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
    { id:2, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
    { id:3, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
    { id:4, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
    { id:5, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
    { id:6, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
    { id:7, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
    { id:8, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
    { id:9, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
    { id:10, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
    { id:11, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
    { id:12, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
    { id:13, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
    { id:14, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
    { id:15, userId:"me", name:"Thor", chapter:0, type:"Story", createdAt:"Now", updatedAt:"Later" },
    { id:16, userId:"me", name:"Next", chapter:0, type:"Unlimited", createdAt:"Now", updatedAt:"Later" },
]

//______________________________________________________________________________________
// ===== Component  =====
export default async function SaveFiles(){

    //______________________________________________________________________________________
    // ===== Constants  =====
    const session = await readServerSession();
    // const saveFiles = isObj(session) && isObj(session.user, ["id"]) ? await readSaveFilesByUserId(session.user.id) : [];
    const saveFiles = testSaves;

    //______________________________________________________________________________________
    // ===== Component Return  =====
    return <>
        {isArray(saveFiles) && saveFiles.map((saveFile)=> <SaveFile key={saveFile.id} saveFile={saveFile} />)}
    </>
} 