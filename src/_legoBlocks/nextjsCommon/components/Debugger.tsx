"use client";

// Packages --------------------------------------------------------------------------
import { useEffect, useRef, useState } from "react";
import { BugOffIcon } from "lucide-react";
// Stores ----------------------------------------------------------------------------
// Hooks -----------------------------------------------------------------------------
import useDrag from "../hooks/useDrag";
// Components ------------------------------------------------------------------------
import { Button } from "@/components/shadcn/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/shadcn";
// Other -----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function Debugger({
    children,
    pathsToHideOn=[],
    shouldRender=false,
}: Readonly<{ 
    children?: React.ReactNode;
    pathsToHideOn?: Array<string>;
    shouldRender?: boolean;
}>) {

    //______________________________________________________________________________________
    // ===== References =====
    const ref = useRef(null);

    //______________________________________________________________________________________
    // ===== Hooks =====
    const pathname = usePathname()
    const { position, handleMouseDown } = useDrag({ ref });

    //______________________________________________________________________________________
    // ===== State =====
    const [openDebugger, setOpenDebugger] = useState<boolean>(false);
    const [openCommands, setOpenCommands] = useState<boolean>(false);

    //______________________________________________________________________________________
    // ===== Component Return =====
    if(pathsToHideOn.length > 0 && pathsToHideOn.includes(pathname)) return;
    if (!shouldRender) return;
    return (
        <div
            ref={ref}
            className={cn(
                "fixed right-3 top-3 z-50 max-w-80 overflow-hidden border-2 border-slate-100",
                (pathsToHideOn.length > 0 && pathsToHideOn.includes(pathname)) && "!h-0 !w-0",
                (!openDebugger) && "w-14",
            )}
            style={{ top: position.y, left: position.x }}
        >
            <div
                className="cursor-move border-b border-slate-100 bg-slate-950"
                onMouseDown={handleMouseDown}
            >
                <div className="flex w-full">
                    <Button
                        variant="ghost"
                        className="float-right *:h-5 *:w-5"
                        onClick={()=>setOpenDebugger(previousOpen => !previousOpen)}
                    >
                        <BugOffIcon />
                    </Button>
                    <span className="pt-[0.35rem]">{openDebugger && "Debugger"}</span>
                    
                </div>
            </div>
            <div className={`relative overflow-auto ${openDebugger ? "bg-slate-950 p-4" : "hidden"}`}>  
                <div className="flex flex-col">
                    <Button variant="outline" className="full-w" onClick={()=>setOpenCommands(previousOpen => !previousOpen)}>
                        {openCommands ? "Close" : "Open"} Commands
                    </Button>
                </div>
                <div className={`absolute top-14 left-0 p-3 bg-slate-800 border-2 border-slate-100 w-[269px] ${(!openCommands) && "hidden"}`}>
                    {children}
                    <div id="debuggerCommands"/>
                </div>
                <br />
                <div id="debuggerContent">
                    
                </div>
            </div>
        </div>
    );
}
