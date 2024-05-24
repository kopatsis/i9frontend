import { writable } from "svelte/store";

export const workouts = writable([]);
export const strworkouts = writable([]);

/**
 * Gets history from backend
 *
 * @param {string} token - The token
 * @returns {Promise<string>} Success message or throws error
 */
export async function getHistory(token) {
	const url = import.meta.env.VITE_BACKEND_URL + '/history';
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
        workouts.set(respJSON.Workout);
        strworkouts.set(respJSON.Stretch);
        return "Success";
	} catch (error) {
		throw new Error('Error fetching the response: ' + error);
	}
}

/**
 * Renames workout
 *
 * @param {string} token - The token
 * @param {string} id - The id
 * @param {string} name - The name
 * @param {string} type - The type
 * @returns {Promise<string>} Success message or throws error
 */
export async function rename(token, id, name, type="exercise") {
	const url = import.meta.env.VITE_BACKEND_URL + '/rename/' + id;
	const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ name: name, type: type })
	};

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			const resp = await response.json()
			throw new Error(`HTTP error! status: ${response.status}, `+ JSON.stringify(resp));
		}
        return "Success";
	} catch (error) {
		throw new Error('Error fetching the response: ' + error);
	}
}