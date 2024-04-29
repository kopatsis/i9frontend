// @ts-nocheck
import { writable } from 'svelte/store';
import { auth } from '../../auth/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const userStore = writable(undefined);
export const localLogin = writable(false);

onAuthStateChanged(auth, user => {
    if (user) {
        userStore.set(user);
    } else {
        userStore.set(null);
    }
});