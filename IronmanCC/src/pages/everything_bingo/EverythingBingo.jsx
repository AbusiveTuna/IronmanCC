import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, FormControl, InputGroup, FormCheck } from 'react-bootstrap';
import fetchTempleData from '../../hooks/fetchTempleData';
import { templeMap } from '../../common/templeMap';
import './EverythingBingo.css';
import SkillButtons from './SkillButtons';
import SelectedSkillHeader from './SelectedSkillHeader';
import TableManager from './TableManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import categories from './Categories.json';
import TeamsLegend from './TeamsLegend';

const BUTTON_COLORS = {
  'Barely Legal Seafood': 'rgb(247, 125, 12)',
  'Everything but the Tub': 'rgba(55, 0, 255, 0.82)',
  'Sophanem Sigmas': 'rgba(220, 53, 70, 0.63)',
  'The Butter Churners': 'rgba(255, 217, 0, 0.86)',
};

const makeTeamTotals = (resultsObj) => {
  const m = new Map();
  Object.values(resultsObj).forEach((arr) =>
    arr.forEach((p) => {
      const team = (p.teamName ?? p.team_name ?? '').trim();
      const pts = Number(p.points) || 0;
      m.set(team, (m.get(team) || 0) + pts);
    })
  );
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([teamName, points], i) => ({ rank: i + 1, teamName, points }));
};

const normaliseArr = (arr) =>
  arr.map((p) => ({
    ...p,
    playerName: p.playerName ?? p.player_name,
    teamName: p.teamName ?? p.team_name,
  }));

const getDisplayName = (skill, isAdminCategory) => {
  if (isAdminCategory && skill === 'ToA Purples') return 'Total Team Toa Purples';
  if (isAdminCategory && skill === 'Cox Purples') return 'Total Team CoX Purples';
  if (isAdminCategory && skill === 'ToB Purples') return 'Total Team ToB Purples';
  if (skill === 'Scurrius') return 'F aladorables';
  if (isAdminCategory && skill === 'CG') return 'Corrupted Gauntlet';
  return skill.replace(/_/g, ' ');
};

const EverythingBingo = () => {
  const data = fetchTempleData();
  const [adminData, setAdminData] = useState(null);
  const [selectedTile, setSelectedTile] = useState('Combined Totals');
  const [selectedSkill, setSelectedSkill] = useState('Combined Totals');
  const [isAdminCategory, setIsAdminCategory] = useState(false);
  const [showCategories, setShowCategories] = useState(() => {
    const stored = localStorage.getItem('showCategories');
    return stored ? JSON.parse(stored) : true;
  });
  const [showTeamcolors, setShowTeamcolors] = useState(() => {
    const stored = localStorage.getItem('showTeamcolors');
    return stored ? JSON.parse(stored) : false;
  });
  const [skillData, setSkillData] = useState(null);
  const [teamTotals, setTeamTotals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('showCategories', JSON.stringify(showCategories));
  }, [showCategories]);

  useEffect(() => {
    localStorage.setItem('showTeamcolors', JSON.stringify(showTeamcolors));
  }, [showTeamcolors]);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch('https://ironmancc-89ded0fcdb2b.herokuapp.com/everythingBingo/admin/results');
        const json = await res.json();
        if (json?.success) setAdminData(json.data);
      } catch (e) {
        console.error('admin fetch failed:', e);
      }
    };
    fetchAdmin();
    const id = setInterval(fetchAdmin, 600000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      window.location.reload();
    }, 600000);
    return () => clearInterval(id);
  }, []);

  const combinedResults = useMemo(() => {
    const r = {};
    if (data?.results) Object.entries(data.results).forEach(([k, v]) => (r[k] = normaliseArr(v)));
    if (adminData?.results) Object.entries(adminData.results).forEach(([k, v]) => (r[k] = normaliseArr(v)));
    return r;
  }, [data, adminData]);

  useEffect(() => {
    if (Object.keys(combinedResults).length) setTeamTotals(makeTeamTotals(combinedResults));
  }, [combinedResults]);

  const lowerToDisplay = useMemo(() => {
    const m = {};
    categories.forEach((c) => {
      m[c.name.toLowerCase().trim()] = c.name;
    });
    return m;
  }, []);

  const leadercolorMap = useMemo(() => {
    const map = {};
    Object.entries(combinedResults).forEach(([key, arr]) => {
      if (!arr?.length) return;
      const leader = arr[0].teamName?.trim();
      const displayKey = lowerToDisplay[key] ?? key;
      map[displayKey] = BUTTON_COLORS[leader];
    });
    if (teamTotals.length) map['Combined Totals'] = BUTTON_COLORS[teamTotals[0].teamName.trim()];
    return map;
  }, [combinedResults, teamTotals, lowerToDisplay]);

  const baseButtons = [
    { name: 'Combined Totals', displayName: 'Combined Totals', isCategory: false },
    ...templeMap.map(([n]) => ({ name: n, displayName: n, isCategory: false })),
  ];
  const catButtons = categories.slice().sort((a, b) => a.name.localeCompare(b.name)).map((c) => ({
    name: c.name,
    displayName: c.name,
    isCategory: true,
  }));
  const skillButtonsData = showCategories ? [...baseButtons, ...catButtons] : baseButtons;

  const topPlayers = useMemo(() => {
    const m = new Map();
    const add = (pName, tName, pts) => {
      const k = pName?.trim().toLowerCase();
      if (!m.has(k)) m.set(k, { playerName: pName?.trim(), teamName: tName, points: 0 });
      m.get(k).points += pts;
      if (!m.get(k).teamName && tName) m.get(k).teamName = tName;
    };
    Object.values(combinedResults).forEach((arr) => arr.forEach((p) => add(p.playerName, p.teamName, Number(p.points) || 0)));
    return [...m.values()].sort((a, b) => b.points - a.points).map((o, i) => ({ rank: i + 1, ...o }));
  }, [combinedResults]);

  const filteredPlayers = topPlayers.filter((p) => p.playerName?.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleClick = (skill) => {
    setSelectedTile(skill);
    setSelectedSkill(skill);
    setSkillData(null);
    if (skill === 'Combined Totals') {
      setIsAdminCategory(false);
      setSkillData(null);
      setTeamTotals(makeTeamTotals(combinedResults));
      return;
    }
    const isCat = categories.some((c) => c.name === skill);
    setIsAdminCategory(isCat);
    if (isCat) {
      const key = skill.toLowerCase().trim();
      const raw = adminData?.results?.[key];
      if (!raw) return;
      const arr = normaliseArr(raw).slice().sort((a, b) => b.points - a.points).map((r, i) => ({ rank: i + 1, ...r }));
      setSkillData(arr);
      setTeamTotals(makeTeamTotals({ [skill]: arr }));
    } else if (combinedResults?.[skill]) {
      const arr = combinedResults[skill].map((p) => {
        const rateEntry = templeMap.find(([n]) => n === skill);
        const rate = rateEntry ? rateEntry[4] : 0;
        return { ...p, efficiency: rate ? p.xpGained / rate : 0 };
      });
      setSkillData(arr);
      setTeamTotals(makeTeamTotals({ [skill]: arr }));
    }
  };

  const iconUrl = (skill) => {
    if (categories.some((c) => c.name === skill)) return null;
    if (skill === 'Combined Totals') return '/resources/osrs_icons/Goose.png';
    const e = templeMap.find(([n]) => n === skill);
    if (!e || !e[5]) return '/resources/osrs_icons/Misc/unknown.png';
    const [folder, file] = e[5].split('/');
    return `/resources/osrs_icons/${folder}/${encodeURIComponent(file)}`;
  };

  return (
    <Container className="bingo-container" fluid>
      <Row className="justify-content-center align-items-center mt-3">
        <Col xs="auto" className="d-flex align-items-center flex-wrap">
          <TeamsLegend />
          <FormCheck
            type="checkbox"
            id="teamColorToggle"
            label="Team Colors"
            checked={showTeamcolors}
            onChange={() => setShowTeamcolors((prev) => !prev)}
            className="ms-4 text-white"
          />
        </Col>
      </Row>

      <Row className="mb-2 justify-content-center mt-4">
        <SkillButtons
          skills={skillButtonsData}
          handleClick={handleClick}
          getIconUrl={iconUrl}
          selectedTile={selectedTile}
          colorMap={leadercolorMap}
          showTeamcolors={showTeamcolors}
        />
      </Row>

      <Row className="mb-2 justify-content-center">
        <button className="buyin-submit-button" onClick={() => setShowCategories((prev) => !prev)}>
          {showCategories ? 'Hide Categories' : 'Show Categories'}
        </button>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={7} className="text-center">
          {selectedSkill === 'Combined Totals' ? (
            <>
              <SelectedSkillHeader skill="Combined Totals" displayName="Combined Totals" getIconUrl={iconUrl} />
              <TableManager type="teamTotals" data={teamTotals} />
            </>
          ) : (
            <>
              <SelectedSkillHeader
                skill={selectedSkill}
                displayName={getDisplayName(selectedSkill, isAdminCategory)}
                getIconUrl={iconUrl}
              />
              <TableManager type={isAdminCategory ? 'adminCategory' : 'skillData'} data={skillData} showEHP={!isAdminCategory} />
            </>
          )}
        </Col>

        <Col xs={12} md={5} className="text-center">
          <div className="selected-skill-header">
            <span className="selected-skill-text">Top Players</span>
          </div>
          <InputGroup className="mb-3 search-bar">
            <FormControl type="text" placeholder="Search player..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
          <TableManager type="players" data={filteredPlayers} showEHP />
        </Col>
      </Row>
    </Container>
  );
};

export default EverythingBingo;