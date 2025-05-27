import React, { useState, useEffect } from 'react';
import { Container, Row, Col, FormControl, InputGroup } from 'react-bootstrap';
import fetchTempleData from '../../hooks/fetchTempleData';
import { templeMap } from '../../common/templeMap';
import './EverythingBingo.css';
import { calculateCombinedTeamTotals, calculateDataTeamTotals, calculateRanks } from './bingoUtils';
import SkillButtons from './SkillButtons';
import SelectedSkillHeader from './SelectedSkillHeader';
import TableManager from './TableManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import categories from './Categories.json';

const EverythingBingo = () => {
  const data = fetchTempleData();
  const [isAdminCategory, setIsAdminCategory] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [skillData, setSkillData] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('Combined Totals');
  const [teamTotals, setTeamTotals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdminResults = async () => {
      try {
        const res = await fetch('https://ironmancc-89ded0fcdb2b.herokuapp.com/everythingBingo/admin/results');
        const json = await res.json();
        if (json.success) {
          setAdminData(json.data);
        }
      } catch (err) {
        console.error('Error fetching admin results:', err);
      }
    };

    fetchAdminResults();
  }, []);

  useEffect(() => {
    if (data) {
      setTeamTotals(calculateCombinedTeamTotals(data));
    }
  }, [data]);

  const skillDisplayNames = {
    'Combined Totals': 'Combined Totals',
  };

  const baseSkillButtons = [
    { name: 'Combined Totals', displayName: 'Combined Totals' },
    ...templeMap.map(([name]) => ({ name, displayName: name }))
  ];

  const categoryButtons = categories.map(cat => ({
    name: cat.name,
    displayName: `${cat.name} (${cat.Type})`
  }));

  const skillButtonsData = showCategories
    ? [...baseSkillButtons, ...categoryButtons]
    : baseSkillButtons;

  const handleClick = async (skill) => {
    setSelectedTile(skill);
    setSelectedSkill(skill);

    if (skill === 'Combined Totals') {
      setIsAdminCategory(false);
      setSkillData(null);
      setTeamTotals(calculateCombinedTeamTotals(data));
      return;
    }

    // Determine if this is an admin category
    const isCategory = categories.some(cat => cat.name === skill);
    setIsAdminCategory(isCategory);

    if (isCategory) {
      try {
        const res = await fetch('https://ironmancc-89ded0fcdb2b.herokuapp.com/everythingBingo/admin/results');
        const json = await res.json();
        const key = skill.toLowerCase().trim();

        if (!json?.data?.results?.[key]) {
          console.warn(`No data found for category: ${key}`);
          return;
        }

        const categoryResults = json.data.results[key];
        setSkillData(categoryResults);

        const teamTotals = calculateCombinedTeamTotals({ results: { [skill]: categoryResults } });
        setTeamTotals(teamTotals);
      } catch (err) {
        console.error('Error fetching admin results:', err);
      }
    } else if (data && data.results && data.results[skill]) {
      const skillData = data.results[skill].map(player => {
        const rateEntry = templeMap.find(([name]) => name === skill);
        const rate = rateEntry ? rateEntry[4] : 0;
        const efficiency = rate ? (player.xpGained / rate) : 0;
        return { ...player, efficiency };
      });

      setIsAdminCategory(false);
      setSkillData(skillData);
      setTeamTotals(calculateCombinedTeamTotals({ results: { [skill]: data.results[skill] } }));
    } else {
      console.warn(`No data available for skill: ${skill}`);
    }
  };



  const formatSkillName = (skill) => skill.replace(/_/g, ' ');

  const getIconUrl = (skill) => {
    const isCategory = categories.some(cat => cat.name === skill);
    if (isCategory) return null;

    if (skill === 'Combined Totals') {
      return `/resources/osrs_icons/Goose.png`;
    }

    const entry = templeMap.find(([name]) => name === skill);
    if (!entry || !entry[5]) {
      return '/resources/osrs_icons/Misc/unknown.png';
    }

    const [folder, rawFile] = entry[5].split('/');
    const encodedFile = encodeURIComponent(rawFile);
    return `/resources/osrs_icons/${folder}/${encodedFile}`;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlayers = calculateRanks(data?.topPlayers || []).filter(player =>
    player.playerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="bingo-container" fluid>
      <Row className="mb-2 justify-content-center mt-4">
        <SkillButtons
          skills={skillButtonsData}
          handleClick={handleClick}
          getIconUrl={getIconUrl}
          selectedTile={selectedTile}
        />
      </Row>
      <Row className="mb-2 justify-content-center">
        <button
          className="buyin-submit-button"
          onClick={() => setShowCategories(!showCategories)}
        >
          {showCategories ? 'Hide Categories' : 'Show Categories'}
        </button>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={7} className="text-center">
          {['Combined Totals', 'Data Totals'].includes(selectedSkill) && (
            <>
              <SelectedSkillHeader
                skill={selectedSkill}
                displayName={skillDisplayNames[selectedSkill]}
                getIconUrl={getIconUrl}
              />
              <TableManager type="teamTotals" data={teamTotals} />
            </>
          )}

          {selectedSkill && !selectedSkill.includes('Totals') && (
            <>
              <SelectedSkillHeader
                skill={selectedSkill}
                displayName={formatSkillName(selectedSkill)}
                getIconUrl={getIconUrl}
              />
              <TableManager
                type={isAdminCategory ? 'adminCategory' : 'skillData'}
                data={skillData}
                showEHP={!isAdminCategory}
              />
            </>
          )}

        </Col>

        <Col xs={12} md={5} className="text-center">
          <div className="selected-skill-header">
            <span className="selected-skill-text">Top Players</span>
          </div>
          <TableManager type="players" data={filteredPlayers} showEHP />
          <InputGroup className="mt-3 search-bar">
            <FormControl
              type="text"
              placeholder="Search player..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default EverythingBingo;