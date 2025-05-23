import React from 'react';
import BingoTable from './BingoTable';

const TableManager = ({ type, data, showEHP }) => {
  let headers = [];
  let dataKeys = [];

  switch (type) {
    case 'players':
      if (showEHP) {
        headers = ['Place', 'Player', 'Team', 'Points', 'EHT'];
        dataKeys = ['playerName', 'teamName', 'points','efficiency'];
      } else {
        headers = ['Place', 'Player', 'Team', 'Points'];
        dataKeys = ['playerName', 'team', 'points'];
      }
      break;
    case 'skillData':
      headers = ['Place', 'Player', 'Gain', 'Team', 'Points', 'EHP/EHB'];
      dataKeys = ['playerName', 'xpGained', 'teamName', 'points', 'efficiency'];
      break;
    case 'teamTotals':
      headers = ['Place', 'Team', 'Points'];
      dataKeys = ['teamName', 'points'];
      break;

    default:
      return null;
  }

  return <BingoTable headers={headers} data={data} dataKeys={dataKeys} type={type} />;
};

export default TableManager;