import { useEffect, useMemo, useState } from "react";
import { getProgress, saveProgress } from "./winterApi";
import { ROWS, COLS, coerceMap, isComplete, withEntry, computePoints, chunkRows } from "./winterUtils";
import tiles from "../tiles.json";

const useWinterAdmin = ({ competitionId, teamAName, teamBName }) => {
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);
  const [editing, setEditing] = useState("A");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const petTiles = useMemo(() => tiles.filter((t) => t.Type === "pet-passive"), []);
  const gridTiles = useMemo(() => tiles.filter((t) => t.Type !== "pet-passive"), []);
  const rows = useMemo(() => chunkRows(gridTiles.slice(0, ROWS * COLS), COLS), [gridTiles]);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const [a, b] = await Promise.all([
          getProgress(competitionId, teamAName),
          getProgress(competitionId, teamBName),
        ]);
        if (!dead) {
          setTeamA(a);
          setTeamB(b);
        }
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => { dead = true; };
  }, [competitionId, teamAName, teamBName]);

  const mapA = useMemo(() => coerceMap(teamA?.tiles), [teamA]);
  const mapB = useMemo(() => coerceMap(teamB?.tiles), [teamB]);

  const claimedBy = useMemo(() => {
    const m = {};
    for (const t of tiles) {
      const aDone = isComplete(mapA[t.Id], t.Goal);
      const bDone = isComplete(mapB[t.Id], t.Goal);
      m[t.Id] = aDone ? "A" : bDone ? "B" : null;
    }
    return m;
  }, [mapA, mapB]);

  const setMap = (team, updater) => {
    if (team === "A") setTeamA((s) => ({ ...s, tiles: updater(coerceMap(s?.tiles)) }));
    else setTeamB((s) => ({ ...s, tiles: updater(coerceMap(s?.tiles)) }));
  };

  const updateTile = (team, t, nextProgress) => {
    const other = team === "A" ? "B" : "A";
    const thisMap = team === "A" ? mapA : mapB;
    const otherMap = other === "A" ? mapA : mapB;
    const { goal } = withEntry(thisMap, t);
    const progress = Math.max(0, Math.min(goal, nextProgress));
    const status = progress >= goal ? "completed" : "in_progress";

    setMap(team, (m) => ({ ...m, [t.Id]: { ...m[t.Id], progress, goal, status } }));

    if (progress >= goal && isComplete(otherMap[t.Id], t.Goal)) {
      setMap(other, (m) => {
        const e = withEntry(m, t);
        return { ...m, [t.Id]: { ...m[t.Id], progress: Math.min(e.progress, e.goal - 1), goal: e.goal, status: "in_progress" } };
      });
    }
  };

  const inc = (t) => {
    const activeMap = editing === "A" ? mapA : mapB;
    const { progress, goal } = withEntry(activeMap, t);
    updateTile(editing, t, progress + 1);
  };

  const dec = (t) => {
    const activeMap = editing === "A" ? mapA : mapB;
    const { progress } = withEntry(activeMap, t);
    updateTile(editing, t, progress - 1);
  };

  const pointsA = useMemo(() => computePoints(mapA, tiles), [mapA]);
  const pointsB = useMemo(() => computePoints(mapB, tiles), [mapB]);

  const saveTeam = async (team) => {
    const name = team === "A" ? teamAName : teamBName;
    const tilesMap = team === "A" ? mapA : mapB;
    const points = team === "A" ? pointsA : pointsB;
    setSaving(true);
    try {
      await saveProgress({ competitionId, teamName: name, tiles: tilesMap, pointsTotal: points });
    } finally {
      setSaving(false);
    }
  };

  const saveBoth = async () => {
    setSaving(true);
    try {
      await Promise.all([saveTeam("A"), saveTeam("B")]);
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    editing,
    setEditing,
    petTiles,
    rows,
    mapA,
    mapB,
    claimedBy,
    pointsA,
    pointsB,
    inc,
    dec,
    saveTeam,
    saveBoth,
  };
};

export default useWinterAdmin;
