"use client"

// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
import { useEffect, useRef, useState } from "react";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== True Constants =====

const DEFAULT_OPTIONS = { 
    countDown: false, 
    initialCycles: 0, 
    cycleLimit: false, 
    autoStartTimer: true,
    debug: false,
}



//______________________________________________________________________________________
// ===== Hook =====

/**
 * This hook allows you to create a timer with options such as countdown, initial cycles, cycle limit, and auto start.
 * @param waitTime - int, time interval in milliseconds between each cycle of the timer.
 * @param options - object, optional. Allows you to customize the behavior of the timer. It has the following properties:
 * @param options.countDown - optional bool, `false` by default. Make the timer count down rather than up.
 * @param options.initialCycles - optional int, `0` by default. Start the timer at this amount of `cycles` completed.
 * @param options.cycleLimit - optional bool or int, `false` by default. Once `cycles` hits this limit, the timer will stop.
 * @param options.autoStartTimer - optional bool, `true` by default. Automatically start the timer. Set 
 * to `false` and make sure to use the `startTimer` function in the parent component to control when it starts.
 */
export default function useTimer( 
    waitTime: number,
    options: {
        countDown?: boolean;
        initialCycles?: number;
        cycleLimit?: boolean | number;
        autoStartTimer?: number;
        debug?: boolean;
    } = {},
): [number, () => void, () => void] {

    //______________________________________________________________________________________
    // ===== Constants =====
    const { countDown, initialCycles, cycleLimit, autoStartTimer, debug } = { ...DEFAULT_OPTIONS, ...options };

    //______________________________________________________________________________________
    // ===== References =====
    const timer = useRef<string | number | ReturnType<typeof setTimeout> | undefined>(0);

    //______________________________________________________________________________________
    // ===== State =====
    const [cycles, setCycles] = useState(initialCycles);


    
    //______________________________________________________________________________________
    // ===== Use Effects =====
    useEffect(() => {
        if(!debug) return;
        console.log({ trace:"useTimer > cycles tracker", cycles });
    }, [debug, cycles]);

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
        if(isNaN(cycleLimit as number) || cycleLimit === false) return;

        // stop the timer if we are counting down and if we hit the limit
        if(countDown && cycles <= (cycleLimit as number)) stopTimer();

        // stop the timer if we are counting up and if we hit the limit
        if((!countDown) && cycles >= (cycleLimit as number)) stopTimer();
    }, [cycleLimit, countDown, cycles])



    //______________________________________________________________________________________
    // ===== Timer Functions =====

    /**
     * Sets an interval timer and performs a specified action at regular intervals.
     * @returns early if the timer is already started.
     */
    const startTimer = () => {

        // return early because we already have the timer started
        if(timer.current) return;

        // set the timer and perform whatever needs to be done
        timer.current = setInterval(() => setCycles((prevCycles) => countDown ? prevCycles-1 : prevCycles+1), waitTime);
    }

    /**
     * Clears the interval timer and sets it to null.
     */
    const stopTimer = () => {
        // release our intervalID from the variable
        clearInterval(timer.current);
        timer.current = undefined;
    }
    
    

    //______________________________________________________________________________________
    // ===== Hook Return =====
    return [ cycles, stopTimer, startTimer ]
}