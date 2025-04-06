"use client"

// Types ----------------------------------------------------------------------------
import type { DevHighlightColor } from "@/stores/useDevStore";
// Packages -------------------------------------------------------------------------
import Link from "next/link";
// Stores ---------------------------------------------------------------------------
import { useDevStore } from "@/stores/useDevStore";
// Data -----------------------------------------------------------------------------
import { COLOR_TO_CLASS_MAP } from "@/data/_config";
import { DEV_SCALES } from "@/stores/useDevStore";
// Components -----------------------------------------------------------------------
import { Input } from "@/components/shadcn/ui/input";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/shadcn/ui/menubar";
import { Button } from "@/components/shadcn/ui/button";
// Other ----------------------------------------------------------------------------




//______________________________________________________________________________________
// ===== Component =====

export default function ScalingMenu() {

    //______________________________________________________________________________________
    // ===== Stores =====
    const reset = useDevStore((state) => state.reset);
    const setStoreKeyValuePair = useDevStore((state) => state.setStoreKeyValuePair);
    const playerLevelMin = useDevStore((state) => state.playerLevelMin);
    const playerLevelMax = useDevStore((state) => state.playerLevelMax);
    const entityLevelMin = useDevStore((state) => state.entityLevelMin);
    const entityLevelMax = useDevStore((state) => state.entityLevelMax);
    const highlightColor = useDevStore((state) => state.highlightColor);
    const selectedScales = useDevStore((state) => state.selectedScales);



    //______________________________________________________________________________________
    // ===== Functions =====

    const handleMinMaxChange = (
        keyStart: "player" | "entity",
        keyEnd: "LevelMin" | "LevelMax",
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const key = `${keyStart}${keyEnd}`;
        const difference = keyStart === "player" 
            ? (playerLevelMax ?? 0) - (playerLevelMin ?? 0) 
            : (entityLevelMax ?? 0) - (entityLevelMin ?? 0)

        if(keyEnd === "LevelMin") {
            return setStoreKeyValuePair({ 
                [`${keyStart}LevelMin`]: e.target.value ? parseInt(e.target.value) : "",
                [`${keyStart}LevelMax`]: (e.target.value ? parseInt(e.target.value) : 0) + difference,
            });
        }

        setStoreKeyValuePair({ [key]: e.target.value ? parseInt(e.target.value) : "" });
    }



    //______________________________________________________________________________________
    // ===== Component Return =====

    return (
        <Menubar className="sticky left-0 top-0 z-5 bg-background">

            <MenubarMenu>
                <MenubarTrigger>Navigate</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem asChild>
                        <Link href="/">Game</Link>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>Inputs</MenubarTrigger>
                <MenubarContent>
                    <MenubarLabel>Player Level Min/Max</MenubarLabel>
                    <MenubarItem asChild>
                        <Input 
                            type="number"
                            placeholder="Min" 
                            value={playerLevelMin} 
                            onChange={(e) => handleMinMaxChange("player", "LevelMin", e)}
                        />
                    </MenubarItem>
                    <MenubarItem asChild>
                        <Input 
                            type="number"
                            placeholder="Max"
                            value={playerLevelMax} 
                            onChange={(e) => handleMinMaxChange("player", "LevelMax", e)}
                        />
                    </MenubarItem>

                    <MenubarSeparator />

                    <MenubarLabel>Entity Level Min/Max</MenubarLabel>
                    <MenubarItem asChild>
                        <Input 
                            type="number"
                            placeholder="Min" 
                            value={entityLevelMin} 
                            onChange={(e) => handleMinMaxChange("entity", "LevelMin", e)}
                        />
                    </MenubarItem>
                    <MenubarItem asChild>
                        <Input 
                            type="number"
                            placeholder="Max" 
                            value={entityLevelMax} 
                            onChange={(e) => handleMinMaxChange("entity", "LevelMax", e)}
                        />
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>Highlight Color</MenubarTrigger>
                <MenubarContent>
                    {Object.entries(COLOR_TO_CLASS_MAP).map(([k, value]) => {
                        const key = k as DevHighlightColor;
                        return (
                            <MenubarItem key={key} asChild>
                                <Button 
                                    variant={highlightColor === key ? "neonEffectWithGlow" : "outline"}
                                    className={`${value} w-full capitalize`}
                                    onClick={()=>setStoreKeyValuePair({ highlightColor: key })}
                                >
                                    {key}
                                </Button>
                            </MenubarItem>
                        )
                    })}
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>Scales</MenubarTrigger>
                <MenubarContent>
                    {Object.entries(DEV_SCALES).map(([k, value]) => {
                        const key = k as keyof typeof DEV_SCALES;
                        const isSelected = selectedScales.includes(key);
                        return (
                            <MenubarItem key={key} asChild>
                                <Button 
                                    variant={isSelected ? "neonEffectWithGlow" : "outline"}
                                    className={`${COLOR_TO_CLASS_MAP[highlightColor]} w-full`}
                                    onClick={()=>{
                                        let newSelectedScales = structuredClone(selectedScales);
                                        if(isSelected) newSelectedScales = newSelectedScales.filter(k => k !== key);
                                        else newSelectedScales.push(key);
                                        setStoreKeyValuePair({ selectedScales: newSelectedScales });
                                    }}
                                >
                                    {value.display}
                                </Button>
                            </MenubarItem>
                        )
                    })}
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>Reset</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem asChild>
                        <Button 
                            variant="neonEffectWithGlow" 
                            className="neColorRed w-full"
                            onClick={reset}
                        >
                            Reset
                        </Button>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

        </Menubar>
    );
}

