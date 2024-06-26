/**
 * Makes a PATCH request to the server for a workout status update
 *
 * @param {string} token - The token
 * @param {string} id - The wo ID
 * @param {number} seconds - The time parameter, represented as a float.
 * @param {string} status - The status, if updated
 * @param {string} type - type, default normal but could be stretch
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function patchWorkout(token, id, seconds, status, type = '') {
	let WOtype = '';
	if (type === 'stretch') {
		WOtype = '/stretch';
	}

	const bodyObj = { minutes: seconds / 60, status: status };
	const url = `${import.meta.env.VITE_BACKEND_URL}/workouts${WOtype}/${id}`;
	console.log(bodyObj, url);
	const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(bodyObj)
	};

	try {
		const response = await fetch(url, options);
		if (response.status === 204) {
			return {};
		}
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
 * Makes a POST request to the server for a workout status update
 *
 * @param {string} token - The token
 * @param {string} id - The wo ID
 * @param {Array<number>} ratings - The ratings by round
 * @param {Array<number>} faves - The faves by round
 * @param {number} wholeRating - The rating for full WO
 * @param {number} wholeFav - The fav rating for full WO
 * @param {boolean} asWhole - If as full WO or just partial

 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function postRating(token, id, ratings, faves, wholeRating, wholeFav, asWhole) {
	const url = `${import.meta.env.VITE_BACKEND_URL}/workouts/rate/${id}`;
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			ratings: ratings,
			faves: faves,
			fullrating: wholeRating,
			fullfave: wholeFav,
			onlyworkout: asWhole
		})
	};

	try {
		const response = await fetch(url, options);
		if (response.status === 204) {
			return {};
		}
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
 * Makes a POST request to the server for a workout status update
 *
 * @param {string} token - The token
 * @param {number} rounds - The rounds complete
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function postIntroRating(token, rounds) {
	const url = `${import.meta.env.VITE_BACKEND_URL}/workouts/intro/rate`;
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ rounds: rounds })
	};

	try {
		const response = await fetch(url, options);
		if (response.status === 204) {
			return {};
		}
		if (!response.ok) {
			const resp = await response.json();
			throw new Error(`HTTP error! status: ${response.status}, ` + JSON.stringify(resp));
		}
		return await response.json();
	} catch (error) {
		throw new Error('Error fetching the response: ' + error);
	}
}
