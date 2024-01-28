
// Components------------------------------------------------------------------------
import { Button } from "@/components/shadcn/ui/button";
// Other-----------------------------------------------------------------------------
import { renderFontAwesomeIcons } from "@/util/icons";



//______________________________________________________________________________________
// ===== Component  =====
export default function BottomBar(){
    return(
        <div className="flexItemsEvenly">
            <div>
                <Button>{renderFontAwesomeIcons({ key:"faNewspaper", className:"h-[29px]" })}</Button>
                <Button className="mx-14">{renderFontAwesomeIcons({ key:"faComment", className:"h-[29px]" })}</Button>
            </div>
            <Button>{renderFontAwesomeIcons({ key:"faBook", className:"h-[29px]" })}</Button>
        </div>
    )
}