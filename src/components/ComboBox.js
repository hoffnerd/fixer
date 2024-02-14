"use client"

// React/Next------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
// Components------------------------------------------------------------------------
import { Button } from "@/components/shadcn/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/shadcn/ui/command";
// Other-----------------------------------------------------------------------------
import { cn } from "@/util/shadcn";



//______________________________________________________________________________________
// ===== Component =====
export default function ComboBox({ data, active, setActive }) {
    
    //______________________________________________________________________________________
    // ===== State =====
    const [open, setOpen] = useState(false)

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[100%] justify-between"
                >
                    <span className="overflow-hidden">{active ? data.find((dataObj) => dataObj.key === active)?.display : "Please Select..."}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[85vw] p-0">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>Nothing was found.</CommandEmpty>
                    <CommandGroup>
                        {data.map(({ key, display }) => (
                            <CommandItem
                                key={key}
                                value={key}
                                onSelect={(currentKey) => {
                                    setActive(currentKey === active ? "" : currentKey);
                                    setOpen(false);
                                }}
                            >
                                <Check className={cn("mr-2 h-4 w-4", active === key ? "opacity-100" : "opacity-0")} />
                                <span className="overflow-hidden">{display}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}