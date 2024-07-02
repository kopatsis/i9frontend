// @ts-nocheck
import { writable, get } from 'svelte/store';
import { storedWorkout } from './workout';

export const user = writable(null);
export const lastWO = writable(null);

async function fetchRecent(token) {
    console.log(token)
    try {
        const backend = import.meta.env.VITE_BACKEND_URL + "/recent"
        const response = await fetch(backend, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const resp = await response.json()
            throw new Error('Network response was not ok, ' + JSON.stringify(resp));
        }
        if (response.Status === 204) {
            return null
        }
        return await response.json();
    } catch (error) {
        throw new Error('There was a problem fetching the user data:' + error);
    }
}

export async function getLastWO(token) {
    try {
        const recent = await fetchRecent(token);
        lastWO.set(recent);
    } catch (err) {
        console.log(err)
        let current = get(storedWorkout)
        if (current && current.workout && current.workout.Name && current.workout.ID && current.workout.Created && current.workout.Status) {
            lastWO.set({
                name: current.workout.Name,
                id: current.workout.ID,
                date: current.workout.Created,
                status: current.workout.Status,
                type: !current.workout.CardioRating ? "Stretch" : current.workout.IsIntro ? "Intro" : "Regular",
                stored: true
            })
        } else {
            lastWO.set(null);
        }
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
            }
        });
        if (!response.ok) {
            const resp = await response.json()
            throw new Error('Network response was not ok, ' + JSON.stringify(resp));
        }
        return await response.json();
    } catch (error) {
        throw new Error('There was a problem fetching the user data:' + error);
    }
}

export async function getUser(token, force = false) {
    console.log(token)
    if (force || !get(user)) {
        try {
            const currentUser = await fetchUserData(token);
            console.log(currentUser);
            user.set(currentUser);
            return ''
        } catch (error) {
            return "Unable to access user: " + error
        }
    }
}