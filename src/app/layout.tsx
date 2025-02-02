

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
import SessionClient from "@/components/SessionClient";
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
        <html lang="en" className={`${GeistSans.variable}`}>
            <body>
                <ClientProvider>
                    <SessionClient />
                    {children}
                </ClientProvider>
            </body>
        </html>
    );
}

