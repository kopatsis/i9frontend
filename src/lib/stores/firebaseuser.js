// @ts-nocheck
import { writable } from 'svelte/store';
import { auth } from '../../auth/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const userStore = writable(null); // Initializes the user store as null

onAuthStateChanged(auth, user => {
    if (user) {
        userStore.set(user);
    } else {
        userStore.set(null);
    }
});