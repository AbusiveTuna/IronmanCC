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

const EverythingBingo = () => {
  const data = fetchTempleData();
  const [skillData, setSkillData] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('Combined Totals');
  const [teamTotals, setTeamTotals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (data) {
      setTeamTotals(calculateCombinedTeamTotals(data));
    }
  }, [data]);

  const skillDisplayNames = {
    'Combined Totals': 'Combined Totals',
  };

  const skillButtonsData = [
    { name: 'Combined Totals', displayName: 'Combined Totals' },
    ...templeMap.map(([name]) => ({ name, displayName: name }))
  ];

  const handleClick = (skill) => {
    setSelectedTile(skill);
    if (skill === 'Combined Totals') {
      setSkillData(null);
      setSelectedSkill(skill);
      setTeamTotals(calculateCombinedTeamTotals(data));
    } else if (skill === 'Data Totals') {
      setSkillData(null);
      setSelectedSkill(skill);
      setTeamTotals(calculateDataTeamTotals(data));
    } else if (data && data.results) {
      const skillData = data.results[skill].map(player => {
        const rateEntry = templeMap.find(([name]) => name === skill);
        const rate = rateEntry ? rateEntry[4] : 0;
        const efficiency = rate ? (player.xpGained / rate) : 0;
        return { ...player, efficiency };
      });
      setSkillData(skillData);
      setSelectedSkill(skill);
    } else {
      console.log('Data not available');
    }
  };

  const formatSkillName = (skill) => skill.replace(/_/g, ' ');

  const getIconUrl = (skill) => {
    if (skill === 'Combined Totals') {
      return `/resources/osrs_icons/Goose.png`;
    };

    const entry = templeMap.find(([name]) => name === skill);
    if (!entry || !entry[5]) {
      console.warn(`Missing icon path for skill: ${skill}`);
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
              <TableManager type="skillData" data={skillData} showEHP />
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