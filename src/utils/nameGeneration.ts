
// Types ----------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { 
    NAMES_CONSONANTS,
    NAMES_CONSONANTS_AFTER,
    NAMES_LAST_PARTS_1,
    NAMES_LAST_PARTS_2,
    NAMES_LAST_NAMES,
    NAMES_FIRST_NAMES,
} from "@/data/names";
// Other ----------------------------------------------------------------------------
import { getRandomNumber, getRandomItemFromArray } from ".";



//______________________________________________________________________________________
// ===== Names =====

const generateLastName = () => {
    const lastTypeChance = getRandomNumber(1, 100);
    if(lastTypeChance <= 30){
        const randomConsonant = getRandomItemFromArray(NAMES_CONSONANTS) ?? "";
        const randomConsonantAfter = getRandomItemFromArray(NAMES_CONSONANTS_AFTER) ?? "";
        return `${randomConsonant}${randomConsonantAfter}`;
    } 
    else if(lastTypeChance > 30 && lastTypeChance <= 60){
        const randomLastPart1 = getRandomItemFromArray(NAMES_LAST_PARTS_1) ?? "";
        const randomLastPart2 = getRandomItemFromArray(NAMES_LAST_PARTS_2) ?? "";
        return `${randomLastPart1}${randomLastPart2}`;
    } 
    return getRandomItemFromArray(NAMES_LAST_NAMES) ?? "";
}

export const generateMercName = () => {
    const firstName = getRandomItemFromArray(NAMES_FIRST_NAMES) ?? "";
    const lastName = generateLastName();
    return {
        key: `${firstName.toLowerCase()}${lastName}`,
        display: `${firstName} ${lastName}`,
    }
}