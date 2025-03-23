



/**
 * Logs an error message and returns an object indicating an error along with optional message, and data.
 * @param params
 * @param params.trace - string, where this function was called
 * @param params.message - optional string, the message or error type that has occurred.
 * @param params.data - optional object, any additional data to send back.
 */
export const handleError = ({ 
    trace, 
    message, 
    data
}: Readonly<{ 
    trace?: string;
    message?: string;
    data?: any;
}>) => {
    console.error({ trace, message, data });
    return { error: true, message, data };
}