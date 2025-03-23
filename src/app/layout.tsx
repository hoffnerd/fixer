
// Types ----------------------------------------------------------------------------
import { type Metadata } from "next";
// Packages -------------------------------------------------------------------------
// Styles ---------------------------------------------------------------------------
import "@/styles/globals.css";
// Fonts ----------------------------------------------------------------------------
import { Geist } from "next/font/google";
// Data -----------------------------------------------------------------------------
import { PROJECT_DESCRIPTION, PROJECT_DISPLAY_NAME } from "@/data/_config";
// Components -----------------------------------------------------------------------
import ClientProvider from "@/_legoBlocks/rQuery/components/ClientProvider";
import Debugger from "@/_legoBlocks/nextjsCommon/components/Debugger";
import { Toaster } from "@/components/shadcn/ui/sonner";
import SavingGameIcon from "@/components/gameClient/SavingGameIcon";
import GameClient from "@/components/gameClient/GameClient";
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

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
});



//______________________________________________________________________________________
// ===== Component =====

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const isDevMode = process.env.NODE_ENV === "development";
    return (
        <html lang="en" className={`${geist.variable} dark`}>
            <body>
                <ClientProvider shouldRenderDevTools={isDevMode}>
                    <Debugger shouldRender={isDevMode} />
                    <SavingGameIcon />
                    <GameClient />
                    {children}
                    <Toaster />
                </ClientProvider>
            </body>
        </html>
    );
}

