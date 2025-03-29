
import { 
    SCALING_CORE_MAGIC_NUMBER, 
    SCALING_CORE_MAGIC_NUMBER_PLAYER, 
    SCALING_EURO_MAGIC_NUMBER,
    SCALING_COMP_MAGIC_NUMBER,
} from "@/data/_config";









const xpToLevel = (xp=0, magicNumber=1) => Math.floor( Math.sqrt(xp / magicNumber) );

const calculateJobShare = (levelPlayer:number, levelEntity:number, options:Readonly<{ speed?:number; buffer?:number; }> = {}) => {
    const { speed, buffer } = { speed:0.2, buffer:10, ...options };
    const levelDif = levelEntity - levelPlayer;
    const rawJobShare = 100 / (1 + Math.exp(-speed * levelDif));
    const adjustedJobShare = Math.max(0, rawJobShare - buffer);
    return adjustedJobShare;
}

export const handleScaling = ({ xpPlayer=0, xpEntity=0 }: Readonly<{ xpPlayer?: number; xpEntity?: number; }>) => {

    const levelPlayer = xpToLevel(xpPlayer, SCALING_CORE_MAGIC_NUMBER_PLAYER) || 1;
    const levelPlayerLowest = levelPlayer - 1;

    const levelEntity = xpToLevel(xpEntity, SCALING_CORE_MAGIC_NUMBER) || 1;
    const levelEntityLowest = (levelEntity - 1) || 1;
    
    return {
        level: levelPlayer,
        euroCostRange: {
            min: ((levelPlayerLowest * SCALING_EURO_MAGIC_NUMBER)^2) || 1,
            max: (levelPlayer * SCALING_EURO_MAGIC_NUMBER)^2,
        },
        compCostRange: {
            min: ((levelPlayerLowest * SCALING_COMP_MAGIC_NUMBER)^2) || 1,
            max: (levelPlayer * SCALING_COMP_MAGIC_NUMBER)^2,
        },
        euroRewardRange: {
            min: (levelPlayerLowest * levelEntityLowest * SCALING_EURO_MAGIC_NUMBER) || 1,
            max: levelPlayer * levelEntity * SCALING_EURO_MAGIC_NUMBER,
        },
        compRewardRange: {
            min: (levelPlayerLowest * levelEntityLowest * SCALING_COMP_MAGIC_NUMBER) || 1,
            max: levelPlayer * levelEntity * SCALING_COMP_MAGIC_NUMBER,
        },
        jobShareRange: {
            min: calculateJobShare(levelPlayerLowest, levelEntityLowest),
            max: calculateJobShare(levelPlayer, levelEntity),
        },
        jobTimeRange: {
            step: 5,
            min: (60 * 5),
            max: (60 * 10),
        },
        businessTimeRange: {
            step: 5,
            min: 60,
            max: 90,
        },
    }
}