

// Types ----------------------------------------------------------------------------
import { type Metadata } from "next";
// Packages -------------------------------------------------------------------------
// Styles ---------------------------------------------------------------------------
import "@/styles/globals.css";
// Fonts ----------------------------------------------------------------------------
import { GeistSans } from "geist/font/sans";
// Data -----------------------------------------------------------------------------
import { PROJECT_DISPLAY_NAME, PROJECT_DESCRIPTION } from "@/data/_config";
// Components -----------------------------------------------------------------------
import ClientProvider from "@/rQuery/components/ClientProvider";
import Debugger from "@/_nextjsCommon/components/Debugger";
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
// ===== Component =====

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable} dark neonEffect neScrollBar neColorPurple`}>
            <body>
                <ClientProvider>
                    <Debugger shouldRender={process.env.NODE_ENV === "development"} />
                    <SavingGameIcon />
                    <GameClient />
                    {children}
                </ClientProvider>
            </body>
        </html>
    );
}

