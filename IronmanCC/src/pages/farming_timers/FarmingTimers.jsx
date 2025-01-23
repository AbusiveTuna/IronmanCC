import { useState, useEffect } from 'react';

import './FarmingTimers.css';

const FarmingTimers = () => {
    const startingTime = new Date(Date.now());
    const [time, setTime] = useState({});
    const [flowerTimer, setFlowerTimer] = useState({}); //has to be set to how much time remaining.
    const [allotmentTimer, setAllotmentTimer] = useState({});
    const [herbTimer, setHerbTimer] = useState({});
    const [treeTimer, setTreeTimer] = useState({});
    const [cactusTimer, setCactusTimer] = useState({});
    const [fruitTreeTimer, setFruitTreeTimer] = useState({});
    const [spiritTreeTimer, setSpiritTreeTimer] = useState({});
    const [hardwoodTimer, setHardwoodTimer] = useState({});
  
    const intervalId = setInterval(() => {
        setTime({
            'hour': startingTime.getHours(),
            'minute': startingTime.getMinutes(),
            'second': startingTime.getSeconds(),
        });
    }, 1000);

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

    const minutePatches = (patchToSet, patchTimer) => {
        let minutesLeft = patchTimer - (time.minute % patchTimer);
        let secondsLeft = 60 - time.second;

        if (secondsLeft == 60) {
            minutesLeft = minutesLeft + 1;
            secondsLeft = '00';
        }

        if (secondsLeft > 0 && secondsLeft < 10) {
            secondsLeft = '0' + secondsLeft;
        }

        patchToSet({
            'minute': minutesLeft,
            'second': secondsLeft,
        });


    };

    const hourPatches = (patchToSet, patchTimer) => {
        let hoursLeft = 0;
        let minutesLeft = 0;
        let secondsLeft = 0;
        patchToSet({
            'hour': hoursLeft,
            'minute': minutesLeft,
            'second': secondsLeft,
        });
    }

    let timeString = time.hour + ":" + time.minute + ":" + time.second;
    let hoursLeft = 0;
    return (
        <div className="farmingTimers">
            <span>Current Time: {timeString}</span>
            <br></br>
            <span>Time until flowers grows: {flowerTimer.minute + ":" + flowerTimer.second}</span>
            <br></br>
            <span>Time until saplings grows: {flowerTimer.minute + ":" + flowerTimer.second}</span>
            <br></br>
            <br></br>
            <span>Time until allotments grows: {allotmentTimer.minute + ":" + allotmentTimer.second}</span>
            <br></br>
            <span>Time until hops grows: {allotmentTimer.minute + ":" + allotmentTimer.second}</span>
            <br></br>
            <span>Time until potato cactus grows: {allotmentTimer.minute + ":" + allotmentTimer.second}</span>
            <br></br>
            <span>Time until seaweed grows: {allotmentTimer.minute + ":" + allotmentTimer.second}</span>
            <br></br>
            <br></br>
            <span>Time until herbs grow: {herbTimer.minute + ":" + herbTimer.second}</span>
            <br></br>
            <span>Time until bushes grow: {herbTimer.minute + ":" + herbTimer.second}</span>
            <br></br>
            <br></br>
            <span>Time until trees grow: {treeTimer.minute + ":" + treeTimer.second}</span>
            <br></br>
            <span>Time until mushrooms grow: {treeTimer.minute + ":" + treeTimer.second}</span>
            <br></br>
            <br></br>
            <span>Time until cactus grows: {cactusTimer.hour + ":" + cactusTimer.minute + ":" + cactusTimer.second}</span>
            <br></br>
            <span>Time until crystal trees grow: {cactusTimer.hour + ":" + cactusTimer.minute + ":" + cactusTimer.second}</span>
            <br></br>
            <span>Time until belladonna grows: {cactusTimer.hour + ":" + cactusTimer.minute + ":" + cactusTimer.second}</span>
            <br></br>
            <br></br>
            <span>Time until fruit trees grow: {fruitTreeTimer.hour + ":" + fruitTreeTimer.minute + ":" + fruitTreeTimer.second}</span>
            <br></br>
            <span>Time until celestrus tree grows: {fruitTreeTimer.hour + ":" + fruitTreeTimer.minute + ":" + fruitTreeTimer.second}</span>
            <br></br>
            <span>Time until calquat tree grows: {fruitTreeTimer.hour + ":" + fruitTreeTimer.minute + ":" + fruitTreeTimer.second}</span>
            <br></br>
            <br></br>
            <span>Time until spirit tree grows: {spiritTreeTimer.hour + ":" + spiritTreeTimer.minute + ":" + spiritTreeTimer.second}</span>
            <br></br>
            <br></br>
            <span>Time until hardwood trees grows: {hardwoodTimer.hour + ":" + hardwoodTimer.minute + ":" + hardwoodTimer.second}</span>
            <br></br>
            <span>Time until anima grows: {hardwoodTimer.hour + ":" + hardwoodTimer.minute + ":" + hardwoodTimer.second}</span>
            <br></br>
            <span>Time until Redwood tree grows: {hardwoodTimer.hour + ":" + hardwoodTimer.minute + ":" + hardwoodTimer.second}</span>
            <br></br>
            <span>Time until Hespori grows: {hardwoodTimer.hour + ":" + hardwoodTimer.minute + ":" + hardwoodTimer.second}</span>
            <br></br>
        </div>
    );
};

export default FarmingTimers;