export const zeroPad = (num) => (num < 10 ? '0' + num : num);

export const SPIRIT_DAY1 = ["00:00", "05:20", "10:40", "16:00", "21:20"];
export const SPIRIT_DAY2 = ["02:40", "08:00", "13:20", "18:40"];
export const REF = Date.UTC(2025, 1, 20); //Day 4
export const HARDWOOD_DAY1 = ["00:00","10:40","21:20"];
export const HARDWOOD_DAY2 = ["08:00","18:40"];
export const HARDWOOD_DAY3 = ["05:20","16:00"];
export const HARDWOOD_DAY4 = ["02:40","13:20"];

export const buildDateUTCForToday = (hhmm) => {
    const [HH, MM] = hhmm.split(':').map(Number);
    const now = new Date();
    const d = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        HH,
        MM,
        0
    ));
    return d;
};

export const getNextCycleTimes = (timer) => {
    const hour = timer.hour || 0;
    const minute = timer.minute || 0;
    const second = timer.second || 0;

    const totalSeconds = hour * 3600 + minute * 60 + second;
    const nowMillis = Date.now();
    const futureMillis = nowMillis + totalSeconds * 1000;
    const futureRoundedMillis = Math.ceil(futureMillis / 1000) * 1000;
    const future = new Date(futureRoundedMillis);


    const localTime = future.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const gmtTime = future.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
    });

    return { localTime, gmtTime };
};

export const formatHMS = (timer) => {
    const h = zeroPad(timer.hour || 0);
    const m = zeroPad(timer.minute || 0);
    const s = zeroPad(timer.second || 0);
    return `${h}:${m}:${s}`;
};


export const formatMS = (timer) => {
    const m = zeroPad(timer.minute || 0);
    const s = zeroPad(timer.second || 0);
    return `${m}:${s}`;
};

