"use client"

// Types ----------------------------------------------------------------------------
import { type Resources as ResourcesType } from "@/types";
// Packages -------------------------------------------------------------------------
import { BadgeEuroIcon, CircuitBoardIcon, DrillIcon, KeyboardIcon } from "lucide-react";
// Data -----------------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
import ResourceBadge from "./ResourceBadge";
// Components -----------------------------------------------------------------------
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== True Constants =====

const DEFAULT_RESOURCES: ResourcesType = {
    euros: 0,
    weapons: 0,
    medicals: 0,
    hacks: 0,
}



//______________________________________________________________________________________
// ===== Component =====

export default function Resources() {
    const { saveFile } = useSaveFile();
    const resources = saveFile?.resources ? { ...DEFAULT_RESOURCES, ...saveFile.resources } : DEFAULT_RESOURCES;

    if(!saveFile) return <></>;
    return (
        <ul className="text-xl">
            <ResourceBadge resourceKey="euros" value={resources.euros}/>
            <ResourceBadge resourceKey="weapons" value={resources.weapons}/>
            <ResourceBadge resourceKey="medicals" value={resources.medicals}/>
            <ResourceBadge resourceKey="hacks" value={resources.hacks}/>
        </ul>
    );
}

