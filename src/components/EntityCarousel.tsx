
// Packages -------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/shadcn/ui/carousel";
import MercCard from "./cards/MercCard";
import type { Business, Contract, Merc, SaveFile } from "@/types";
import ContractCard from "./cards/ContractCard";
// Other ---------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Types =====

type Type = "mercs" | "contracts" | "businesses";


//______________________________________________________________________________________
// ===== Pure Functions =====

const decideWhatEntitiesToUse = (type: Type, saveFile: SaveFile) => {
    const { potentialMercs, potentialContracts, potentialBusinesses } = saveFile ?? {};
    switch (type) {
        case "mercs": return potentialMercs?.mercs ?? {};
        case "contracts": return potentialContracts?.contracts ?? {};
        case "businesses": return potentialBusinesses?.businesses ?? {};
        default: return {};
    }
}



//______________________________________________________________________________________
// ===== Component =====

export function EntityCarousel({ type }: Readonly<{ type: Type; }>) {

    //______________________________________________________________________________________
    // ===== Component Return =====
    const { saveFile } = useSaveFile();
    const entities = saveFile?.id ? decideWhatEntitiesToUse(type, saveFile) : {};

    

    //______________________________________________________________________________________
    // ===== Functions =====

    const renderCard = (entity: Merc | Contract | Business) => { 
        console.log({ trace: "renderCard", entity, type });
        switch (type) {
            case "mercs": return <MercCard merc={entity as Merc} />;
            case "contracts": return <ContractCard contract={entity as Contract} />;
            case "businesses": return <></>;
            default: return <></>;
        }
    }



    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <Carousel 
            className="w-full mx-8" 
            orientation={type === "mercs" ? "horizontal" : "vertical"}
            opts={{ align: "center" }}
        >
            <CarouselContent>
                {Object.entries(entities).map(([key, entity]) => (
                    <CarouselItem key={key} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            {renderCard(entity)}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
