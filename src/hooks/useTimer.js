
import { useEffect, useState } from "react";
import { isObj } from "@/util";



//______________________________________________________________________________________
// ===== Constants =====
const defaultOptions = { 
    countDown: false, 
    initialCycles: 0, 
    cycleLimit: false, 
    autoStartTimer: true,
}



//______________________________________________________________________________________
// ===== Hook =====
/**
 * This hook allows you to create a timer with options such as countdown, initial cycles, cycle limit, and auto start.
 * @param waitTime - int, time interval in milliseconds between each cycle of the timer.
 * @param [options=null] - object, optional. Allows you to customize the behavior of the timer. It has the following properties:]
 * - `countDown`: bool, false by default. Make the timer count down rather than up.
 * - `initialCycles`: int, 0 by default. Start the timer at this amount of `cycles` completed.
 * - `cycleLimit`: bool || int, false by default. Once `cycles` hits this limit, the timer will stop.
 * - `autoStartTimer`: bool, true by default. Automatically start the timer. Set to false and 
 *                      make sure to use the `startTimer` function in the parent component to control when it starts.
 * @returns array with three elements: `cycles`, `stopTimer`, and `startTimer`.
 */
export default function useTimer( waitTime, options=null ){


    //______________________________________________________________________________________
    // ===== Hook Constants =====
    const { countDown, initialCycles, cycleLimit, autoStartTimer } = isObj(options) ? { ...defaultOptions, ...options } : defaultOptions;


    
    //______________________________________________________________________________________
    // ===== Hook Variables =====
    let timer = null;

    

    //______________________________________________________________________________________
    // ===== State =====
    const [cycles, setCycles] = useState(initialCycles);

    

    //______________________________________________________________________________________
    // ===== Use Effects =====
    // useEffect(() => {
    //     console.log({ trace:"cycles tracker", cycles });
    // }, [cycles]);

    /**
     * Use effects to start the timer on hook mount
     * @dependencies NONE
     */
    useEffect(() => {
        if(autoStartTimer) startTimer();
    }, []);

    /**
     * Use effects checks if the cycle limit has been reached and stops the timer accordingly.
     * @dependencies cycleLimit, countDown, cycles
     */
    useEffect(() => {

        // return early if `cycleLimit` was not given
        if(isNaN(cycleLimit) || cycleLimit === false) return;

        // stop the timer if we are counting down and if we hit the limit
        if(countDown && cycles <= cycleLimit) stopTimer();

        // stop the timer if we are counting up and if we hit the limit
        if((!countDown) && cycles >= cycleLimit) stopTimer();
    }, [cycleLimit, countDown, cycles])



    //______________________________________________________________________________________
    // ===== Timer Functions =====

    /**
     * Sets an interval timer and performs a specified action at regular intervals.
     * @returns early if the timer is already started.
     */
    const startTimer = () => {

        // return early because we already have the timer started
        if(timer) return;

        // set the timer and perform whatever needs to be done
        timer = setInterval(() => setCycles((prevCycles) => countDown ? prevCycles-1 : prevCycles+1), waitTime);
    }

    /**
     * Clears the interval timer and sets it to null.
     */
    const stopTimer = () => {
        // release our intervalID from the variable
        clearInterval(timer);
        timer = null;
    }
    
    

    //______________________________________________________________________________________
    // ===== Hook Return =====
    return [ cycles, stopTimer, startTimer ]
}