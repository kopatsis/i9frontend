// @ts-nocheck
let startTime = 0;
let elapsedTime = 0;
let interval = null;

self.onmessage = function(event) {
    switch (event.data.command) {
        case 'start':
            if (typeof event.data.time === 'number') {
                elapsedTime = event.data.time;
                self.postMessage(elapsedTime.toFixed(2));
            }
            if (!interval) {
                startTime = performance.now() - elapsedTime * 1000;
                interval = setInterval(step, 10);
            }
            break;
        case 'reset':
            clearInterval(interval);
            interval = null;
            elapsedTime = 0;
            startTime = 0;
            self.postMessage(elapsedTime.toFixed(2));
            break;
        case 'pause':
            clearInterval(interval);
            interval = null;
            elapsedTime = (performance.now() - startTime) / 1000;
            self.postMessage(elapsedTime.toFixed(2));
            break;
    }
};

function step() {
    elapsedTime = (performance.now() - startTime) / 1000;
    self.postMessage(elapsedTime.toFixed(2));
}
