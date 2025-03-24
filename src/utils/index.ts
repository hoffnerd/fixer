import type { ResourceRewards } from "@/types";




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