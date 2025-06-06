
// Types ----------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { 
    SCALING_CORE_MAGIC_NUMBER, 
    SCALING_CORE_MAGIC_NUMBER_PLAYER, 
    SCALING_EURO_MAGIC_NUMBER,
    SCALING_COMP_MAGIC_NUMBER,
    SCALING_JOB_SHARE_SPEED,
    SCALING_JOB_SHARE_BUFFER,
} from "@/data/_config";
// Other ----------------------------------------------------------------------------
import { getRandomItemFromArray, getRandomNumber, getRange, xpToLevel } from ".";



//______________________________________________________________________________________
// ===== Types =====

interface XPs {
    xpPlayer?: number;
    xpEntity?: number;
}

interface Levels {
    levelPlayer: number; 
    levelPlayerLowest: number;
    levelEntity: number;
    levelEntityLowest: number;
}

export interface HandleScalingOptions extends XPs {
    magicNumber?: number;
    exponent?: number;
    scale?: "small" | "medium" | "large";
    entityType?: "business" | "contract";
}

type GetScaleProps = HandleScalingOptions & Levels;

interface GetScaleReturn {
    range?: Array<number>;
    step?: number;
    min: number; 
    max: number;
    value: number;
}

export type ScalingCallback = (props: GetScaleProps) => GetScaleReturn;

type HandleMassScalingKeys<K> = K extends string ? K : never;

type HandleMassScalingReturn<K> = Record<HandleMassScalingKeys<K>, GetScaleReturn>;



//______________________________________________________________________________________
// ===== Math Functions =====

const adder = (numbers: ReadonlyArray<number>, exponent=1) => {
    return numbers.reduce((accumulator, num) => accumulator + num, 1) ** exponent;
}

const multiplier = (numbers: ReadonlyArray<number>, exponent=1) => {
    return numbers.reduce((accumulator, num) => accumulator * num, 1) ** exponent;
}

const calculateJobShare = (levelPlayer:number, levelEntity:number, options:Readonly<{ speed?:number; buffer?:number; }> = {}) => {
    const { speed, buffer } = { speed:SCALING_JOB_SHARE_SPEED, buffer:SCALING_JOB_SHARE_BUFFER, ...options };
    const upperLimit = 50 + buffer;
    const levelDif = levelEntity - levelPlayer;
    const rawJobShare = upperLimit / (1 + Math.exp(-speed * levelDif));
    const adjustedJobShare = Math.floor(Math.max(1, rawJobShare - buffer));
    return adjustedJobShare;
}



//______________________________________________________________________________________
// ===== Scaling Helper Functions =====

const calculateValueBasedOnPlayer = (props:GetScaleProps): GetScaleReturn => {
    const { levelPlayer, levelPlayerLowest, exponent, magicNumber } = props;
    const min = multiplier([levelPlayerLowest, (magicNumber ?? 1)], exponent) || 1;
    const max = multiplier([levelPlayer, (magicNumber ?? 1)], exponent) || 1;
    return { min, max, value: getRandomNumber(min, max) };
}

const calculateValueBasedOnPlayerAndEntity = (props:GetScaleProps): GetScaleReturn => {
    const { levelPlayer, levelPlayerLowest, levelEntity, levelEntityLowest, exponent, magicNumber } = props;
    const min = multiplier([(levelPlayerLowest + levelEntityLowest), (magicNumber ?? 1)], exponent) || 1;
    const max = multiplier([(levelPlayer + levelEntity), (magicNumber ?? 1)], exponent) || 1;
    return { min, max, value: getRandomNumber(min, max) };
}

const calculateValueBasedOnPlayerAndEntityMultiplier = (props:GetScaleProps): GetScaleReturn => {
    const { levelPlayer, levelPlayerLowest, levelEntity, levelEntityLowest, exponent, magicNumber } = props;
    const min = multiplier([levelPlayerLowest, levelEntityLowest, (magicNumber ?? 1)], exponent) || 1;
    const max = multiplier([levelPlayer, levelEntity, (magicNumber ?? 1)], exponent) || 1;
    return { min, max, value: getRandomNumber(min, max) };
}

const calculateValueBasedOnScale = (props:GetScaleProps) => {
    const { scale, exponent } = props;
    if(scale === "small") return calculateValueBasedOnPlayer(props);
    if(scale === "medium") return calculateValueBasedOnPlayerAndEntity(props);
    return calculateValueBasedOnPlayerAndEntityMultiplier(props);
}



//______________________________________________________________________________________
// ===== Scaler Functions =====

export const getEuros = (props:GetScaleProps) => {
    return calculateValueBasedOnScale({ ...props, magicNumber: props.magicNumber ?? SCALING_EURO_MAGIC_NUMBER });
}

export const getComps = (props:GetScaleProps) => {
    return calculateValueBasedOnScale({ ...props, magicNumber: props.magicNumber ?? SCALING_COMP_MAGIC_NUMBER });
}

export const getJobShare = (props:GetScaleProps) => {
    let { levelPlayer, levelPlayerLowest, levelEntity, levelEntityLowest, entityType } = { ...props };
    if(levelPlayer < 1) levelPlayer = 1;
    if(levelPlayerLowest < 1) levelPlayerLowest = 1;
    if(levelEntity < 1) levelEntity = 1;
    if(levelEntityLowest < 1) levelEntityLowest = 1;
    const step = 1; // 0.01
    const minTemp = calculateJobShare(levelPlayerLowest, levelEntityLowest);
    const maxTemp = calculateJobShare(levelPlayer, levelEntity);
    const min = entityType === "business" ? Math.floor( (minTemp ?? 0) / 2 ) : minTemp;
    const max = entityType === "business" ? Math.floor( (maxTemp ?? 0) / 2 ) : maxTemp;
    const range = getRange({ min, max, step });
    return { step, min, max, range, value: getRandomItemFromArray(range)! };
}

export const getContractTime = (props:GetScaleProps) => {
    const step = 5;
    const min = 60 * 5;
    const max = 60 * 10;
    const range = getRange({ min, max, step });
    return { step, min, max, range, value: getRandomItemFromArray(range)! };
}

export const getBusinessTime = (props:GetScaleProps) => {
    const step = 30;
    const min = 60;
    const max = 60 * 5;
    const range = getRange({ min, max, step });
    return { step, min, max, range, value: getRandomItemFromArray(range)! };
}



//______________________________________________________________________________________
// ===== Main Functions =====

export const getLevels = ({ xpPlayer, xpEntity }: XPs): Levels => {
    const levelPlayer = xpToLevel((xpPlayer ?? 0), SCALING_CORE_MAGIC_NUMBER_PLAYER) || 1;
    const levelPlayerLowest = levelPlayer - 1;
    const levelEntity = xpToLevel((xpEntity ?? 0), SCALING_CORE_MAGIC_NUMBER) || 1;
    const levelEntityLowest = (levelEntity - 1) || 1;
    return { levelPlayer, levelPlayerLowest, levelEntity, levelEntityLowest };
}

export const handleScaling = ( callback: ScalingCallback, options: HandleScalingOptions ) => {
    const { xpPlayer, xpEntity } = options;
    const levels = getLevels({ xpPlayer, xpEntity });
    return callback({ ...levels, ...options });
}

export const handleMassScaling = <K>(
    callbacksAndOptions: Record<HandleMassScalingKeys<K>, {
        callback: ScalingCallback;
        options: HandleScalingOptions;
    }>,
    options: HandleScalingOptions
) => {
    const { xpPlayer, xpEntity } = options;
    const levels = getLevels({ xpPlayer, xpEntity });

    let objOfValues = {} as HandleMassScalingReturn<K>;
    Object.keys(callbacksAndOptions).forEach((k) => {
        const key = k as keyof typeof callbacksAndOptions;
        objOfValues[key] = callbacksAndOptions[key].callback({ ...levels, ...callbacksAndOptions[key].options, ...options });
    });
    return objOfValues;
}