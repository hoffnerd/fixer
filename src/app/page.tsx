
// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
import { BookIcon, CastleIcon, ScrollTextIcon, UsersIcon } from "lucide-react";
// Stores ---------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import GameBoard from "@/components/GameBoard";
import MobileNavButton from "@/components/MobileNavButton";
// Other ----------------------------------------------------------------------------




//______________________________________________________________________________________
// ===== Component =====

export default function Page() {
    return (
        <main className="h-dvh lg:p-6">
            <div className="h-full grid grid-rows-5 sm-h:grid-rows-8 gap-3">
                <div className="px-3 pt-3 row-span-4 sm-h:row-span-7 lg:p-0 lg:!row-span-8">
                    <GameBoard/>
                </div>
                <div className="lg:hidden w-full h-full">
                    <MobileNavButton panelKey="resources"><ScrollTextIcon/></MobileNavButton>
                    <MobileNavButton panelKey="mercs"><UsersIcon/></MobileNavButton>
                    <MobileNavButton panelKey="contracts"><CastleIcon/></MobileNavButton>
                    <MobileNavButton panelKey="other"><BookIcon/></MobileNavButton>
                </div>
            </div>
        </main>
    );
}

