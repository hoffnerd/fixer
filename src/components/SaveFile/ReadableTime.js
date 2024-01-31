export default function ReadableTime({ timeInSeconds }){
    const hours = Math.floor(timeInSeconds / (60 * 60));

    const divisorForMinutes = timeInSeconds % (60 * 60);
    const minutes = Math.floor(divisorForMinutes / 60);

    const divisorForSeconds = divisorForMinutes % 60;
    const seconds = Math.ceil(divisorForSeconds);

    const readableIncrement = (time) => time < 10 ? `0${time}` : time;

    return `${readableIncrement(hours)}:${readableIncrement(minutes)}:${readableIncrement(seconds)}`
}