
// Types ----------------------------------------------------------------------------
import type { ResourceRewards } from "@/types";
// Data -----------------------------------------------------------------------------
// Other ----------------------------------------------------------------------------




//______________________________________________________________________________________
// ===== General =====

export const xpToLevel = (xp=0, magicNumber=1) => Math.floor( Math.sqrt(xp / magicNumber) );

export const levelToXp = (level=0, magicNumber=1) => Math.floor( (level**2) * magicNumber );

export const capitalizeFirstLetter = (str: string) =>  String(str).charAt(0).toUpperCase() + String(str).slice(1);

export const getRandomNumber = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1) + min);

export const getRandomItemFromArray = <T>(array: Array<T>) => array[Math.floor(Math.random() * array.length)];

export const getRange = ({ start, end, step=1 }: Readonly<{ start: number; end: number; step?: number; }>) => {
    if (step === 0) return [];
    if ((start > end && step > 0) || (start < end && step < 0)) return [];
    let result = [];
    for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
        result.push(i);
    }
    return result;
}



//______________________________________________________________________________________
// ===== Error Handling =====

/**
 * Logs an error message and returns an object indicating an error along with optional message, and data.
 * @param params
 * @param params.trace - string, where this function was called
 * @param params.message - optional string, the message or error type that has occurred.
 * @param params.data - optional object, any additional data to send back.
 */
export const handleError = ({ trace, message }: Readonly<{ trace?: string; message?: string; }>) => {
    console.error({ trace, message });
    return { error: true, message };
}



//______________________________________________________________________________________    
// ===== Resources =====

/**
 * Takes two objects representing resource rewards and adds their values together, updating the existing resources.
 * @param existingResources - object that represents the current resources and their amounts.
 * @param income - represents the additional resources that you want to add to the existing set of resources.
 */
export const addResourceRewards = (existingResources: ResourceRewards, income: ResourceRewards) => {
    const updatedResources: ResourceRewards = { ...existingResources };
    Object.keys(income).forEach((value) => {
        const key = value as keyof ResourceRewards;
        if(!income[key]) return;
        updatedResources[key] = (updatedResources[key] ?? 0) + income[key];
    });
    return updatedResources;
}