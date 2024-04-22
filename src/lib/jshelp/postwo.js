/**
 * Makes a POST request to the server for a workout status update
 *
 * @param {string} token - The token
 * @param {string} id - The wo ID
 * @param {number} seconds - The time parameter, represented as a float.
 * @param {string} status - The status, if updated
 * @param {string} type - type, default normal but could be stretch
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function patchWorkout(token, id, seconds, status, type="") {
    let WOtype = ""
    if (type === "stretch"){
        WOtype = "/stretch"
    }
    
    const bodyObj = {minutes: seconds/60, status: status};
    const url = `${import.meta.env.VITE_BACKEND_URL}/workouts${WOtype}/${id}`;
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
		if (!response.ok) {
			const resp = await response.json()
			throw new Error(`HTTP error! status: ${response.status}, `+ JSON.stringify(resp));
		}
		return await response.json();
	} catch (error) {
		throw new Error('Error fetching the response: ' + error);
	}
}
