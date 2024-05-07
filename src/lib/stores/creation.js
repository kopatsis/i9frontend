import { get, writable } from "svelte/store";

export const adaptID = writable('');
export const creationType = writable('Regular');
export const isRating = writable(false);
export const isCreateForm = writable(false);

export const ratingSession = () => {
    if (get(isRating) === false){
        const value = sessionStorage.getItem("isRating")
        if (!value){
            return
        }
        const check = value === "true"
        isRating.set(check)
    }
}

export const ratingTrue = () => {
    isRating.set(true)
    sessionStorage.setItem("isRating", "true");
}

export const ratingFalse = () => {
    isRating.set(false)
    sessionStorage.removeItem("isRating");
}