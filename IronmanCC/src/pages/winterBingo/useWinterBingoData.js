import { useEffect, useMemo, useState } from "react";
import { coerceMap, num } from "./winterBingoUtils";

const API_BASE = "https://api.ironmancc.com/ironmancc";
const PROGRESS_GET_URL = (competitionId, team) =>
  `${API_BASE}/progress/${competitionId}?team=${encodeURIComponent(team)}`;

export default function useWinterBingoData({ competitionId, teamAName, teamBName }) {
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);

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
      }
    })();
    return () => { dead = true; };
  }, [competitionId, teamAName, teamBName]);

  const mapA = useMemo(() => coerceMap(teamA?.tiles), [teamA]);
  const mapB = useMemo(() => coerceMap(teamB?.tiles), [teamB]);

  const pointsA = num(teamA?.points_total, 0);
  const pointsB = num(teamB?.points_total, 0);

  return { mapA, mapB, pointsA, pointsB };
}
