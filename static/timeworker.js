// @ts-nocheck
let time = 0;
let interval = null;

self.onmessage = function (event) {
	switch (event.data.command) {
		case 'start':
			if (!interval) {
				interval = setInterval(() => {
					time += 0.01;
					self.postMessage(time.toFixed(2));
				}, 10);
			}
			break;
		case 'reset':
			clearInterval(interval);
			interval = null;
			time = 0;
			break;
		case 'pause':
			clearInterval(interval);
			interval = null;
			break;
	}
};
