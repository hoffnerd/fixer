import { pageProtector } from "@/lib/protector";

const pageProtectorConfig = {
    requiredRole: "USER",
    redirectDestination: {
        notLoggedIn: "/api/auth/signin?callbackUrl=%2Fplay",
        notAuthorized: "/",
    },
};

export default async function Layout({children}) {
    await pageProtector(pageProtectorConfig);
    return children;
}