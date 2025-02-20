import React, { useMemo, useRef, useEffect } from 'react';
import {
  REF,
  HARDWOOD_DAY1, HARDWOOD_DAY2, HARDWOOD_DAY3, HARDWOOD_DAY4,
  SPIRIT_DAY1, SPIRIT_DAY2
} from './farmingTimersUtil';
import './FarmingGraph.css';

const PATCHES = [
  { key: 'allotments', cycle: 'short', minutes: 10, color: '#70db70' },
  { key: 'herbs', cycle: 'short', minutes: 20, color: '#adff2f' },
  { key: 'trees', cycle: 'short', minutes: 40, color: '#ffa07a' },
  { key: 'cactus', cycle: 'short', minutes: 80, color: '#66cdaa' },
  { key: 'fruit', cycle: 'short', minutes: 160, color: '#ff7f50' },
  { key: 'spirit', cycle: 'spirit', color: '#cdafff' },
  { key: 'hardwood', cycle: 'hardwood', color: '#ff1493' },
];

function buildDate(base, hhmm) {
  const [HH, MM] = hhmm.split(':').map(Number);
  return new Date(Date.UTC(
    base.getUTCFullYear(),
    base.getUTCMonth(),
    base.getUTCDate(),
    HH,
    MM,
    0
  ));
}

function checkPatch(dateUTC, patch) {
  if (dateUTC.getUTCSeconds() !== 0) return false;
  if (patch.cycle === 'short') {
    const totalMin = dateUTC.getUTCHours() * 60 + dateUTC.getUTCMinutes();
    return totalMin % patch.minutes === 0;
  }
  if (patch.cycle === 'spirit') {
    const dayMid = Date.UTC(
      dateUTC.getUTCFullYear(),
      dateUTC.getUTCMonth(),
      dateUTC.getUTCDate()
    );
    const diff = Math.floor((dayMid - REF) / (24 * 3600 * 1000));
    const isDay2 = diff % 2 === 0;
    const times = isDay2 ? SPIRIT_DAY2 : SPIRIT_DAY1;
    const candidates = times.map(t => buildDate(dateUTC, t));
    return candidates.some(c => c.getTime() === dateUTC.getTime());
  }
  if (patch.cycle === 'hardwood') {
    const dayMid = Date.UTC(
      dateUTC.getUTCFullYear(),
      dateUTC.getUTCMonth(),
      dateUTC.getUTCDate()
    );
    const diff = Math.floor((dayMid - REF) / (24 * 3600 * 1000));
    const idx = (4 + (diff % 4)) % 4;
    let arr = HARDWOOD_DAY4;
    if (idx === 1) arr = HARDWOOD_DAY1;
    if (idx === 2) arr = HARDWOOD_DAY2;
    if (idx === 3) arr = HARDWOOD_DAY3;
    const candidates = arr.map(t => buildDate(dateUTC, t));
    return candidates.some(c => c.getTime() === dateUTC.getTime());
  }
  return false;
}

const FarmingGraph = () => {
  const scrollRef = useRef(null);

  const slots = useMemo(() => {
    const now = new Date();
    
    // Reference time in UTC
    const referenceTime = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      Math.floor(now.getUTCMinutes() / 5) * 5,
      0
    ));

    // Display range: 3 hours before & after
    const past = new Date(referenceTime.getTime() - 2 * 60 * 60 * 1000);
    const future = new Date(referenceTime.getTime() + 2 * 60 * 60 * 1000);

    const out = [];
    let cur = past;
    while (cur <= future) {
      out.push(new Date(cur));
      cur = new Date(cur.getTime() + 5 * 60 * 1000);
    }
    return out;
  }, []);

  // Auto-scroll to center the current time on mount
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const middleElement = container.children[Math.floor(slots.length / 2)];
      if (middleElement) {
        container.scrollLeft = middleElement.offsetLeft - container.clientWidth / 2 + middleElement.clientWidth / 2;
      }
    }
  }, [slots]);

  return (
    <div className="farmCyclesWrapper">
      <div className="farmCyclesTimeline" ref={scrollRef}>
        {slots.map((slot, i) => {
          const matched = PATCHES.map(p => checkPatch(slot, p));
          const label = slot.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC'
          });
          return (
            <div className={`timeline-col ${i === Math.floor(slots.length / 2) ? 'highlight' : ''}`} key={i}>
              <div className="square-stack">
                {PATCHES.map((p, idx2) => {
                  const active = matched[idx2];
                  return (
                    <div
                      key={p.key}
                      className="square"
                      style={{
                        backgroundColor: active ? p.color : 'transparent',
                        borderColor: active ? p.color : '#888'
                      }}
                    />
                  );
                })}
              </div>
              <div className="time-label">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FarmingGraph;
