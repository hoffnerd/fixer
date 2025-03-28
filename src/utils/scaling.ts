
import { SCALING_MAGIC_NUMBER, SCALING_MAGIC_NUMBER_PLAYER } from "@/data/_config";









const xpToLevel = (xp=0, magicNumber=1) => Math.floor( Math.sqrt(xp / magicNumber) );

export const handleStandardScaling = (xp=0) => {
    const level = xpToLevel(xp, SCALING_MAGIC_NUMBER);
}

export const handlePlayerScaling = (xp=0) => {
    const level = xpToLevel(xp, SCALING_MAGIC_NUMBER_PLAYER);
}