/**
 * Makes a POST request to the server and returns the full response object.
 *
 * @param {string} token - The token
 * @param {number} time - The time parameter, represented as a float.
 * @param {number} diff - The diff parameter, represented as an integer.
 * @param {string} id - The workout's id
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function fetchRetryWorkout(token, time, diff, id) {
	const baseUrl = import.meta.env.VITE_BACKEND_URL;
	const url = baseUrl + '/workouts/retry/' + id;
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ time: time, diff: diff })
	};

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			const resp = await response.json();
			throw new Error(`HTTP error! status: ${response.status}, ` + JSON.stringify(resp));
		}
		return await response.json();
	} catch (error) {
		throw new Error('Error fetching the response: ' + error);
	} 
}

/**
 * Makes a POST request to the server and returns the full response object.
 *
 * @param {string} token - The token
 * @param {number} time - The time parameter, represented as a float.
 * @param {string} id - The workout's id
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function fetchRetryStretchWorkout(token, time, id) {
	const url = import.meta.env.VITE_BACKEND_URL + '/workouts/stretch/retry/' + id;
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ time: time })
	};

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			const resp = await response.json();
			throw new Error(`HTTP error! status: ${response.status}, ` + JSON.stringify(resp));
		}
		return await response.json();
	} catch (error) {
		throw new Error('Error fetching the response: ' + error);
	}
}

/**
 * Makes a POST request to the server and returns the full response object.
 *
 * @param {string} token - The token
 * @param {number} time - The time parameter, represented as a float. 
 * @param {string} id - The workout's id
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function fetchRetryIntroWorkout(token, time, id) {
	const url = import.meta.env.VITE_BACKEND_URL + '/workouts/intro/retry/' + id;
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ time: time })
	};

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			const resp = await response.json();
			throw new Error(`HTTP error! status: ${response.status}, ` + JSON.stringify(resp));
		}
		return await response.json();
	} catch (error) {
		throw new Error('Error fetching the response: ' + error);
	}
}