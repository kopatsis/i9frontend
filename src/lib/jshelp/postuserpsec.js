/**
 * @param {string} token - The token
 * @param {string} id - The ID
 * @param {string} method - The http method
 * @param {string} type - exers or strs
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function blockChange(token, id, method, type="exers") {

	const urlType = type === "exers" ? "exercises" : "/stretches"
   
    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${urlType}/banned`;
	const options = {
		method: method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({exerlist: [id]})
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
 * @param {string} token - The token
 * @param {string} id - The ID
 * @param {Number} value - The actual fav val
 * @param {string} type - exers or strs
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function favChange(token, id, value, type="exers") {
   
    const urlType = type === "exers" ? "exercises" : "/stretches"
   
    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${urlType}/favorites`;
	const options = {
		method: "PATCH",
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({exermap: {[id]: value}})
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