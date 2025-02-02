"use client"

// Types ----------------------------------------------------------------------------
import { type MutableRefObject } from "react";
// Packages -------------------------------------------------------------------------
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
// Styles ---------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Types & Interfaces =====

interface DragInfo {
    startX: number;
    startY: number;
    top: number;
    left: number;
    width: number;
    height: number;
}

interface Position {
    x?: number;
    y?: number;
}


//______________________________________________________________________________________
// ===== True Constants =====

const DEFAULT_DRAG_INFO = {
    startX: 0,
    startY: 0,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
}



//______________________________________________________________________________________
// ===== Hook =====

export default function useDrag({ 
    ref, 
    calculateFor="topLeft" 
}: Readonly<{ 
    ref:MutableRefObject<any>;
    calculateFor?: "topLeft" | "bottomRight"
}>){
    
    //______________________________________________________________________________________
    // ===== State =====
    const [dragInfo, setDragInfo] = useState<DragInfo>(DEFAULT_DRAG_INFO);
    const [finalPosition, setFinalPosition] = useState<Position>({});
    const [isDragging, setIsDragging] = useState(false);



    //______________________________________________________________________________________
    // ===== Use Callback Functions =====
    
    const updateFinalPosition = useCallback((width:number, height:number, x:number, y:number) => {
        if (calculateFor === "bottomRight") {
            setFinalPosition({
                x: Math.max( Math.min( window.innerWidth - width, window.innerWidth - (x + width)), 0 ),
                y: Math.max( Math.min( window.innerHeight - height, window.innerHeight - (y + height)), 0),
            });
            return;
        }

        setFinalPosition({
            x: Math.min(Math.max(0, x), window.innerWidth - width),
            y: Math.min(Math.max(0, y), window.innerHeight - height)
        });
    }, [calculateFor]);

    const handleMouseMove = useCallback((e: any) => {
            const { clientX, clientY } = e;
            const { startX, startY, top, left, width, height } = { ...DEFAULT_DRAG_INFO, ...dragInfo };
            const { current: draggableElement } = ref;

            if (!isDragging || !draggableElement) return;
            e.preventDefault();

            const position = { x: startX - clientX, y: startY - clientY };
            updateFinalPosition(width, height, (left || 0) - position.x, (top || 0) - position.y);
        },
        [isDragging, dragInfo, ref, updateFinalPosition]
    );



    //______________________________________________________________________________________
    // ===== Functions =====

    const handleMouseUp = (e: Event) => {
        e.preventDefault();
        setIsDragging(false);
    }

    const handleMouseDown = (e: any) => {
        e.preventDefault();
        const { clientX, clientY } = e;
        const { current: draggableElement } = ref;

        if (!draggableElement) return;

        const { top, left, width, height } = draggableElement.getBoundingClientRect();
        setDragInfo({ startX:clientX, startY:clientY, top, left, width, height });
        setIsDragging(true);
    }

    const recalculate = (width:number, height:number) => {
        const { current: draggableElement } = ref;
        const { top, left, width:boundingWidth, height:boundingHeight } = draggableElement.getBoundingClientRect();
        updateFinalPosition( width ?? boundingWidth, height ?? boundingHeight, left, top );
    }



    //______________________________________________________________________________________
    // ===== Use Effects =====

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove]);



    //______________________________________________________________________________________
    // ===== Hook Return =====
    return {
        position: finalPosition,
        handleMouseDown,
        recalculate
    };
};
