import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, FormControl, InputGroup } from 'react-bootstrap';
import fetchTempleData from '../../hooks/fetchTempleData';
import { templeMap } from '../../common/templeMap';
import './EverythingBingo.css';
import { calculateCombinedTeamTotals, calculateDataTeamTotals, calculateSheetDataTeamTotals, calculateRanks } from './bingoUtils';
import SkillButtons from './SkillButtons';
import fetchSheetData from '../../hooks/fetchSheetData';
import fetchPurpleData from '../../hooks/fetchPurpleData';
import SelectedSkillHeader from './SelectedSkillHeader';
import TableManager from './TableManager';
import 'bootstrap/dist/css/bootstrap.min.css';

const EverythingBingo = () => {
  const data = fetchTempleData();
  const { sheetData, topPlayers, combinedTopPlayers } = fetchSheetData(data);
  const purpleData = fetchPurpleData();
  const [skillData, setSkillData] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('Combined Totals');
  const [teamTotals, setTeamTotals] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState(null);
  const [showSheetButtons, setShowSheetButtons] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (data && purpleData && sheetData.length > 0) {
      setTeamTotals(calculateCombinedTeamTotals(data, sheetData, purpleData));
    }
  }, [data, sheetData, purpleData]);

  const skillDisplayNames = {
    'Combined Totals': 'Combined Totals',
    'Data Totals': 'KC/Xp Totals',
    'Sheet Totals': 'Speedruns & Clues',
    'Purple Totals': 'Purples',
  };

  const skillButtonsData = [
    { name: 'Combined Totals', displayName: 'Combined Totals' },
    { name: 'Data Totals', displayName: 'KC/Xp Totals' },
    { name: 'Sheet Totals', displayName: 'Speedruns & Clues' },
    { name: "Purple Totals", displayName: "Purples" },
    ...templeMap.map(([name]) => ({ name, displayName: name }))
  ];

  const handleClick = (skill) => {
    setSelectedTile(skill);
    setSelectedHeader(null); 
  
    if (skill === 'Combined Totals') {
      setSkillData(null);
      setSelectedSkill(skill);
      setTeamTotals(calculateCombinedTeamTotals(data, sheetData, purpleData));
    } else if (skill === 'Data Totals') {
      setSkillData(null);
      setSelectedSkill(skill);
      setTeamTotals(calculateDataTeamTotals(data));
    } else if (skill === 'Sheet Totals') {
      setSkillData(null);
      setSelectedSkill(skill);
      setTeamTotals(calculateSheetDataTeamTotals(sheetData));
    } else if (skill === 'Purple Totals') {
      setSkillData(null);
      setSelectedSkill(skill);
      setTeamTotals(purpleData);
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
  
  const handleHeaderClick = (header) => {
    setSelectedHeader(header);
    setSelectedTile(null);
    setSelectedSkill(null);
    setSkillData(null);
  };  

  const toggleSheetButtons = () => {
    setShowSheetButtons(!showSheetButtons);
  };

  const formatSkillName = (skill) => {
    return skill.replace(/_/g, ' ');
  };

const getIconUrl = (skill) => {
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

  const filteredPlayers = calculateRanks(
    showSheetButtons ? combinedTopPlayers : topPlayers
  ).filter(player =>
    player.playerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="bingo-container" fluid>
    <Row className="mb-2 justify-content-center mt-4">
      <SkillButtons skills={skillButtonsData} handleClick={handleClick} getIconUrl={getIconUrl} selectedTile={selectedTile}/>
      {showSheetButtons && sheetData && sheetData.sort((a, b) => a.header.localeCompare(b.header)).map((category, index) => (
        <Col key={index} xs="auto" className="mb-1 p-1 text-center">
          <Button
            variant="outline-primary"
            onClick={() => handleHeaderClick(category.header)}
            className={`sheet-data-button ${selectedHeader === category.header ? 'selected-header' : ''}`}
          >
            <span className="visually-hidden">{category.header}</span>
            <div className="button-text">{category.header}</div>
          </Button>
        </Col>
      ))}
    </Row>
    <Row className="justify-content-center">
      <Col xs={12} md={7} className="text-center">
        {selectedSkill === 'Combined Totals' && (
          <>
            <SelectedSkillHeader skill={selectedSkill} displayName={skillDisplayNames[selectedSkill]} getIconUrl={getIconUrl} />
            <TableManager type="teamTotals" data={teamTotals} />
          </>
        )}
        {selectedSkill === 'Data Totals' && (
          <>
            <SelectedSkillHeader skill={selectedSkill} displayName={skillDisplayNames[selectedSkill]} getIconUrl={getIconUrl} />
            <TableManager type="teamTotals" data={teamTotals} />
          </>
        )}
        {selectedSkill && !selectedSkill.includes('Totals') && selectedSkill !== 'Purple Totals' && (
          <>
            <SelectedSkillHeader skill={selectedSkill} displayName={formatSkillName(selectedSkill)} getIconUrl={getIconUrl} />
            <TableManager type="skillData" data={skillData} showEHP />
          </>
        )}
        {selectedHeader && (
          <>
            <SelectedSkillHeader skill={selectedHeader} displayName={selectedHeader} getIconUrl={getIconUrl} />
            <TableManager type="sheetData" data={sheetData.find(category => category.header === selectedHeader).players} />
          </>
        )}
      </Col>
      <Col xs={12} md={5} className="text-center">
        <div className="selected-skill-header">
          <span className="selected-skill-text">Top Players</span>
        </div>
        <TableManager type="players" data={filteredPlayers} showEHP={!showSheetButtons} />
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