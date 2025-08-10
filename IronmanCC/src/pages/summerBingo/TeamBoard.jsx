import React, { useEffect, useMemo, useState } from "react";
import "./SummerBingo.css";
import tiles from "./tiles.json";
import Board from "./Board";

const API_BASE = "https://api.ironmancc.com/ironmancc";
const PROGRESS_GET_URL = (id, team) =>
  `${API_BASE}/progress/${id}?team=${encodeURIComponent(team)}`;

function completedCount(map) {
  return Object.values(map || {}).filter(
    (s) => s?.status === "completed" || (s?.progress ?? 0) >= (s?.goal ?? 1)
  ).length;
}

function rowsUnlocked(map) {
  const done = completedCount(map);
  return Math.min(1 + Math.floor(done / 3), 5);
}

const TeamBoard = ({ teamName, tileMax = "220px", competitionId = 101 }) => {
  const [statusMap, setStatusMap] = useState({});
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(PROGRESS_GET_URL(competitionId, teamName));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const tilesMap =
          data?.tiles ||
          data?.teams?.[teamName]?.tiles ||
          {};
        const pts =
          typeof data?.points_total === "number"
            ? data.points_total
            : completedCount(tilesMap) * 5;
        if (active) {
          setStatusMap(tilesMap);
          setPoints(pts);
        }
      } catch (e) {
        if (active) {
          setStatusMap({});
          setPoints(0);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [competitionId, teamName]);

  const all = useMemo(() => tiles.slice(0, 25), []);
  const rows = rowsUnlocked(statusMap);
  const visibleTiles = all.slice(0, rows * 5);

  if (loading) {
    return (
      <section className="summerBingo-team">
        <header className="summerBingo-teamHeader">
          <h2>{teamName}</h2>
          <div className="summerBingo-points">…</div>
        </header>
        <div className="summerBingo-board" style={{ "--tile-max": tileMax }}>
          {Array.from({ length: 5 * 1 }).map((_, i) => (
            <div key={i} className="summerBingo-tile skeleton" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="summerBingo-team">
      <header className="summerBingo-teamHeader">
        <h2>{teamName}</h2>
        <div className="summerBingo-points">{points} pts</div>
      </header>
      <Board
        tiles={visibleTiles}
        statusMap={statusMap}
        visibleRows={999}
        style={{ "--tile-max": tileMax }}
      />
    </section>
  );
};

export default TeamBoard;
