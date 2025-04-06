"use client"

// Types ----------------------------------------------------------------------------
import { handleScaling, type ScalingCallback } from "@/utils/scaling";
// Packages -------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useDevStore, type DevScale } from "@/stores/useDevStore";
// Data -----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import { Button } from "@/components/shadcn/ui/button";
import { COLOR_MAP, SCALING_CORE_MAGIC_NUMBER, SCALING_CORE_MAGIC_NUMBER_PLAYER } from "@/data/_config";
import { useEffect } from "react";
import { levelToXp } from "@/utils";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Types =====

type HighlightClass = "" | "neColorPurple" | "neColorBlue" | "neColorYellow" | "neColorGreen" | "neColorPink" | "neColorRed" | "neColorOrange" | "neColorWhite";



//______________________________________________________________________________________
// ===== Component =====

export default function ScalingGrid({ devScale }: Readonly<{ devScale?: DevScale; }> = {}) {

    //______________________________________________________________________________________
    // ===== Stores =====
    const setStoreKeyValuePair = useDevStore((state) => state.setStoreKeyValuePair);
    const playerLevelMin = useDevStore((state) => state.playerLevelMin);
    const playerLevelMax = useDevStore((state) => state.playerLevelMax);
    const entityLevelMin = useDevStore((state) => state.entityLevelMin);
    const entityLevelMax = useDevStore((state) => state.entityLevelMax);
    const highlightColor = useDevStore((state) => state.highlightColor);
    const highlights = useDevStore((state) => state.highlights);

    useEffect(() => {
        console.log({ trace: "ScalingGrid", highlightColor, highlights });
    }, [highlightColor, highlights]);


    //______________________________________________________________________________________
    // ===== Constants =====
    const numRows = Math.abs((playerLevelMax ?? 0) - (playerLevelMin ?? 0)) + 2;
    const numCols = Math.abs(entityLevelMax ?? 0) - Math.abs(entityLevelMin ?? 0) + 2;



    //______________________________________________________________________________________
    // ===== Functions =====

    const onClick = (key: string, highlightClass?: HighlightClass) => {
        let highlightsToSet = structuredClone(highlights);
        if(!highlightClass){
            highlightsToSet[highlightColor].push(key);
        } else {
            const temp = highlightsToSet[ COLOR_MAP[highlightClass] as keyof typeof highlights ]
            highlightsToSet[ COLOR_MAP[highlightClass] as keyof typeof highlights ] = temp.filter(k => k !== key);
        }
        setStoreKeyValuePair({ highlights: highlightsToSet });
    }

    const getHighlightClass = (key: string): HighlightClass => {
        for(const highlightKey in highlights) {
            const k = highlightKey as keyof typeof highlights
            if(highlights[k].includes(key)) return COLOR_MAP[k] as HighlightClass;
        }
        return "";
    }

    const createCells = () => Array.from({ length: numRows * numCols }, (_, index) => {
        const row = Math.floor(index / numCols);
        const col = index % numCols;
        const x = (entityLevelMin ?? 0) + col;
        const y = (playerLevelMin ?? 0) + row;

        const key = `${x}-${y}`;
        const highlightClass = getHighlightClass(key);
        const entityLevel = x - 1;
        const playerLevel = y - 1;

        const xpEntity = levelToXp(entityLevel, SCALING_CORE_MAGIC_NUMBER);
        const xpPlayer = levelToXp(playerLevel, SCALING_CORE_MAGIC_NUMBER_PLAYER);
        const scale = devScale?.callback && handleScaling(devScale.callback, { xpPlayer, xpEntity, ...devScale.options });

        if(entityLevelMin === x && playerLevelMin === y) return (
            <div key={key} className="p-2 text-center">
                {`Pv`}&nbsp;&nbsp;&nbsp;{`E>`}
            </div>
        );
        if(entityLevelMin === x) return (
            <div key={key} className="p-2 text-center">
                {playerLevel}
            </div>
        );
        if(playerLevelMin === y) return (
            <div key={key} className="p-2 text-center">
                {entityLevel}
            </div>
        );
        return (
            <Button 
                key={key} 
                className={highlightClass}
                variant={highlightClass ? "neonEffectWithGlow" : "outline"}
                onClick={()=>onClick(key, highlightClass)}
            >
                {scale?.max ?? `(${entityLevel}, ${playerLevel})`}
            </Button>
        );
    });



    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <div className="overflow-auto p-3 max-h-full">
            <h1 className="text-3xl pb-2">{devScale?.display}</h1>
            <div className="pt-3">
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }}>
                    {createCells()}
                    {/* {createCells().map((cell, index) => (
                        <Button key={index} className="border border-gray-700 p-2 text-center">
                            {cell}
                        </Button>
                    ))} */}
                </div>
            </div>
        </div>
    );
}

