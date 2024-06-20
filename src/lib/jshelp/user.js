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
		body: JSON.stringify({ name: email, token: refresh})
	};

	try {
		const response = await fetch(url, options);
		if (response.status === 204) {
			return {};
		}
		if (!response.ok) {
			const resp = await response.json()
			throw new Error(`HTTP error! status: ${response.status}, `+ JSON.stringify(resp));
		}
		return await response.json();
	} catch (error) {
		throw new Error('Error fetching the response: ' + error);
	}
}