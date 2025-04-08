
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
// Other ---------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export function MercCarousel() {

    //______________________________________________________________________________________
    // ===== Component Return =====
    const { saveFile } = useSaveFile();


    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <Carousel opts={{ align: "center" }} className="w-full mx-8">
            <CarouselContent>
                {Object.entries(saveFile?.potentialMercs?.mercs ?? {}).map(([key, merc]) => (
                    <CarouselItem key={key} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <MercCard merc={merc}/>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
