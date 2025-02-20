import { useState, useEffect } from 'react';
import './FarmingTimers.css';

// Zero-pad for “08:05:06” style
const zeroPad = (num) => (num < 10 ? '0' + num : num);

/**
 * getNextCycleTimes: 
 * - Given { hour, minute, second } left on a timer,
 *   compute the local and GMT times for when the next cycle hits.
 */
const getNextCycleTimes = (timer) => {
  // If any timer fields are undefined, default to 0
  const hour = timer.hour || 0;
  const minute = timer.minute || 0;
  const second = timer.second || 0;

  const totalSeconds = hour * 3600 + minute * 60 + second;

  // Now + the remaining seconds
  const future = new Date(Date.now() + totalSeconds * 1000);

  // Show local time (12-hour). Adjust format as you wish!
  const localTime = future.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Show GMT/UTC time
  const gmtTime = future.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });

  return { localTime, gmtTime };
};

//
// Format for hour-based patch
// e.g. "01:20:45" left
//
const formatHMS = (timer) => {
  const h = zeroPad(timer.hour || 0);
  const m = zeroPad(timer.minute || 0);
  const s = zeroPad(timer.second || 0);
  return `${h}:${m}:${s}`;
};

//
// Format for minute-based patch
// e.g. "05:32" left
//
const formatMS = (timer) => {
  const m = zeroPad(timer.minute || 0);
  const s = zeroPad(timer.second || 0);
  return `${m}:${s}`;
};

const FarmingTimers = () => {
  const [time, setTime] = useState({ hour: 0, minute: 0, second: 0 });

  // Each patch timer
  const [flowerTimer, setFlowerTimer] = useState({});
  const [allotmentTimer, setAllotmentTimer] = useState({});
  const [herbTimer, setHerbTimer] = useState({});
  const [treeTimer, setTreeTimer] = useState({});
  const [cactusTimer, setCactusTimer] = useState({});
  const [fruitTreeTimer, setFruitTreeTimer] = useState({});
  const [spiritTreeTimer, setSpiritTreeTimer] = useState({});
  const [hardwoodTimer, setHardwoodTimer] = useState({});

  //
  // 1) Set up an interval to update current time
  //
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setTime({
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  //
  // 2) Recompute patch timers whenever current time changes
  //
  useEffect(() => {
    minutePatches(setFlowerTimer, 5);
    minutePatches(setAllotmentTimer, 10);
    minutePatches(setHerbTimer, 20);
    minutePatches(setTreeTimer, 40);

    hourPatches(setCactusTimer, 80);
    hourPatches(setFruitTreeTimer, 160);
    hourPatches(setSpiritTreeTimer, 320);
    hourPatches(setHardwoodTimer, 640);
  }, [time]);

  //
  // minute-based patches: 5, 10, 20, 40
  //
  const minutePatches = (patchToSet, patchTimer) => {
    const { minute, second } = time;

    let minutesLeft = patchTimer - (minute % patchTimer);
    let secondsLeft = 60 - second;

    if (secondsLeft === 60) {
      minutesLeft += 1;
      secondsLeft = 0;
    }
    if (minutesLeft === patchTimer) {
      // means exactly on boundary
      minutesLeft = 0;
    }

    patchToSet({
      minute: minutesLeft,
      second: secondsLeft,
    });
  };

  //
  // hour-based patches: e.g. 80, 160, 320, 640 (in minutes)
  //
  const hourPatches = (patchToSet, patchTimer) => {
    const { hour, minute, second } = time;
    let totalMinutesToday = hour * 60 + minute;
    let remainder = totalMinutesToday % patchTimer;

    let minutesLeft = patchTimer - remainder - 1;
    let secondsLeft = 60 - second;

    if (second === 0) {
      minutesLeft += 1;
      secondsLeft = 0;
    }
    if (minutesLeft < 0) {
      minutesLeft += patchTimer;
    }

    const hoursLeft = Math.floor(minutesLeft / 60);
    const finalMinutes = minutesLeft % 60;

    patchToSet({
      hour: hoursLeft,
      minute: finalMinutes,
      second: secondsLeft,
    });
  };

  // Current local time as H:M:S
  const timeString = `${zeroPad(time.hour)}:${zeroPad(time.minute)}:${zeroPad(time.second)}`;

  // Compute next-cycle times for each category (just once per category).
  const flowerNextCycle = getNextCycleTimes(flowerTimer);
  const allotmentNextCycle = getNextCycleTimes(allotmentTimer);
  const herbNextCycle = getNextCycleTimes(herbTimer);
  const treeNextCycle = getNextCycleTimes(treeTimer);
  const cactusNextCycle = getNextCycleTimes(cactusTimer);
  const fruitNextCycle = getNextCycleTimes(fruitTreeTimer);
  const spiritNextCycle = getNextCycleTimes(spiritTreeTimer);
  const hardwoodNextCycle = getNextCycleTimes(hardwoodTimer);

  return (
    <div className="farmingTimers">
      <h1 className="page-title">Currently Incorrect Farming Timers</h1>
      <div className="current-time">Current Time: {timeString}</div>

      <div className="category flowers-saplings">
        <h2>Flowers &amp; Saplings</h2>
        <p className="next-cycle">
          Next cycle: {flowerNextCycle.localTime} (Local) / {flowerNextCycle.gmtTime} (GMT)
        </p>
        <div className="timers-row">
          <div>Flowers: {formatMS(flowerTimer)}</div>
          <div>Saplings: {formatMS(flowerTimer)}</div>
        </div>
      </div>

      <div className="category allotments">
        <h2>Allotments, Hops, Potato Cactus, Seaweed</h2>
        <p className="next-cycle">
          Next cycle: {allotmentNextCycle.localTime} (Local) / {allotmentNextCycle.gmtTime} (GMT)
        </p>
        <div className="timers-row">
          <div>Allotments: {formatMS(allotmentTimer)}</div>
          <div>Hops: {formatMS(allotmentTimer)}</div>
          <div>Potato Cactus: {formatMS(allotmentTimer)}</div>
          <div>Seaweed: {formatMS(allotmentTimer)}</div>
        </div>
      </div>

      <div className="category herbs">
        <h2>Herbs &amp; Bushes</h2>
        <p className="next-cycle">
          Next cycle: {herbNextCycle.localTime} (Local) / {herbNextCycle.gmtTime} (GMT)
        </p>
        <div className="timers-row">
          <div>Herbs: {formatMS(herbTimer)}</div>
          <div>Bushes: {formatMS(herbTimer)}</div>
        </div>
      </div>

      <div className="category trees">
        <h2>Trees &amp; Mushrooms</h2>
        <p className="next-cycle">
          Next cycle: {treeNextCycle.localTime} (Local) / {treeNextCycle.gmtTime} (GMT)
        </p>
        <div className="timers-row">
          <div>Trees: {formatMS(treeTimer)}</div>
          <div>Mushrooms: {formatMS(treeTimer)}</div>
        </div>
      </div>

      <div className="category cactus">
        <h2>Cactus, Crystal Trees, Belladonna</h2>
        <p className="next-cycle">
          Next cycle: {cactusNextCycle.localTime} (Local) / {cactusNextCycle.gmtTime} (GMT)
        </p>
        <div className="timers-row">
          <div>Cactus: {formatHMS(cactusTimer)}</div>
          <div>Crystal Trees: {formatHMS(cactusTimer)}</div>
          <div>Belladonna: {formatHMS(cactusTimer)}</div>
        </div>
      </div>

      <div className="category fruit-trees">
        <h2>Fruit Trees, Celestrus, Calquat</h2>
        <p className="next-cycle">
          Next cycle: {fruitNextCycle.localTime} (Local) / {fruitNextCycle.gmtTime} (GMT)
        </p>
        <div className="timers-row">
          <div>Fruit Trees: {formatHMS(fruitTreeTimer)}</div>
          <div>Celestrus: {formatHMS(fruitTreeTimer)}</div>
          <div>Calquat: {formatHMS(fruitTreeTimer)}</div>
        </div>
      </div>

      <div className="category spirit-tree">
        <h2>Spirit Tree</h2>
        <p className="next-cycle">
          Next cycle: {spiritNextCycle.localTime} (Local) / {spiritNextCycle.gmtTime} (GMT)
        </p>
        <div className="timers-row">
          <div>Spirit Tree: {formatHMS(spiritTreeTimer)}</div>
        </div>
      </div>

      <div className="category hardwood">
        <h2>Hardwood, Anima, Redwood, Hespori</h2>
        <p className="next-cycle">
          Next cycle: {hardwoodNextCycle.localTime} (Local) / {hardwoodNextCycle.gmtTime} (GMT)
        </p>
        <div className="timers-row">
          <div>Hardwood: {formatHMS(hardwoodTimer)}</div>
          <div>Anima: {formatHMS(hardwoodTimer)}</div>
          <div>Redwood: {formatHMS(hardwoodTimer)}</div>
          <div>Hespori: {formatHMS(hardwoodTimer)}</div>
        </div>
      </div>
    </div>
  );
};

export default FarmingTimers;
