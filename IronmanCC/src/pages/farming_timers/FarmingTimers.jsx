import { useState, useEffect } from 'react';
import { zeroPad, buildDateUTCForToday, getNextCycleTimes, formatHMS, formatMS } from './farmingTimersUtil';
import { REF, HARDWOOD_DAY1, HARDWOOD_DAY2, HARDWOOD_DAY3, HARDWOOD_DAY4, SPIRIT_DAY1, SPIRIT_DAY2 } from './farmingTimersUtil';
import FarmingGraph from './FarmingGraph';
import './FarmingTimers.css';

const FarmingTimers = () => {
    const [time, setTime] = useState({ hour: 0, minute: 0, second: 0 });
    const [localTime, setLocalTime] = useState({ hour: 0, minute: 0, second: 0 });

    // Each patch timer
    const [flowerTimer, setFlowerTimer] = useState({});
    const [allotmentTimer, setAllotmentTimer] = useState({});
    const [herbTimer, setHerbTimer] = useState({});
    const [treeTimer, setTreeTimer] = useState({});
    const [cactusTimer, setCactusTimer] = useState({});
    const [fruitTreeTimer, setFruitTreeTimer] = useState({});
    const [spiritTreeTimer, setSpiritTreeTimer] = useState({});
    const [hardwoodTimer, setHardwoodTimer] = useState({});

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            setLocalTime({
                hour: now.getHours(),
                minute: now.getMinutes(),
                second: now.getSeconds(),
            });
            setTime({
                hour: now.getUTCHours(),
                minute: now.getUTCMinutes(),
                second: now.getUTCSeconds(),
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        updateMinutePatch(setFlowerTimer, 5);
        updateMinutePatch(setAllotmentTimer, 10);
        updateMinutePatch(setHerbTimer, 20);
        updateMinutePatch(setTreeTimer, 40);
        updateHourPatches(setCactusTimer, 80);
        updateHourPatches(setFruitTreeTimer, 160);
        updateSpiritTree();
        updateHardwood();
    }, [time]);

    const updateMinutePatch = (patchSetter, cycleMinutes) => {
        const { minute, second } = time;

        const secondsSoFar = minute * 60 + second;
        const cycleSeconds = cycleMinutes * 60;

        const remainder = secondsSoFar % cycleSeconds;
        let secondsLeft = cycleSeconds - remainder;

        if (secondsLeft === cycleSeconds) {
            secondsLeft = 0;
        }

        const minutesLeft = Math.floor(secondsLeft / 60);
        const finalSeconds = secondsLeft % 60;

        patchSetter({
            minute: minutesLeft,
            second: finalSeconds,
        });
    }

    const updateHourPatches = (patchSetter, cycleMinutes) => {
        const { hour, minute, second } = time;
        const currentTotalMinutes = hour * 60 + minute;
        const remainder = currentTotalMinutes % cycleMinutes;
        let minutesLeft = cycleMinutes - remainder;
        if (remainder === 0) {
            minutesLeft = 0;
        }

        let totalSecLeft = minutesLeft * 60 - second;
        if (totalSecLeft < 0) {
            totalSecLeft += cycleMinutes * 60;
        }

        const hoursLeft = Math.floor(totalSecLeft / 3600);
        const leftover = totalSecLeft % 3600;
        const finalMinutes = Math.floor(leftover / 60);
        const finalSeconds = leftover % 60;

        patchSetter({
            hour: hoursLeft,
            minute: finalMinutes,
            second: finalSeconds,
        });
    };

    const updateSpiritTree = () => {


        const now = new Date();
        const todayMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

        const diffDays = Math.floor((todayMidnight - REF) / (24 * 3600 * 1000));

        let isDay2 = false;
        if (diffDays % 2 === 0) {
            isDay2 = true;
        } else {
            isDay2 = false;
        }

        const times = isDay2 ? SPIRIT_DAY2 : SPIRIT_DAY1;
        const candidateDates = times.map((hm) => buildDateUTCForToday(hm));

        const nowUTC = new Date();
        let nextTick = candidateDates.find((d) => d > nowUTC);

        if (!nextTick) {
            nextTick = new Date(candidateDates[0].getTime() + 24 * 3600 * 1000);
        }

        const diffSec = Math.floor((nextTick - nowUTC) / 1000);
        if (diffSec <= 0) {
            setSpiritTreeTimer({ hour: 0, minute: 0, second: 0 });
            return;
        }

        const hoursLeft = Math.floor(diffSec / 3600);
        const leftover = diffSec % 3600;
        const minutesLeft = Math.floor(leftover / 60);
        const secondsLeft = leftover % 60;

        setSpiritTreeTimer({
            hour: hoursLeft,
            minute: minutesLeft,
            second: secondsLeft,
        });
    };

    const updateHardwood = () => {
        const REF = Date.UTC(2025, 1, 20);
        const now = new Date();
        const todayMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        const diffDays = Math.floor((todayMidnight - REF) / (24 * 3600 * 1000));
        const dayIndex = (4 + (diffDays % 4)) % 4;
        let times;
        switch (dayIndex) {
            case 0:
                times = HARDWOOD_DAY4;
                break;
            case 1:
                times = HARDWOOD_DAY1;
                break;
            case 2:
                times = HARDWOOD_DAY2;
                break;
            case 3:
                times = HARDWOOD_DAY3;
                break;
            default:
                times = HARDWOOD_DAY4;
        }

        const candidateDates = times.map((hm) => buildDateUTCForToday(hm));

        const nowUTC = new Date();
        let nextTick = candidateDates.find((d) => d > nowUTC);

        if (!nextTick) {
            nextTick = new Date(candidateDates[0].getTime() + 24 * 3600 * 1000);
        }

        const diffSec = Math.floor((nextTick - nowUTC) / 1000);
        if (diffSec <= 0) {
            setHardwoodTimer({ hour: 0, minute: 0, second: 0 });
            return;
        }

        const hoursLeft = Math.floor(diffSec / 3600);
        const leftover = diffSec % 3600;
        const minutesLeft = Math.floor(leftover / 60);
        const secondsLeft = leftover % 60;

        setHardwoodTimer({
            hour: hoursLeft,
            minute: minutesLeft,
            second: secondsLeft,
        });
    };

    const localTimeString = `${zeroPad(localTime.hour)}:${zeroPad(localTime.minute)}:${zeroPad(localTime.second)}`;
    const timeString = `${zeroPad(time.hour)}:${zeroPad(time.minute)}:${zeroPad(time.second)}`;
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
            <FarmingGraph />
            <div className="farming-cycles">
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
        </div>
    );
};

export default FarmingTimers;
