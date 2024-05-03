import { getLoginToken } from "$lib/jshelp/localtoken";
import { patchWorkout } from "$lib/jshelp/postwo";
import { get, writable } from "svelte/store";

export const storedWorkout = writable(null);
export const strRoundsSt = writable(null);
export const genTimesSt = writable(null);
export const scriptSt = writable(null);
export const timescriptSt = writable(null);
export const workoutRoundsSt = writable(null);
export const workoutType = writable('');
export const currenttime = writable(0);
export const id = writable("");
export const name = writable("");
export const rounds = writable(0);
export const afterWOMessage = writable(false);

export const updateTime = async (/** @type {number} */ seconds, type="", status="Progressing", autopush=false) => {
    currenttime.set(seconds)
    sessionStorage.setItem("currenttime", String(seconds));
    if (autopush || Math.round(seconds) % 10 === 0 || Math.round(seconds) % 10 === 1) {
        const token = await getLoginToken();
        const woID = get(id)
        // @ts-ignore
        await patchWorkout(token, woID, seconds, status, type);
    }
}

export const wipeWorkout = () => {
    storedWorkout.set(null);
    strRoundsSt.set(null);
    genTimesSt.set(null);
    scriptSt.set(null);
    timescriptSt.set(null);
    workoutRoundsSt.set(null);
    workoutType.set('');
    rounds.set(0);
    id.set('');
    name.set('');
    sessionStorage.removeItem('storedWorkout');
    sessionStorage.removeItem('strRoundsSt');
    sessionStorage.removeItem('genTimesSt');
    sessionStorage.removeItem('scriptSt');
    sessionStorage.removeItem('timescriptSt');
    sessionStorage.removeItem('workoutRoundsSt');
    sessionStorage.removeItem('workoutType');
    sessionStorage.removeItem('rounds');
    sessionStorage.removeItem('woID');
    sessionStorage.removeItem('woName');
}

export const roundsSession = () => {
    if (get(rounds) === 0){
        const value = sessionStorage.getItem("rounds")
        if (!value){
            return
        }
        const check = Number(value)
        rounds.set(check)
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
    console.log("seshcheck: ", get(strRoundsSt))
    if (!get(strRoundsSt)){
        const value = sessionStorage.getItem("strRoundsSt")
        if (!value){
            return
        }
        const check = JSON.parse(value)
        console.log("!!!!!!!!!!", check)
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
    if (get(workoutType) === ''){
        const value = sessionStorage.getItem("workoutType")
        if (!value){
            return
        }
        workoutType.set(value)
    }
}

export const currenttimeSession = () => {
    if (get(currenttime) === 0){
        const value = sessionStorage.getItem("currenttime")
        if (!value || isNaN(Number(value))){
            return
        }
        currenttime.set(Number(value))
    }
}

export const woIdSession = () => {
    if (get(id) === ''){
        const value = sessionStorage.getItem("woID")
        if (!value){
            return
        }
        id.set(value)
    }
}

export const nameSession = () => {
    if (get(name) === ''){
        const value = sessionStorage.getItem("woName")
        if (!value){
            return
        }
        name.set(value)
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
	sessionStorage.setItem("workoutType", item);
}

export const roundsSet = (/** @type {any} */ item) => {
    rounds.set(item);
	sessionStorage.setItem("rounds", String(item));
}

export const idSet = (/** @type {any} */ item) => {
    id.set(item);
	sessionStorage.setItem("woID", item);
}

export const nameSet = (/** @type {any} */ item) => {
    name.set(item);
	sessionStorage.setItem("woName", item);
}