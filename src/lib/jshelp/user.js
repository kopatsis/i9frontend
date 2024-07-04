/**
 * Makes a POST request to the server and returns the full response object.
 *
 * @param {string} token - The token
 * @param {string} email - What will be used for the name attribute
 * @param {string} refresh - The refresh token
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function postNewUser(token, email, refresh) {
	// @ts-ignore
	const url = import.meta.env.VITE_BACKEND_URL + '/users';
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ name: email, token: refresh })
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
 * Makes a POST request to the server and returns the full response object.
 *
 * @param {string} token - The actual token
 * @param {string} local - The local token
 * @param {string} name - The user name
 * @param {string} refresh - The resfresh token
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function mergeLocalUser(token, local, name, refresh) {
	// @ts-ignore
	const url = import.meta.env.VITE_BACKEND_URL + '/users/merge';
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ localjwt: local, name: name, token: refresh })
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
 * Makes a POST request for a finished quiz
 *
 * @param {string} token - The actual token
 * @param {Object} body
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function postQuiz(token, body) {
	// @ts-ignore
	const url = import.meta.env.VITE_BACKEND_URL + '/users/quiz';
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(body)
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