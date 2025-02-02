// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
// Other ----------------------------------------------------------------------------
import { normalizeTwoDigitNumber } from "../utils";



//______________________________________________________________________________________
// ===== Micro-Components =====

/**
 * Converts a given time in seconds into a readable format of hours, minutes, and seconds (HH:MM:SS).
 */
export function ReadableTime({ timeInSeconds }: Readonly<{ timeInSeconds: number }>){
    const hours = Math.floor(timeInSeconds / (60 * 60));
    const divisorForMinutes = timeInSeconds % (60 * 60);
    const minutes = Math.floor(divisorForMinutes / 60);
    const divisorForSeconds = divisorForMinutes % 60;
    const seconds = Math.ceil(divisorForSeconds);
    return `${normalizeTwoDigitNumber(hours)}:${normalizeTwoDigitNumber(minutes)}:${normalizeTwoDigitNumber(seconds)}`
}