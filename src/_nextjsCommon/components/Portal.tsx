"use client"

// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
// Hooks ----------------------------------------------------------------------------
import useTimer from "../hooks/useTimer";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function Portal({
    children,
    targetElementId,
    childElementId,
    debug=false,
}: Readonly<{ 
    children: React.ReactNode; 
    targetElementId: string;
    childElementId: string;
    debug?: boolean;
}>){

    //______________________________________________________________________________________
    // ===== Use Ref =====
    const targetElement = useRef<Element | any>(null);
    const childElement = useRef<Element | any>(null);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const [ targetTries, stopTargetTimer ] = useTimer(1000, { cycleLimit:5 });
    const [ childTries, stopChildTimer ] = useTimer(1000, { cycleLimit:10 });



    //______________________________________________________________________________________
    // ===== Use Effect =====

    // useEffect(() => {
    //     targetElement.current = window.document.getElementById(targetElementId);
    // }, [])

    useEffect(() => {
        if(debug) console.log({ trace:`Portal > target:${targetElementId}`, "targetElement.current": targetElement.current })
        if(targetElement.current){
            stopTargetTimer();
            return;
        }
        targetElement.current = window.document.getElementById(targetElementId);
    }, [targetTries, targetElement.current])

    useEffect(() => {
        if(debug) console.log({ trace:`Portal > child:${childElementId}`, "childElement.current": childElement.current })
        if(childElement.current){
            stopChildTimer();
            return;
        }
        childElement.current = window.document.getElementById(childElementId);
    }, [childTries, childElement.current])

 

    //______________________________________________________________________________________
    // ===== Component Return =====
    if(!targetElement.current) return;
    return (
        <div id={`target:${targetElementId}_child:${childElementId}`}>
            {createPortal(children, targetElement.current)}
        </div>
    );
}
