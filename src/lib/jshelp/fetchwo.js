/**
 * Makes a POST request to the server and returns the full response object.
 *
 * @param {string} token - The token
 * @param {number} time - The time parameter, represented as a float.
 * @param {number} diff - The diff parameter, represented as an integer.
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function fetchWorkout(token, time, diff) {
	const baseUrl = import.meta.env.VITE_BACKEND_URL;
	const url = baseUrl + '/workouts';
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
			const resp = await response.json()
			throw new Error(`HTTP error! status: ${response.status}, `+ JSON.stringify(resp));
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
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function fetchStretchWorkout(token, time) {
	const url = import.meta.env.VITE_BACKEND_URL + '/workouts/stretch';
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
			const resp = await response.json()
			throw new Error(`HTTP error! status: ${response.status}, `+ JSON.stringify(resp));
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
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function fetchIntroWorkout(token, time) {
	const url = import.meta.env.VITE_BACKEND_URL + '/workouts/intro';
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
			const resp = await response.json()
			throw new Error(`HTTP error! status: ${response.status}, `+ JSON.stringify(resp));
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
 * @param {number} diff - The diff parameter, represented as an integer.
 * @param {boolean} asnew - Boolean as new or as old
 * @param {string} workoutID - The diff parameter, represented as an integer.
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function fetchAdaptWorkout(token, diff, asnew, workoutID) {
	const url = import.meta.env.VITE_BACKEND_URL + '/workouts/adapt/' + workoutID;
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ diff: diff, asnew: asnew })
	};

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			const resp = await response.json()
			throw new Error(`HTTP error! status: ${response.status}, `+ JSON.stringify(resp));
		}
		return await response.json();
	} catch (error) {
		throw new Error('Error fetching the response: ' + error);
	}
}

/**
 * Makes a PATCH request to the server and returns the full response object.
 *
 * @param {string} token - The token
 * @param {Object} payload - The diff parameter, represented as an integer.
 */
export async function patchUser(token, payload) {
	const url = import.meta.env.VITE_BACKEND_URL + '/users';
	const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(payload)
	};

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			const resp = await response.json()
			throw new Error(`HTTP error! status: ${response.status}, `+ JSON.stringify(resp));
		}
	} catch (error) {
		throw new Error('Error fetching the response: ' + error);
	}
}

/**
 * Extracts the image list array from the response object.
 *
 * @param {Object} response - The response object from the server.
 * @returns {string[]} The image list array or an empty array if not found.
 */
export function extractImageList(response) {
	if (!response) {
		console.error('No response to extract image list from');
		return [];
	}

	// @ts-ignore
	const imgList = response.positions?.images;
	if (Array.isArray(imgList)) {
		return imgList;
	} else {
		console.log('No image list found in the response');
		return [];
	}
}
