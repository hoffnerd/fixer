"use client"

// Types ----------------------------------------------------------------------------
import { type SaveFile } from "@/types";
// Packages -------------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import Portal from "@/_legoBlocks/nextjsCommon/components/Portal";
import { Button } from "../shadcn/ui/button";
import GameStorePortals from "./GameStorePortals";
import InGameTime from "./InGameTime";
import ResourcesWatcher from "./ResourcesWatcher";
import SessionTime from "./SessionTime";
import { getRandomMercs } from "@/utils/mercs";
import SaveQueueClient from "./SaveQueueClient";
// Data -----------------------------------------------------------------------------
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Micro-Components =====

function SaveFileClientPortals({ saveFile }: Readonly<{ saveFile: SaveFile }>) {
    if (process.env.NODE_ENV === "production") return;
    return <>
        <Portal targetElementId="debuggerContent" childElementId="SaveFileClient.saveFile.id">
            <ul id="SaveFileClient.saveFile.id" className="list-disc ml-5">
                <li><strong>saveFile.id: </strong> {saveFile?.id}</li>
            </ul>
        </Portal>
        <Portal targetElementId="debuggerCommands" childElementId="SaveFileClient.commands">
            <div id="SaveFileClient.commands" className="flex flex-col">
                <Button 
                    variant="neonEffect"
                    className="neColorBlue"
                    onClick={()=>console.log({ trace:"SaveFileClient", saveFile })}
                >
                    Log SaveFile
                </Button>
                <Button 
                    variant="neonEffect"
                    className="neColorRed"
                    onClick={()=>localStorage.setItem("saveFileId", "")}
                >
                    Clear localStorage saveFileId
                </Button>
                <Button 
                    variant="neonEffect"
                    className="neColorBlue"
                    onClick={()=>console.log( getRandomMercs({}, 0, 10) )}
                >
                    Log & Generate Random Mercs
                </Button>
            </div> 
        </Portal>
    </>
}



//______________________________________________________________________________________
// ===== Component =====

export default function GameClient() {
    const { saveFile } = useSaveFile();

    // useEffect(() => {
    //     if (process.env.NODE_ENV === "production") return;
    //     console.log({ trace:"SaveFileClient", saveFile });
    // }, [saveFile])
    
    if (!saveFile?.id) return <></>;
    return <>
        <GameStorePortals />
        <SaveFileClientPortals saveFile={saveFile} />
        <SaveQueueClient />
        <SessionTime />
        <InGameTime saveFile={saveFile} />
        <ResourcesWatcher />
    </>
}