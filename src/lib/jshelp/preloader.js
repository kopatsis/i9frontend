/**
 * @param {string[]} urls
 */
export function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();

        img.onload = () => {
            console.log(`Loaded ${url}`);
        };

        img.onerror = () => {
            console.error(`Error loading ${url}`);
        };

        img.src = url;
    });
}