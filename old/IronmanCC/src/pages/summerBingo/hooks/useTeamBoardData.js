import { useState, useEffect } from "react";
import tiles from "../tiles.json";

const API_BASE = "https://api.ironmancc.com/ironmancc";
const PROGRESS_GET_URL = (id, team) =>
  `${API_BASE}/progress/${id}?team=${encodeURIComponent(team)}`;

const ALL_TILES = tiles;

function completedCount(map) {
  return Object.values(map || {}).filter(
    (s) => s?.status === "completed" || (s?.progress ?? 0) >= (s?.goal ?? 1)
  ).length;
}

export default function useTeamBoardData(teamName, competitionId) {
  const [statusMap, setStatusMap] = useState({});
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    let active = true;

    (async () => {
      try {
        const res = await fetch(PROGRESS_GET_URL(competitionId, teamName), {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const tilesMap = data?.tiles || data?.teams?.[teamName]?.tiles || {};
        const pts =
          typeof data?.points_total === "number"
            ? data.points_total
            : completedCount(tilesMap) * 5;

        if (active) {
          setStatusMap(tilesMap);
          setPoints(pts);
        }
      } catch {
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
      ac.abort();
    };
  }, [competitionId, teamName]);

  return { statusMap, points, loading, all: ALL_TILES };
}