"use client"

// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Hooks ----------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import Panel from "@/components/panels/Panel";
import Resources from "@/components/panels/Resources";
import Businesses from "@/components/panels/Businesses";
import MercCard from "./cards/MercCard";
import { DEFAULT_RESOURCES } from "@/data/_config";
import ResourceBadge from "./ResourceBadge";
import ContractCard from "./cards/ContractCard";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function GameBoard() {

    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();
    const mercs = saveFile?.mercs ?? {};
    const contracts = saveFile?.contracts ?? {};
    const resources = { ...DEFAULT_RESOURCES, ...(saveFile?.resources ?? {}) };

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
            
            <Panel panelKey="resources">
                <h3 className="text-3xl pb-2">Resources</h3>
                <ul className="text-xl">
                    {Object.entries(resources).map(([k, value]) => {
                        const key = k as keyof typeof resources;
                        return <ResourceBadge key={key} resourceKey={key} value={value}/>
                    })}
                </ul>
                <div className="p-4" />
                <Businesses/> {/* Replace when i get to the businesses part of the game */}
            </Panel>
            <Panel panelKey="mercs">
                <h3 className="text-3xl pb-2">Mercs</h3>
                {Object.entries(mercs).map(([key, merc]) => (
                    <MercCard key={key} merc={merc} isHired={true}/>
                ))}
            </Panel>
            <Panel panelKey="contracts">
                <h3 className="text-3xl pb-2">Contracts</h3>
                {Object.entries(contracts).map(([key, contract]) => (
                    <ContractCard key={key} contract={contract}/>
                ))}
            </Panel>

        </div>
    );
}

