// @ts-nocheck
import { writable } from "svelte/store";

export const exercises = writable([]);
export const stretches = writable([]);

export const filterEx = writable(null);
export const filterSt = writable(null);

/**
 * Gets library from backend
 *
 * @param {string} token - The token
 * @returns {Promise<string>} Success message or throws error
 */
export async function getLibrary(token) {
	const url = import.meta.env.VITE_BACKEND_URL + '/library';
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
	};

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			const resp = await response.json()
			throw new Error(`HTTP error! status: ${response.status}, `+ JSON.stringify(resp));
		}
		const respJSON = await response.json();
        exercises.set(respJSON.Exers);
        stretches.set(respJSON.Strs);
        return "Success";
	} catch (error) {
		throw new Error('Error fetching the response: ' + error);
	}
}