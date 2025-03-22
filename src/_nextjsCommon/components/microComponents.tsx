// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
// Other ----------------------------------------------------------------------------
import { format, isValid } from "date-fns";
import { normalizeTwoDigitNumber } from "../utils";



//______________________________________________________________________________________
// ===== Types & Interfaces =====

interface GenericObject {
    [key: string]: any;
}



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

/**
 * Renders an object's key-value pairs with optional mappings for keys and values.
 */
export function ObjectDisplay({ 
    className, 
    classNames, 
    obj, 
    keyMap, 
    valueMap 
}: Readonly<{ 
    className?: string;
    classNames?: { li?: string };
    obj: GenericObject;
    keyMap?: GenericObject;
    valueMap?: GenericObject;
}>){
    const objectToGetKeys = keyMap || obj;
    const renderValue = (key: string) => {
        if(valueMap?.[key]) return valueMap[key]({ className, classNames, obj, keyMap, valueMap });
        if(isValid(new Date(obj[key])) && parseInt(format(new Date(obj[key]), "T")) > parseInt(format(new Date("1971-01-01"), "T"))){
            return format(new Date(obj[key]), "Pp");
        }
        if(typeof obj[key] === 'object') return (
            <ObjectDisplay className={className} classNames={classNames} obj={obj[key]} keyMap={keyMap?.[key]} valueMap={valueMap?.[key]}/>
        )
        if(Array.isArray(obj[key])) return obj[key].map(item => {
            if(typeof item === 'object') return (
                <ObjectDisplay className={className} classNames={classNames} obj={obj[key]} keyMap={keyMap?.[key]} valueMap={valueMap?.[key]}/>
            )
            return item;
        })
        if(obj[key] === true) return "Yes";
        if(obj[key] === false) return "No";
        return obj[key];
    }
    return <ul className={className}>
        {Object.keys(objectToGetKeys).map(key => (obj[key] === null || obj[key] === undefined) ? null : (
            <li key={key} className={classNames?.li}>
                <span className="tw-font-bold">{keyMap?.[key] || key}:&nbsp;</span>
                {renderValue(key)}
            </li> 
        ))}
    </ul>
}