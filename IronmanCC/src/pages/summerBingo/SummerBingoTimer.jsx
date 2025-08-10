// SummerBingo.jsx
import React, { useEffect, useState } from "react";
import "./SummerBingoTimer.css";

const SummerBingoTimer = () => {
  const target = new Date("2025-08-15T06:00:00-04:00"); // EDT –04:00

  const getDiff = () => Math.max(0, target.getTime() - Date.now());
  const [timeLeft, setTimeLeft] = useState(getDiff());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getDiff()), 1000);
    return () => clearInterval(id);
  }, []);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const totalHours  = Math.ceil(totalSeconds / 3600);

  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="summer-bingo">
      <h1 className="title">Summer Bingo 2025</h1>

      <div className="timer">
        <span className="hours">{totalHours}</span>
        <span className="label">
          {totalHours === 1 ? "Hour Remains" : "Hours Remain"}
        </span>
      </div>

      <div className="breakdown">
        {`${days}d ${hours}h ${minutes}m ${seconds}s`}
      </div>

      <p className="event-range">
        August 15<sup>th</sup> 6 AM EST - August 29<sup>th</sup> 12 AM EST
      </p>
    </div>
  );
};

export default SummerBingoTimer;
