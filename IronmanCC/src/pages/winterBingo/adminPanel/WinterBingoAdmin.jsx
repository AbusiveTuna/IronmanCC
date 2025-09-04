import "./WinterBingoAdmin.css";
import useWinterAdmin from "./useWinterAdmin";
import WinterAdminHeader from "./WinterAdminHeader";
import WinterPetStrip from "./WinterAdminPetStrip";
import WinterGrid from "./WinterAdminGrid";

const WinterBingoAdmin = ({
  competitionId = 111,
  teamAName = "Team Lukas",
  teamBName = "Team Bonsai",
}) => {
  const {
    loading,
    saving,
    editing,
    setEditing,
    petTiles,
    rows,
    mapA,
    mapB,
    pointsA,
    pointsB,
    inc,
    dec,
    saveTeam,
    saveBoth,
  } = useWinterAdmin({ competitionId, teamAName, teamBName });

  if (loading) {
    return (
      <section className="WinterAdmin-root">
        <header className="WinterAdmin-loadingBar"><h2>Admin · BONSAI × LUKAS Winter Special</h2></header>
        <div className="WinterAdmin-loading" />
      </section>
    );
  }

  return (
    <section className="WinterAdmin-root">
      <WinterAdminHeader
        title="Admin · BONSAI x LUKAS Winter Special"
        teamAName={teamAName}
        teamBName={teamBName}
        pointsA={pointsA}
        pointsB={pointsB}
        editing={editing}
        setEditing={setEditing}
        onSaveA={() => saveTeam("A")}
        onSaveB={() => saveTeam("B")}
        onSaveBoth={saveBoth}
        saving={saving}
      />

      {!!petTiles.length && (
        <WinterPetStrip
          petTiles={petTiles}
          mapA={mapA}
          mapB={mapB}
          editing={editing}
          onInc={inc}
          onDec={dec}
        />
      )}

      <WinterGrid
        rows={rows}
        mapA={mapA}
        mapB={mapB}
        editing={editing}
        onInc={inc}
        onDec={dec}
      />
    </section>
  );
};

export default WinterBingoAdmin;
