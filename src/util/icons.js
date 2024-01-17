// Components -----------------------------------------------------------------------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Other ----------------------------------------------------------------------------
import { isArray, isObj } from '.';
// Icons ----------------------------------------------------------------------------
import { library } from '@/data/icons';


/**
 * The function checks if a given icon name exists in the FontAwesome library and returns true if it does, otherwise it logs an error message and returns false.
 * @param iconName - The name of the icon that needs to be checked in the fontawesome library.
 * @returns a boolean value - `true` if the `iconName` is present in the library. If the `iconName` is not found, an error message is logged to the console and `false` is returned.
 */
const checkIconInLibrary = (iconName) => {
    if(isObj(library, [iconName])) return true;
    console.error("Error! Please add this icon in the fontawesome library. Library is defined in the @/src/util/icons.js file .", {library, iconName})
    return false;
}

/**
 * This function takes in a string that is fontawesome icon name and returns the React FontAwesomeIcon component. 
 * Note: you still need to add the icon to the import and library in the @/src/data/icons.js file 
 * @param iconInfo - string the name of the icon you want to render OR object that contains `key` used as the iconName. 
 * @returns An FontAwesomeIcon component with the icon passed in as iconName.
 */
export const renderIcon = (iconInfo) => {
    const iconName = isObj(iconInfo, ["key"]) ? iconInfo.key : iconInfo;
    if(!checkIconInLibrary(iconName)) return;
    return <FontAwesomeIcon icon={library[iconName]} className={isObj(iconInfo, ["className"]) ? iconInfo.className : ""} style={isObj(iconInfo, ["style"]) ? iconInfo.styles : {}} />
}

/**
 * It takes an array of strings that are fontawesome icon names, and returns an array of FontAwesomeIcon components.
 * Note: you still need to add the icon to the import and library in the @/src/data/icons.js file 
 * @param iconArray - an array of strings that are the names of the icons you want to render.
 * @param [stylesArray=null] - array of objects containing styles for each icon. The styles for each icon are applied based on their index in the iconArray array. If stylesArray is not provided or is not an array, the icons will be rendered with default styles.
 * @returns An array of FontAwesomeIcons.
 */
export const renderIcons = (iconArray) => {
    let icons = [];
    iconArray.forEach((iconInfo, index) => {
        const iconName = isObj(iconInfo, ["key"]) ? iconInfo.key : iconInfo;
        checkIconInLibrary(iconName) && icons.push(
            <FontAwesomeIcon key={iconName} icon={library[iconName]} className={isObj(iconInfo, ["className"]) ? iconInfo.className : ""} style={isObj(iconInfo, ["style"]) ? iconInfo.styles : {}} />
        );
    })
    return icons;
}

/**
 * Will render icons or icon based on whats passed in. If it is an array, use renderIcons or a string, use renderIcon.
 * Note: you still need to add the icon to the import and library in the @/src/data/icons.js file 
 * @param [iconConfig=array||string] - array of objects that are that hold names of the icons you want to render OR a string of the name of the icon you want to render.
 * @returns array of FontAwesomeIcon components or a single FontAwesomeIcon component.
 */
export const renderFontAwesomeIcons = (iconConfig=null) => {
    if(!iconConfig) return console.error("renderFontAwesomeIcons,", {iconConfig});
    if(isArray(iconConfig)) return renderIcons(iconConfig);
    return renderIcon(iconConfig);
}