// @ts-nocheck
import CryptoJS from 'crypto-js';
import { get } from 'svelte/store';
import { userStore } from '$lib/stores/firebaseuser';
import { getIdToken } from 'firebase/auth';

export function getLoginToken(){
    const user = get(userStore);
	if (user) {
		getIdToken(user)
			.then((token) => {
				return token;
			})
			.catch((error) => {
				console.error('Failed to retrieve ID token:', error);
			});
	}
	return getLocalToken();
}

export function getLocalToken(){
    const encryptedToken = localStorage.getItem('cjAjlopaGG');
    return encryptedToken === null ? "" : decryption(encryptedToken);
}

export function getLoginState(){
    const user = get(userStore);
	if (user) {
		return true;
	}
    const encryptedState = localStorage.getItem('DgFmTmmfMe');
    return encryptedState === null ? false : decryption(encryptedState) === "TRUE";
}

export function setLoginToken(t){
    const encryptedT = encryption(t);
    localStorage.setItem('cjAjlopaGG', encryptedT);
}

export function setLoginState(state){
    const encryptedT = encryption(state === true ? "TRUE" : "FALSE");
    localStorage.setItem('DgFmTmmfMe', encryptedT);
}

function decryption(encryptedToken) {
    const secretKey = import.meta.env.VITE_ENCR;
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

function encryption(token) {
    const secretKey = import.meta.env.VITE_ENCR;
    return CryptoJS.AES.encrypt(token, secretKey).toString();
}