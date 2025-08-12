import React, { useEffect, useMemo, useState } from "react";
import "./SummerBingo.css";
import tiles from "./tiles.json";
import Board from "./Board";

const API_BASE = "https://api.ironmancc.com/ironmancc";
const DRAFT_GET_URL = (id) => `${API_BASE}/draft/${id}`;
const PROGRESS_GET_URL = (id, team) =>
  `${API_BASE}/progress/${id}?team=${encodeURIComponent(team)}`;
const COMPETITION_ID = 101;

function completedCount(map) {
  return Object.values(map || {}).filter(
    (s) => s?.status === "completed" || (s?.progress ?? 0) >= (s?.goal ?? 1)
  ).length;
}

function rowsUnlocked(map) {
  const done = completedCount(map);
  return Math.min(1 + Math.floor(done / 3), 5);
}

function normalizeTeamNames(teamsJson) {
  if (!teamsJson) return ["Team A", "Team B"];
  if (teamsJson.teamOne || teamsJson.teamTwo) {
    const a = teamsJson.teamOne?.name || "Team A";
    const b = teamsJson.teamTwo?.name || "Team B";
    return [a, b];
  }
  const keys = Object.keys(teamsJson);
  if (keys.length >= 2) return [keys[0], keys[1]];
  return ["Team A", "Team B"];
}

const SummerBingo = () => {
  const board = useMemo(() => tiles.slice(0, 25), []);
  const [teamNames, setTeamNames] = useState(["Team A", "Team B"]);
  const [statusA, setStatusA] = useState({});
  const [statusB, setStatusB] = useState({});
  const [pointsA, setPointsA] = useState(0);
  const [pointsB, setPointsB] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const draftRes = await fetch(DRAFT_GET_URL(COMPETITION_ID));
        let names = ["Team A", "Team B"];
        if (draftRes.ok) {
          const draftData = await draftRes.json();
          names = normalizeTeamNames(draftData?.teams);
        }
        if (!active) return;
        setTeamNames(names);

        const [pa, pb] = await Promise.all([
          fetch(PROGRESS_GET_URL(COMPETITION_ID, names[0])),
          fetch(PROGRESS_GET_URL(COMPETITION_ID, names[1])),
        ]);

        let tilesA = {};
        let tilesB = {};
        let ptsA = 0;
        let ptsB = 0;

        if (pa.ok) {
          const a = await pa.json();
          tilesA = a?.tiles || a?.teams?.[names[0]]?.tiles || {};
          ptsA = typeof a?.points_total === "number" ? a.points_total : completedCount(tilesA) * 5;
        }
        if (pb.ok) {
          const b = await pb.json();
          tilesB = b?.tiles || b?.teams?.[names[1]]?.tiles || {};
          ptsB = typeof b?.points_total === "number" ? b.points_total : completedCount(tilesB) * 5;
        }

        if (!active) return;
        setStatusA(tilesA);
        setStatusB(tilesB);
        setPointsA(ptsA);
        setPointsB(ptsB);
      } catch (e) {
        if (!active) return;
        setStatusA({});
        setStatusB({});
        setPointsA(0);
        setPointsB(0);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const rowsA = rowsUnlocked(statusA);
  const rowsB = rowsUnlocked(statusB);
  const sharedRows = Math.min(rowsA, rowsB);

  if (loading) {
    return (
      <div className="summerBingo-wrap">
        <div className="summerBingo-boards">
          <section className="summerBingo-team">
            <header className="summerBingo-teamHeader">
              <h2>{teamNames[0]}</h2>
              <div className="summerBingo-points">…</div>
            </header>
            <div className="summerBingo-board" style={{ "--tile-max": "160px" }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="summerBingo-tile skeleton" />
              ))}
            </div>
          </section>
          <section className="summerBingo-team">
            <header className="summerBingo-teamHeader">
              <h2>{teamNames[1]}</h2>
              <div className="summerBingo-points">…</div>
            </header>
            <div className="summerBingo-board" style={{ "--tile-max": "160px" }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="summerBingo-tile skeleton" />
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="summerBingo-wrap">
      <div className="summerBingo-boards">
        <section className="summerBingo-team">
          <header className="summerBingo-teamHeader">
            <h2>{teamNames[0]}</h2>
            <div className="summerBingo-points">{pointsA} pts</div>
          </header>
          <Board
            tiles={board}
            statusMap={statusA}
            visibleRows={sharedRows}
            style={{ "--tile-max": "160px" }}
            showDesc={false}
          />
        </section>

        <section className="summerBingo-team">
          <header className="summerBingo-teamHeader">
            <h2>{teamNames[1]}</h2>
            <div className="summerBingo-points">{pointsB} pts</div>
          </header>
          <Board
            tiles={board}
            statusMap={statusB}
            visibleRows={sharedRows}
            style={{ "--tile-max": "160px" }}
            showDesc={false}
          />
        </section>
      </div>
    </div>
  );
};

export default SummerBingo;
