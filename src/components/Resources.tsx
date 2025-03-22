"use client"

// Types ----------------------------------------------------------------------------
import { type Resources as ResourcesType } from "@/types";
// Packages -------------------------------------------------------------------------
import { BadgeEuroIcon, CircuitBoardIcon, DrillIcon, KeyboardIcon } from "lucide-react";
// Data -----------------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
import ResourceBadge from "./ResourceBadge";
import { ObjectDisplay } from "@/_nextjsCommon/components/microComponents";
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

export default function Resources({ isNoUI }: Readonly<{ isNoUI?: boolean }>) {
    const { saveFile } = useSaveFile();
    const resources = saveFile?.resources ? { ...DEFAULT_RESOURCES, ...saveFile.resources } : DEFAULT_RESOURCES;

    if(!saveFile) return <></>;
    if(isNoUI) return <ObjectDisplay className="ml-5 list-disc" obj={resources} />
    return <>
        <h3 className="text-3xl pb-2">Resources</h3>
        <ul className="text-xl">
            <ResourceBadge resourceKey="euros" value={resources.euros}/>
            <ResourceBadge resourceKey="weapons" value={resources.weapons}/>
            <ResourceBadge resourceKey="medicals" value={resources.medicals}/>
            <ResourceBadge resourceKey="hacks" value={resources.hacks}/>
        </ul>
    </>
}

