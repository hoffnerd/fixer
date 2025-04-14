
// Types ----------------------------------------------------------------------------
import { type Metadata } from "next";
// Packages -------------------------------------------------------------------------
// Styles ---------------------------------------------------------------------------
import "@/styles/globals.css";
// Fonts ----------------------------------------------------------------------------
import { Roboto_Mono } from "next/font/google";
// Data -----------------------------------------------------------------------------
import { PROJECT_DESCRIPTION, PROJECT_DISPLAY_NAME } from "@/data/_config";
// Components -----------------------------------------------------------------------
import ClientProvider from "@/_legoBlocks/rQuery/components/ClientProvider";
import Debugger from "@/_legoBlocks/nextjsCommon/components/Debugger";
import SavingGameIcon from "@/components/gameClient/SavingGameIcon";
import GameClient from "@/components/gameClient/GameClient";
import { Toaster } from "@/components/shadcn/ui/sonner";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Meta Data =====

export const metadata: Metadata = {
    title: PROJECT_DISPLAY_NAME,
    description: PROJECT_DESCRIPTION,
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};



//______________________________________________________________________________________
// ===== Fonts =====

// const geist = Geist({
//     subsets: ["latin"],
//     variable: "--font-geist-sans",
// });

const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    variable: "--font-roboto-mono-sans",
});



//______________________________________________________________________________________
// ===== Component =====

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const isDevMode = process.env.NODE_ENV === "development";
    return (
        <html lang="en" className={`${robotoMono.variable} dark neonEffect neScrollBar neColorPurple`}>
            <body>
                <ClientProvider shouldRenderDevTools={isDevMode}>
                    <Debugger pathsToHideOn={["/scaling"]} shouldRender={isDevMode}>
                        <Button variant="neonEffect" className="neColorGreen w-full" asChild>
                            <Link href="/scaling">Scaling Tool</Link>
                        </Button>
                    </Debugger>
                    <SavingGameIcon />
                    <GameClient />
                    {children}
                    <Toaster />
                </ClientProvider>
            </body>
        </html>
    );
}

