import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/authOptions';
import { checkRoleAccessLevel } from '@/util';

/**
 * Accepts a configuration object and may redirect the user based on the user's logged-in status and role ("ADMIN", "USER", etc.).
 * Returns the session object
 * NOTE: Must be used in a server component. If you use this in a client component you will get an error.
 * @param {object} config - An object in the following form:
 * {
 *      requiredRole: <<String indicating the requred role (Usually "ADMIN" or "USER")>>,
 *      redirectDestination: {
 *          notLoggedIn: <<URL to send the user to if they are not logged in (usually something like "/api/auth/signin?callbackUrl=<<Protected page's URL>>"
 *                  which will send the user to a login page and once they log in will send them back to the protected page)>>,
 *          notAuthorized: <<URL to send the user to if they are logged in but do not have the access level required to view the protected page
 *                  (Usually "/" to send the user back to the root page of the application)>>,
 *      },
 * }
 * @returns The session object
 */
export const pageProtector = async (config) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        if (config?.redirectDestination?.notLoggedIn) {
            redirect(config.redirectDestination.notLoggedIn);
        } else {
            console.error("You may not have specified a destination to redirect to when a user is not logged in.", error);
            redirect("/");
        }
    } else if (!checkRoleAccessLevel(session, config.requiredRole)) {
        if (config?.redirectDestination?.notAuthorized) {
            redirect(config.redirectDestination.notAuthorized);
        } else {
            console.error("You may not have specified a destination to redirect to when a user is not authorized.", error);
            redirect("/");
        }
    }
    return session;
};

/**
 * It checks if the user is logged in, if they are, it checks if they have the required role to access
 * the api route, if they do, it returns an object with the session and a success message, if they don't, it
 * returns an object with the session and an unauthorized message, if they aren't logged in, it returns
 * an object with a not logged in message
 * @param config - A configuration object that must have a requiredRole property
 * @returns An object with the following properties:
 * - authorized: boolean
 * - message: string
 * - session: object
 */
export const apiProtector = async (config) => {
    const session = await getServerSession( authOptions )
    if(checkRoleAccessLevel(session, config.requiredRole)){
        return { authorized: true, message: "Success!", session }
    }
    else if(session && session.user && session.user.role){
        return { authorized: false, message: "Forbidden!", session }
    }
    return { authorized: false, message: "Unauthorized!" };
}

/**
 * Retrieves the server session using the authentication options that are defined in @/lib/authOptions.
 * Use this function if you need session data in a server component but do not need to put it behind the page or api protector
 * @returns the session for use in server components.
 */
export const readServerSession = async (config={ requiredRole:"USER" }) => {
    const session = await getServerSession(authOptions);
    if(!checkRoleAccessLevel(session, config.requiredRole)){
        console.error("Unauthorized!", { trace: config.trace || "readServerSession", session });
        return { error:true, message:"Unauthorized!" }
    }
    return session
}