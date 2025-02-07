
import { type Mercs, type Merc, type SaveFile, type SaveFileOptional } from "@/types";
import { MERCS_NAMES } from "@/data/mercNames";



//______________________________________________________________________________________
// ===== General =====

const capitalizeFirstLetter = (str: string) =>  String(str).charAt(0).toUpperCase() + String(str).slice(1);

const getRandomNumber = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1) + min);

const getRandomStringFromArray = (array: Array<string>) => array[Math.floor(Math.random() * array.length)] || "";



//______________________________________________________________________________________
// ===== Merc Generation =====

const generateMercLevels = (min:number=0, max:number=3): Merc["levels"] => {
    const levels: Merc["levels"] = {
        corpo: getRandomNumber(min, max),
        solo: getRandomNumber(min, max),
        tech: getRandomNumber(min, max),
    };
    const total = Object.values(levels).reduce((a, b) => a + b, 0);
    if(total < ((min || 1) * 2)) return generateMercLevels(min, max);
    if(total > (max * 2)) return generateMercLevels(min, max);
    return levels;
}

const generateRandomMerc = (min:number=0, max:number=3): Merc => {
    const firstName = getRandomStringFromArray(MERCS_NAMES);
    const lastName = capitalizeFirstLetter(getRandomStringFromArray(MERCS_NAMES));
    return {
        key: `${firstName}${lastName}`,
        display: `${capitalizeFirstLetter(firstName)} ${lastName}`,
        levels: generateMercLevels(min, max),
        unusedLevels: 0,
        xp: 0,
    };
}

export const getRandomMerc = (mercs?:Mercs, min:number=0, max:number=3): Merc => {
    const randomMerc = generateRandomMerc(min, max);
    if(!mercs) return randomMerc;
    if(Object.keys(mercs).includes(randomMerc.key)) return getRandomMerc(mercs, min, max);
    return randomMerc;
}
