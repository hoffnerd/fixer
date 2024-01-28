
// Components------------------------------------------------------------------------
import NavButton from "./NavButton";
import NavButtonMore from "./NavButtonMore";



//______________________________________________________________________________________
// ===== Component =====
export default function BottomNav(){
    return (
        <div className="grid grid-cols-4 sticky top-[100vh] hiddenOnDesktop hiddenOnTablet">
            <NavButton panelKey="notifications" iconKey="faBell" />
            <NavButton panelKey="mercs" iconKey="faUsers" />
            <NavButton panelKey="contracts" iconKey="faFile" />
            <NavButtonMore/>
        </div>
    )
}