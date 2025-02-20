import React, { useMemo } from 'react';
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
  const [HH,MM] = hhmm.split(':').map(Number);
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
    const totalMin = dateUTC.getUTCHours()*60 + dateUTC.getUTCMinutes();
    return (totalMin % patch.minutes === 0);
  }
  if (patch.cycle === 'spirit') {
    const dayMid = Date.UTC(
      dateUTC.getUTCFullYear(),
      dateUTC.getUTCMonth(),
      dateUTC.getUTCDate()
    );
    const diff = Math.floor((dayMid - REF)/(24*3600*1000));
    const isDay2 = (diff % 2===0);
    const times = isDay2 ? SPIRIT_DAY2 : SPIRIT_DAY1;
    const candidates = times.map(t=>buildDate(dateUTC,t));
    return candidates.some(c=>c.getTime()===dateUTC.getTime());
  }
  if (patch.cycle === 'hardwood') {
    const dayMid = Date.UTC(
      dateUTC.getUTCFullYear(),
      dateUTC.getUTCMonth(),
      dateUTC.getUTCDate()
    );
    const diff = Math.floor((dayMid - REF)/(24*3600*1000));
    const idx = (4 + (diff %4))%4;
    let arr = HARDWOOD_DAY4;
    if (idx===1) arr=HARDWOOD_DAY1;
    if (idx===2) arr=HARDWOOD_DAY2;
    if (idx===3) arr=HARDWOOD_DAY3;
    const candidates = arr.map(t=>buildDate(dateUTC,t));
    return candidates.some(c=>c.getTime()===dateUTC.getTime());
  }
  return false;
}

export default function FarmingGraph() {
  const slots = useMemo(() => {
    const now = new Date();
    const past = new Date(now.getTime() - 3*60*60*1000);
    const future = new Date(now.getTime() + 3*60*60*1000);
    const start = new Date(Date.UTC(
      past.getUTCFullYear(),
      past.getUTCMonth(),
      past.getUTCDate(),
      past.getUTCHours(),
      Math.floor(past.getUTCMinutes()/5)*5,
      0
    ));
    const end = new Date(Date.UTC(
      future.getUTCFullYear(),
      future.getUTCMonth(),
      future.getUTCDate(),
      future.getUTCHours(),
      Math.floor(future.getUTCMinutes()/5)*5,
      0
    ));
    const out = [];
    let cur = start;
    while (cur <= end) {
      out.push(new Date(cur));
      cur = new Date(cur.getTime()+5*60*1000);
    }
    return out;
  }, []);

  return (
    <div className="farmCyclesTimeline">
      {slots.map((slot,i)=> {
        const matched = PATCHES.map(p=>checkPatch(slot,p));
        const label = slot.toLocaleTimeString('en-GB', {
          hour:'2-digit',
          minute:'2-digit',
          hour12:false,
          timeZone:'UTC'
        });
        return (
          <div className="timeline-col" key={i}>
            <div className="square-stack">
              {PATCHES.map((p,idx2)=> {
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
  );
}
