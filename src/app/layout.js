// Styles ---------------------------------------------------------------------------
import "@/styles/globals.css"
// import "@fortawesome/fontawesome-svg-core/styles.css";
// Fonts ----------------------------------------------------------------------------
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
// Contexts -------------------------------------------------------------------------
import { AppContextProvider } from '@/context/AppContext';
import AuthContext from '@/context/AuthContext';
// Components -----------------------------------------------------------------------
// Other ----------------------------------------------------------------------------
// import { config as fwaConfig } from "@fortawesome/fontawesome-svg-core";
// fwaConfig.autoAddCss = false;

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
                        {children}
                    </AppContextProvider>
                </AuthContext>
            </body>
        </html>
    );
}
