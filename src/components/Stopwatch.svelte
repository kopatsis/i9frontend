<script>
// @ts-nocheck

    export let time = 0; // Tracks the hundredths of a second
    let interval = null;
  
    function startStopwatch() {
      if (interval === null) {
        interval = setInterval(() => {
            time += 0.01;
        }, 10); // Increment every 10ms for hundredths of a second
      }
    }
  
    function pauseStopwatch() {
      clearInterval(interval);
      interval = null;
    }
  
    function resetStopwatch() {
      clearInterval(interval);
      time = 0;
      interval = null;
    }
  
    $: formattedTime = `${Math.floor(time).toString()}`;
  </script>
  
  <main>
    <h1>Stopwatch</h1>
    <div>{formattedTime} seconds</div>
    <button on:click={startStopwatch}>Start</button>
    <button on:click={pauseStopwatch}>Pause</button>
    <button on:click={resetStopwatch}>Reset</button>
  </main>