import { Card, CardContent } from "@/components/shadcn/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/shadcn/ui/carousel";
import MercCard from "./cards/MercCard";
import { getRandomMercs } from "@/utils/mercs";

export function MercCarousel() {
    const mercs = getRandomMercs({}, 4, 3);
    return (
        <Carousel
            opts={{ align: "center" }}
            className="w-full"
        >
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
