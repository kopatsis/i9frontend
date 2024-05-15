// @ts-nocheck
import { writable, get } from 'svelte/store';
import { storedWorkout } from './workout';

export const user = writable(null);
export const lastWO = writable(null);

export async function getLastWO(token){
    let current = get(storedWorkout)
    if (current){
        lastWO.set({
            name: current.Name
        })
    } else {
        // Query real workout and save w format
        console.log(token) // so no err for now
    }
}

async function fetchUserData(token) {
    console.log(token)
    try {
        const backend = import.meta.env.VITE_BACKEND_URL + "/users?force=true"
        console.log(backend);
        console.log(token);
        const response = await fetch(backend, {
            headers: {
              Authorization: `Bearer ${token}`
            }});
        if (!response.ok) {
            const resp = await response.json()
            throw new Error('Network response was not ok, ' + JSON.stringify(resp));
        }
        return await response.json();
    } catch (error) {
        throw new Error('There was a problem fetching the user data:' + error);
    }
}

export async function getUser(token) {
    console.log(token)
    if (!get(user)) {
        try{
            const currentUser = await fetchUserData(token);
            console.log(currentUser);
            user.set(currentUser);
            return ''
        } catch (error){
            return "Unable to access user: " + error
        }
    }
}