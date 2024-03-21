
/**
 * Makes a POST request to the server and returns the full response object.
 *
 * @param {number} time - The time parameter, represented as a float.
 * @param {number} diff - The diff parameter, represented as an integer.
 * @returns {Promise<Object>} A promise that resolves with the full response object.
 */
export async function fetchApiResponse(time, diff) {
    const baseUrl = import.meta.env.BACKEND_API_BASE_URL;
    const url = baseUrl + '/workouts';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "time": time, "diff": diff })
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching the response:', error);
        return {};
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
   const imgList = response.positions?.imgList;
   if (Array.isArray(imgList)) {
       return imgList;
   } else {
       console.log('No image list found in the response');
       return [];
   }
}