"use client"

// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useDevStore } from "@/stores/useDevStore";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/shadcn/ui/resizable";
// Data -----------------------------------------------------------------------------
import { DEV_SCALES } from "@/stores/useDevStore";
// Components -----------------------------------------------------------------------
import ScalingGrid from "./ScalingGrid";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Micro-Components =====

function ResizablePanels({
    direction="horizontal",
    panel1, 
    panel2, 
 }: Readonly<{ 
    direction?: "horizontal" | "vertical"; 
    panel1: React.ReactNode; 
    panel2: React.ReactNode; 
}>) {
    return (
        <ResizablePanelGroup direction={direction}>
            <ResizablePanel defaultSize={50}>
                {panel1}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
                {panel2}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}


//______________________________________________________________________________________
// ===== Component =====

export default function ScalingScales() {

    //______________________________________________________________________________________
    // ===== Stores =====
    const selectedScales = useDevStore((state) => state.selectedScales);

    //______________________________________________________________________________________
    // ===== Component Return =====
    if(!selectedScales.length) return <>No Scales Selected</>;
    if(selectedScales.length === 1 && selectedScales[0]) return <ScalingGrid devScale={DEV_SCALES[selectedScales[0]]}/>;
    if(selectedScales.length === 2 && selectedScales[0] && selectedScales[1]) return (
        <ResizablePanels
            panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[0]]}/>} 
            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[1]]}/>}
        />
    )
    if(selectedScales.length === 3 && selectedScales[0] && selectedScales[1] && selectedScales[2]) return (
        <ResizablePanels
            direction="vertical"
            panel1={
                <ResizablePanels 
                    panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[0]]}/>} 
                    panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[1]]}/>}
                />
            } 
            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[2]]}/>}
        />
    )
    if(selectedScales.length === 4 && selectedScales[0] && selectedScales[1] && selectedScales[2] && selectedScales[3]) return (
        <ResizablePanels
            direction="vertical"
            panel1={
                <ResizablePanels 
                    panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[0]]}/>} 
                    panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[1]]}/>}
                />
            } 
            panel2={
                <ResizablePanels 
                    panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[2]]}/>} 
                    panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[3]]}/>}
                />
            }
        />
    )
    if(selectedScales.length === 5 && selectedScales[0] && selectedScales[1] && selectedScales[2] && selectedScales[3] && selectedScales[4]) return (
        <ResizablePanels
            direction="vertical"
            panel1={
                <ResizablePanels
                    direction="vertical"
                    panel1={
                        <ResizablePanels 
                            panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[0]]}/>} 
                            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[1]]}/>}
                        />
                    } 
                    panel2={
                        <ResizablePanels 
                            panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[2]]}/>} 
                            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[3]]}/>}
                        />
                    }
                />
            } 
            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[4]]}/>}
        />
    )
    if(selectedScales.length === 6 && selectedScales[0] && selectedScales[1] && selectedScales[2] && selectedScales[3] && selectedScales[4] && selectedScales[5]) return (
        <ResizablePanels
            direction="vertical"
            panel1={
                <ResizablePanels
                    direction="vertical"
                    panel1={
                        <ResizablePanels 
                            panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[0]]}/>} 
                            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[1]]}/>}
                        />
                    } 
                    panel2={
                        <ResizablePanels 
                            panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[2]]}/>} 
                            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[3]]}/>}
                        />
                    }
                />
            } 
            panel2={
                <ResizablePanels 
                    panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[4]]}/>} 
                    panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[5]]}/>}
                />
            }
        />
    )
    if(selectedScales.length === 7 && selectedScales[0] && selectedScales[1] && selectedScales[2] && selectedScales[3] && selectedScales[4] && selectedScales[5] && selectedScales[6]) return (
        <ResizablePanels
            direction="vertical"
            panel1={
                <ResizablePanels
                    direction="vertical"
                    panel1={
                        <ResizablePanels 
                            panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[0]]}/>} 
                            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[1]]}/>}
                        />
                    } 
                    panel2={
                        <ResizablePanels 
                            panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[2]]}/>} 
                            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[3]]}/>}
                        />
                    }
                />
            } 
            panel2={
                <ResizablePanels
                    direction="vertical"
                    panel1={
                        <ResizablePanels 
                            panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[4]]}/>} 
                            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[5]]}/>}
                        />
                    } 
                    panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[6]]}/>}
                />
            }
        />
    )
    if(selectedScales.length === 8 && selectedScales[0] && selectedScales[1] && selectedScales[2] && selectedScales[3] && selectedScales[4] && selectedScales[5] && selectedScales[6] && selectedScales[7]) return (
        <ResizablePanels
            direction="vertical"
            panel1={
                <ResizablePanels
                    direction="vertical"
                    panel1={
                        <ResizablePanels 
                            panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[0]]}/>} 
                            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[1]]}/>}
                        />
                    } 
                    panel2={
                        <ResizablePanels 
                            panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[2]]}/>} 
                            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[3]]}/>}
                        />
                    }
                />
            } 
            panel2={
                <ResizablePanels
                    direction="vertical"
                    panel1={
                        <ResizablePanels 
                            panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[4]]}/>} 
                            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[5]]}/>}
                        />
                    } 
                    panel2={
                        <ResizablePanels 
                            panel1={<ScalingGrid devScale={DEV_SCALES[selectedScales[6]]}/>} 
                            panel2={<ScalingGrid devScale={DEV_SCALES[selectedScales[7]]}/>}
                        />
                    }
                />
            }
        />
    )

    return <ScalingGrid devScale={DEV_SCALES.levels}/>
}

