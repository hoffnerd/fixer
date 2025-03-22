


// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
import { BookIcon, CastleIcon, ScrollTextIcon, UsersIcon } from "lucide-react";
// Stores ---------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import Panel from "@/components/Panel";
import Resources from "@/components/Resources";
import MobileNavButton from "@/components/MobileNavButton";
import Mercs from "@/components/Mercs";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function Page() {
    return (
        <main className="h-dvh lg:p-6">
            <div className="h-full grid grid-rows-5 sm-h:grid-rows-8 gap-3">
                <div className="px-3 pt-3 row-span-4 sm-h:row-span-7 lg:p-0 lg:!row-span-8">

                    <div className="h-full grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
                        
                        <Panel panelKey="resources">
                            <Resources isNoUI/>
                        </Panel>
                        <Panel panelKey="mercs">
                            <Mercs isNoUI/>
                        </Panel>
                        <Panel panelKey="contracts">
                            <h3 className="text-3xl pb-2">Contracts</h3>
                        </Panel>

                    </div>

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

