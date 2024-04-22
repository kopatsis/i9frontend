import { writable } from "svelte/store";

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