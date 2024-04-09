/**
 * @param {string[]} urls
 */
export function preloadImages(urls) {
	const cdn = import.meta.env.VITE_CDN_URL;
	const sizes = ['-low', '-mid', '-high', '-OG'];
	const angles = ['01', '02', '03', '04', '05', '06'];

	urls.forEach((url) => {
		angles.forEach((angle) => {
			sizes.forEach((size) => {
				const realURL = cdn + '/' + url + angle + size + '.webp';

				const img = new Image();

				img.src = realURL;
			});
		});
	});
}

/**
 * @param {string[]} urls
 * @param {string} size
 */
export function preloadSampleImages(urls, size) {
	const cdn = import.meta.env.VITE_CDN_URL;
	const angles = ['01', '02', '03', '04', '05', '06'];

	urls.forEach((url) => {
		angles.forEach((angle) => {
			const realURL = cdn + '/' + url + angle + '-' + size + '.webp';

			const img = new Image();

			img.src = realURL;
		});
	});
}
