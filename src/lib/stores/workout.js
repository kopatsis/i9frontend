import { getLoginToken } from "$lib/jshelp/localtoken";
import { patchWorkout } from "$lib/jshelp/postwo";
import { get, writable } from "svelte/store";

export const storedWorkout = writable(null);
export const strRoundsSt = writable(null);
export const genTimesSt = writable(null);
export const scriptSt = writable(null);
export const timescriptSt = writable(null);
export const workoutRoundsSt = writable(null);
export const workoutType = writable(null);
export const time = writable(0);
export const id = writable("");
export const rounds = writable(0);

export const updateTime = async (/** @type {number} */ seconds, type="", status="Progressing", autopush=false) => {
    time.set(seconds)
    if (autopush || Math.round(seconds) % 10 === 0 || Math.round(seconds) % 10 === 1) {
        const token = getLoginToken();
        const woID = get(id)
        await patchWorkout(token, woID, seconds, status, type);
    }
}