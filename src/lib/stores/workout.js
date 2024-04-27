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
export const currenttime = writable(0);
export const id = writable("");
export const rounds = writable(0);
export const afterWOMessage = writable(false);

export const updateTime = async (/** @type {number} */ seconds, type="", status="Progressing", autopush=false) => {
    currenttime.set(seconds)
    if (autopush || Math.round(seconds) % 10 === 0 || Math.round(seconds) % 10 === 1) {
        const token = getLoginToken();
        const woID = get(id)
        await patchWorkout(token, woID, seconds, status, type);
    }
}

export const storedWorkoutSession = () => {
    if (!get(storedWorkout)){
        const value = sessionStorage.getItem("storedWorkout")
        if (!value){
            return
        }
        const check = JSON.parse(value)
        storedWorkout.set(check)
    }
}

export const strRoundsStSession = () => {
    if (!get(strRoundsSt)){
        const value = sessionStorage.getItem("strRoundsSt")
        if (!value){
            return
        }
        const check = JSON.parse(value)
        strRoundsSt.set(check)
    }
}

export const scriptStSession = () => {
    if (!get(scriptSt)){
        const value = sessionStorage.getItem("scriptSt")
        if (!value){
            return
        }
        const check = JSON.parse(value)
        scriptSt.set(check)
    }
}

export const genTimesStSession = () => {
    if (!get(genTimesSt)){
        const value = sessionStorage.getItem("genTimesSt")
        if (!value){
            return
        }
        const check = JSON.parse(value)
        genTimesSt.set(check)
    }
}

export const timescriptStSession = () => {
    if (!get(timescriptSt)){
        const value = sessionStorage.getItem("timescriptSt")
        if (!value){
            return
        }
        const check = JSON.parse(value)
        timescriptSt.set(check)
    }
}

export const workoutRoundsStSession = () => {
    if (!get(workoutRoundsSt)){
        const value = sessionStorage.getItem("workoutRoundsSt")
        if (!value){
            return
        }
        const check = JSON.parse(value)
        workoutRoundsSt.set(check)
    }
}

export const workoutTypeSession = () => {
    if (!get(workoutType)){
        const value = sessionStorage.getItem("workoutType")
        if (!value){
            return
        }
        const check = JSON.parse(value)
        workoutType.set(check)
    }
}

export const storedWorkoutSet = (/** @type {any} */ item) => {
    storedWorkout.set(item);
	sessionStorage.setItem("storedWorkout", JSON.stringify(item));
}

export const strRoundsStSet = (/** @type {any} */ item) => {
    strRoundsSt.set(item);
	sessionStorage.setItem("strRoundsSt", JSON.stringify(item));
}

export const genTimesStSet = (/** @type {any} */ item) => {
    genTimesSt.set(item);
	sessionStorage.setItem("genTimesSt", JSON.stringify(item));
}

export const scriptStSet = (/** @type {any} */ item) => {
    scriptSt.set(item);
	sessionStorage.setItem("scriptSt", JSON.stringify(item));
}

export const timescriptStSet = (/** @type {any} */ item) => {
    timescriptSt.set(item);
	sessionStorage.setItem("timescriptSt", JSON.stringify(item));
}

export const workoutRoundsStSet = (/** @type {any} */ item) => {
    workoutRoundsSt.set(item);
	sessionStorage.setItem("workoutRoundsSt", JSON.stringify(item));
}

export const workoutTypeSet = (/** @type {any} */ item) => {
    workoutType.set(item);
	sessionStorage.setItem("workoutType", JSON.stringify(item));
}