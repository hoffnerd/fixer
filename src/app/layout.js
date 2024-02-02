// Styles ---------------------------------------------------------------------------
import "@/styles/globals.css"
// Fonts ----------------------------------------------------------------------------
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
// Contexts -------------------------------------------------------------------------
import AuthContext from '@/context/AuthContext';
import { AppContextProvider } from '@/context/AppContext';
import ClientProvider from "@/rQuery/ClientProvider";
// Components -----------------------------------------------------------------------
// Other ----------------------------------------------------------------------------

export const metadata = {
    title: 'Fixer',
    description: 'A cyberpunk role playing, incremental, player choice driven experience!',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className} dark bg-background text-foreground`}>
                <AuthContext>
                    <AppContextProvider>
                        <ClientProvider>
                            {children}
                        </ClientProvider>
                    </AppContextProvider>
                </AuthContext>
            </body>
        </html>
    );
}
