
// Packages -------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
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
import { getRandomMercs } from "@/utils/mercs";



//______________________________________________________________________________________
// ===== Component =====

export function MercCarousel() {
    const mercs = getRandomMercs({}, 0, 3);
    return (
        <Carousel opts={{ align: "center" }} className="w-full mx-8">
            <CarouselContent>
                {Object.entries(mercs).map(([key, merc]) => (
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
