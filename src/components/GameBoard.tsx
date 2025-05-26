"use client"

// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Hooks ----------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { DEFAULT_RESOURCES, SCALING_CORE_MAGIC_NUMBER_PLAYER } from "@/data/_config";
// Components -----------------------------------------------------------------------
import Panel from "@/components/panels/Panel";
import ResourceBadge from "./ResourceBadge";
import Businesses from "@/components/panels/Businesses";
import MercCard from "./cards/MercCard";
import ContractCard from "./cards/ContractCard";
import BusinessCard from "./cards/BusinessCard";
import { xpToLevel } from "@/utils";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function GameBoard() {

    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();
    const levelPlayer = xpToLevel((saveFile?.resources?.xp ?? 0), SCALING_CORE_MAGIC_NUMBER_PLAYER) || 0;
    const mercs = saveFile?.mercs ?? {};
    const contracts = saveFile?.contracts ?? {};
    const businesses = saveFile?.businesses ?? {};
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
                <h3 className="text-3xl pb-2">Businesses</h3>
                {Object.entries(businesses).map(([key, business]) => (
                    <BusinessCard key={key} business={business} levelPlayer={levelPlayer}/>
                ))}
            </Panel>
            <Panel panelKey="mercs">
                <h3 className="text-3xl pb-2">Mercs</h3>
                {Object.entries(mercs).map(([key, merc]) => (
                    <MercCard key={key} merc={merc} options={{ isHired: true, allowManageMerc: true }}/>
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

