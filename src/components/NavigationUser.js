"use client"

// React/Next-----------------------------------------
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
// Context--------------------------------------------
import { useSession } from "next-auth/react"
// Components-----------------------------------------
import Loading from '@/components/Loading';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
    NavigationListItem,
} from "@/components/shadcn/ui/navigation-menu";
// Other-----------------------------------------------
import { checkRoleAccessLevel } from '@/util';



//______________________________________________________________________________________
// ===== Constants =====

const components = [
    {
        title: "My Saves",
        href: "/play",
        description: "View all your save files and select one to play.",
    },
    {
        title: "My Paths",
        href: "/paths",
        description: "View all the events that your saves have seen.",
    },
    {
        title: "Settings",
        href: "/settings",
        description: "View and change your account settings.",
    },
]


//______________________________________________________________________________________
// ===== Component =====

export default function NavigationUser() {

    //______________________________________________________________________________________
    // ===== State from Auth =====
    const { data: session, status } = useSession();



    //______________________________________________________________________________________
    // ===== Handler Functions =====

    /**
     * If the user is signing in, call the signIn() function by NextAuth, otherwise call the signOut() function by NextAuth.
     * @param e - the event object
     * @param [inOut=out] - This is a string that can be either "in" or "out". This is used to determine whether the user is signing in or signing out.
     */
    const handleLoginLogout = (e, inOut="out") => {
        e.preventDefault();
        if(inOut === "in") return signIn();
        signOut({ callbackUrl: "/" });
    };



    //______________________________________________________________________________________
    // ===== Render Functions  =====

    const renderMenuContent = () => (
        <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                    <NavigationListItem key={component.title} title={component.title} href={component.href}>
                        {component.description}
                    </NavigationListItem>
                ))}
                <NavigationListItem key="logout" title="Logout" href="#logout" onClick={(e)=>handleLoginLogout(e)}>
                    Your data will not be lost.
                </NavigationListItem>
            </ul>
        </NavigationMenuContent>
    )

    const renderMenuItemLoading = () => ( 
        <Link href="#loading" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Loading />
            </NavigationMenuLink>
        </Link>
    )

    // <a href="#login" className="activator" onClick={(e) => handleLoginLogout(e, "in")}>Login</a>;
    const renderMenuItemLogin = () => ( 
        <Link href="#login" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} onClick={(e)=>handleLoginLogout(e, "in")}>
                Login
            </NavigationMenuLink>
        </Link>
    )


    const renderMenuItem = () => {
        if (status === "loading") return renderMenuItemLoading();
        if (!checkRoleAccessLevel(session, "USER")) return renderMenuItemLogin();
        return <>
            <NavigationMenuTrigger>{session.user.screenName}</NavigationMenuTrigger>
            {renderMenuContent()}
        </>
    }


    //______________________________________________________________________________________
    // ===== Component Return  =====
    return (
        <NavigationMenu xPosition="right-0">
            <NavigationMenuList>
                <NavigationMenuItem>{renderMenuItem()}</NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
