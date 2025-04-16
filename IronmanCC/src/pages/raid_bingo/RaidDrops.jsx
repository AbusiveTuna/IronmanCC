import React, { useEffect, useState } from "react";
import axios from "axios";

const competitionId = 34;

const RaidDrops = ({ teamName, isAdmin }) => {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrops = async () => {
    try {
      const res = await axios.get(
        "https://ironmancc-89ded0fcdb2b.herokuapp.com/get-raids-bingo-drops",
        { params: { competitionId } }
      );
      setDrops((res.data.drops || []).filter((d) => d.team_name === teamName));
    } catch {}
    setLoading(false);
  };

  const deleteDrop = async (dropId) => {
    try {
      await axios.delete(
        `https://ironmancc-89ded0fcdb2b.herokuapp.com/delete-raids-bingo-drop/${dropId}`
      );
      setDrops((prev) => prev.filter((drop) => drop.id !== dropId));
    } catch {}
  };

  useEffect(() => {
    fetchDrops();
  }, []);

  if (loading) return <div>Loading drops...</div>;

  return (
    <div className="raid-drops">
      {drops.length === 0 ? (
        <p>No drops recorded yet.</p>
      ) : (
        <table className="raid-drops-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Tile</th>
              {isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {drops.map((drop) => (
              <tr key={drop.id}>
                <td>{drop.player_name}</td>
                <td>{drop.tile_name}</td>
                {isAdmin && (
                  <td>
                    <button
                      onClick={() => deleteDrop(drop.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "red",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RaidDrops;
