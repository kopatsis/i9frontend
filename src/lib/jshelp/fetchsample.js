/**
 * Makes a POST request to the server and returns the full response object.
 *
 * @param {string} backend - Backend ID
 * @param {string} type - Backend type
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function fetchSampleByExt(backend, type) {
	const url = `${import.meta.env.VITE_POS_URL}/samples/ext/${type}/${backend}` ;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			const resp = await response.json()
			throw new Error(`HTTP error! status: ${response.status}, `+ JSON.stringify(resp));
		}
		return await response.json();
	} catch (error) {
		throw new Error('Error fetching the response: ' + error);
	}
}