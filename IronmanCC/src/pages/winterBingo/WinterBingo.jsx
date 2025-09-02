import { useEffect, useMemo, useState } from "react";
import Tile from "components/bingo/tiles/Tile";
import "./WinterBingo.css";
import tiles from "./tiles.json";

const API_BASE = "https://api.ironmancc.com/ironmancc";
const PROGRESS_GET_URL = (competitionId, team) =>
  `${API_BASE}/progress/${competitionId}?team=${encodeURIComponent(team)}`;

const ROWS = 10;
const COLS = 10;

const coerceMap = (m) => (typeof m === "string" ? JSON.parse(m) : m || {});
const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);

function isComplete(entry, fallbackGoal = 1) {
  if (!entry) return false;
  const goal = Math.max(1, num(entry.goal, fallbackGoal));
  const curr = Math.max(0, num(entry.progress ?? entry.current, 0));
  if (entry.status === "completed") return true;
  return curr >= goal;
}
function currentOf(entry) {
  return Math.max(0, num(entry?.progress ?? entry?.current, 0));
}

const WinterBingo = ({
  competitionId = 111,
  teamAName = "Team Lukas",
  teamBName = "Team Bonsai",
}) => {
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);
  const [loading, setLoading] = useState(true);

  const petTiles = useMemo(() => tiles.filter((t) => t.Type === "pet-passive"), []);
  const gridTiles = useMemo(() => tiles.filter((t) => t.Type !== "pet-passive"), []);
  const rows = useMemo(
    () => Array.from({ length: ROWS }, (_, r) => gridTiles.slice(r * COLS, (r + 1) * COLS)),
    [gridTiles]
  );

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const [aRes, bRes] = await Promise.all([
          fetch(PROGRESS_GET_URL(competitionId, teamAName)),
          fetch(PROGRESS_GET_URL(competitionId, teamBName)),
        ]);
        const aJson = aRes.ok ? await aRes.json() : null;
        const bJson = bRes.ok ? await bRes.json() : null;
        if (!dead) {
          setTeamA(aJson);
          setTeamB(bJson);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => { dead = true; };
  }, [competitionId, teamAName, teamBName]);

  const mapA = useMemo(() => coerceMap(teamA?.tiles), [teamA]);
  const mapB = useMemo(() => coerceMap(teamB?.tiles), [teamB]);

  // Board-level completion: a tile counts if either team completed it (ignore passives)
  const rowCompletedShared = useMemo(
    () =>
      rows.map((row) =>
        row
          .filter((t) => t && t.Type !== "passive")
          .every((t) => isComplete(mapA[t.Id], t.Goal) || isComplete(mapB[t.Id], t.Goal))
      ),
    [rows, mapA, mapB]
  );

  // Visible rows: 1 + number of fully-completed rows (shared)
  const visibleRows = useMemo(() => {
    const firstIncomplete = rowCompletedShared.findIndex((v) => !v);
    return firstIncomplete === -1 ? ROWS : Math.min(firstIncomplete + 1, ROWS);
  }, [rowCompletedShared]);

  // Pet unlocks: start with 1, then +1 per completed row (cap to available pet tiles)
  const unlockedPetCount = useMemo(
    () => Math.min(1 + rowCompletedShared.filter(Boolean).length, petTiles.length),
    [rowCompletedShared, petTiles.length]
  );

  const pointsA = num(teamA?.points_total, 0);
  const pointsB = num(teamB?.points_total, 0);

  if (loading) {
    return (
      <section className="WinterBingo-root">
        <header className="WinterBingo-header">
          <h2>BONSAI × LUKAS Winter Special Bingo</h2>
        </header>
        <div className="WinterBingo-score">
          <div className="WinterBingo-team"><span className="WinterBingo-dot is-A" />{teamAName}: …</div>
          <div className="WinterBingo-team"><span className="WinterBingo-dot is-B" />{teamBName}: …</div>
        </div>
        <div className="WinterBingo-loading" />
      </section>
    );
  }

  return (
    <section className="WinterBingo-root">
      <header className="WinterBingo-header">
        <h2>BONSAI × LUKAS Winter Special Bingo</h2>
      </header>

      <div className="WinterBingo-score">
        <div className="WinterBingo-team">
          <span className="WinterBingo-dot is-A" />
          <span className="WinterBingo-teamName">{teamAName}</span>
          <span className="WinterBingo-points">{pointsA}</span>
        </div>
        <div className="WinterBingo-team">
          <span className="WinterBingo-dot is-B" />
          <span className="WinterBingo-teamName">{teamBName}</span>
          <span className="WinterBingo-points">{pointsB}</span>
        </div>
      </div>

      {!!petTiles.length && (
        <div className="WinterBingo-pets">
          {petTiles.slice(0, unlockedPetCount).map((t) => {
            const a = mapA[t.Id];
            const b = mapB[t.Id];
            const doneA = isComplete(a, t.Goal);
            const doneB = isComplete(b, t.Goal);
            const claimedBy = doneA ? "A" : doneB ? "B" : null;
            const current =
              claimedBy === "A" ? currentOf(a)
              : claimedBy === "B" ? currentOf(b)
              : Math.max(currentOf(a), currentOf(b));
            const goal = Math.max(1, num(a?.goal ?? b?.goal ?? t.Goal, t.Goal ?? 1));

            return (
              <div
                key={t.Id}
                className={[
                  "WinterBingo-petCell",
                  claimedBy === "A" ? "is-claimed-A" : "",
                  claimedBy === "B" ? "is-claimed-B" : "",
                ].join(" ")}
              >
                <Tile
                  image={t.Image}
                  name={t.Name}
                  description={t.Description}
                  longDescription={t.LongDescription}
                  tileProgress={current}
                  tileGoal={goal}
                />
              </div>
            );
          })}
        </div>
      )}

      <div
        className="WinterBingo-grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {rows.map((row, r) =>
          row.map((t) => {
            if (!t) return null;
            const id = t.Id;
            const a = mapA[id];
            const b = mapB[id];
            const rowVisible = r < visibleRows;

            const doneA = isComplete(a, t.Goal);
            const doneB = isComplete(b, t.Goal);
            const claimedBy = doneA ? "A" : doneB ? "B" : null;

            const current =
              claimedBy === "A" ? currentOf(a)
              : claimedBy === "B" ? currentOf(b)
              : Math.max(currentOf(a), currentOf(b));
            const goal = Math.max(1, num(a?.goal ?? b?.goal ?? t.Goal, t.Goal ?? 1));
            const isPassive = t.Type === "passive";

            return (
              <div
                key={id}
                className={[
                  "WinterBingo-cell",
                  rowVisible ? "is-visible" : "is-hidden",
                  isPassive ? "is-passive" : "",
                  claimedBy === "A" ? "is-claimed-A" : "",
                  claimedBy === "B" ? "is-claimed-B" : "",
                ].join(" ")}
              >
                {rowVisible ? (
                  <>
                    {isPassive && <div className="WinterBingo-badge">Passive</div>}
                    <Tile
                      image={t.Image}
                      name={t.Name}
                      description={t.Description}
                      longDescription={t.LongDescription}
                      tileProgress={current}
                      tileGoal={goal}
                    />
                  </>
                ) : (
                  <div className="WinterBingo-hiddenTile" />
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default WinterBingo;
