import "server-only";

// Types ----------------------------------------------------------------------------
// Server ----------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Other ----------------------------------------------------------------------------
import { handleError } from "@/utils";


//______________________________________________________________________________________
// ===== Interfaces =====

interface Options {
    trace?: string;
}



//______________________________________________________________________________________
// ===== True Constants =====

const DEFAULT_OPTIONS: Options = {
    trace: "serverAction",
}



//______________________________________________________________________________________
// ===== Functions =====

/**
 * Handles server-side actions with optional role-based protection and error handling.
 * - NOTE: Do not not use this if your server action needs to do a redirect. Redirects count as a 301 error
 * code, which will be caught within the try/catch block and will return an error to you.
 * @param callback - async function, will be executed within the try/catch block of this function.
 * @param options - optional object that changes the behavior of this function. 
 * Can contain the following properties:
 * @param options.trace - optional string, default is "serverAction". Can be anything that helps
 * the dev know where the server action was called. Recommend to just be the function name of the server 
 * action the dev is creating.
 */
export const serverAction = async <T> (
    callback: ( props: { options: Options; } ) => Promise<any>, 
    options: Options = {}
): Promise<{ error: boolean; message?: string; data: T;}> => {

    // get any options, defaulted or passed in
    const optionsToUse = { ...DEFAULT_OPTIONS, ...options }
    const { trace } = optionsToUse;

    try {
        // try to run the given `callback` function, gracefully fails if any errors are thrown
        const data = await callback({ options: optionsToUse });

        // send back the data in a normalized way
        return { error: false, message: "Success!", data };
    } catch (e: any) {
        return handleError({ trace, message: e?.message || "Unknown Error!" });
    }
}