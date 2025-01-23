import { useState, useEffect } from 'react';

import './FarmingTimers.css';

const FarmingTimers = () => {
    const [time, setTime] = useState({});
    const [flowerTimer, setFlowerTimer] = useState({}); //has to be set to how much time remaining.
    const [allotmentTimer, setAllotmentTimer] = useState({});
    const [herbTimer, setHerbTimer] = useState({});
    const [treeTimer, setTreeTimer] = useState({});
    const [cactusTimer, setCactusTimer] = useState({});
    const [fruitTreeTimer, setFruitTreeTimer] = useState({});
    //so we get the current hour minutes and seconds from the user.
    const intervalId = setInterval(() => {
        const currentTime = new Date(Date.now());
        setTime({
            'hour': currentTime.getHours(),
            'minute': currentTime.getMinutes(),
            'second': currentTime.getSeconds(),
        });
    }, 1000);
    
    useEffect(() => {
        minutePatches(setFlowerTimer, 5);
        minutePatches(setAllotmentTimer, 10);
        minutePatches(setHerbTimer, 20);
        minutePatches(setTreeTimer, 40);
        minutePatches(setCactusTimer, 80);
        minutePatches(setFruitTreeTimer, 160);
    },[time]);
    
//herbs and bushes are every 20 minutes

//trees, mushrooms are every 40 minutes

    const minutePatches = (patchToSet, patchTimer) => {
        let hoursLeft = 0;
        let minutesLeft = patchTimer - (time.minute % patchTimer);
        let secondsLeft = 60 - time.second; 

        if(secondsLeft == 60) {
            minutesLeft = minutesLeft + 1;
            secondsLeft = '00';
        }

        if(secondsLeft > 0 && secondsLeft < 10){
            secondsLeft = '0' + secondsLeft;
        }

        if(minutesLeft > 59) {
            while(minutesLeft > 59){
                minutesLeft = minutesLeft - 60;
                hoursLeft = hoursLeft + 1;
            }
            patchToSet({
                'hour': hoursLeft,
                'minute' : minutesLeft,
                'second' : secondsLeft,
            });
        } else {
            patchToSet({
                'minute' : minutesLeft,
                'second' : secondsLeft,
            });
        }

    };
    
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
            <span>Time until cactus grows: {hoursLeft ? cactusTimer.hour : '00' + ":" + cactusTimer.minute + ":" + cactusTimer.second}</span>
            <br></br>
            <span>Time until crystal trees grow: {hoursLeft ? cactusTimer.hour : '00' + ":" + cactusTimer.minute + ":" + cactusTimer.second}</span>
            <br></br>
            <span>Time until belladonna grows: {hoursLeft ? cactusTimer.hour : '00' + ":" + cactusTimer.minute + ":" + cactusTimer.second}</span>
            <br></br>
            <br></br>
            <span>Time until fruit trees grow: {hoursLeft ? fruitTreeTimer.hour : '00' + ":" + fruitTreeTimer.minute + ":" + fruitTreeTimer.second}</span>
            <br></br>
            <span>Time until celestrus tree grows: {hoursLeft ? fruitTreeTimer.hour : '00' + ":" + fruitTreeTimer.minute + ":" + fruitTreeTimer.second}</span>
            <br></br>
            <span>Time until belladonna grows: {hoursLeft ? fruitTreeTimer.hour : '00' + ":" + fruitTreeTimer.minute + ":" + fruitTreeTimer.second}</span>
            <br></br>
            <br></br>
            
        </div>
    );
};

export default FarmingTimers;