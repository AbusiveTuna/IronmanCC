import React from 'react';
import BingoTable from './BingoTable';

const valueCleaner = (value) => {
  if (value.entry.includes('k', -1) || value.entry.includes('K')) {
    value.entry = (parseFloat(value.entry) * 1000).toLocaleString();
  }
  else if (value.entry.includes('m', -1) || value.entry.includes('M', -1)) {
    value.entry = (parseFloat(value.entry) * 1000000).toLocaleString();
  }
  else if (!value.entry.includes(',')) {
    value.entry = parseFloat(value.entry).toLocaleString();
  }
}

const TableManager = ({ type, data, showEHP }) => {
  if (!data || !data.length) return <p style={{ textAlign: 'center' }}>No data available.</p>;
  let headers = [];
  let dataKeys = [];
  switch (type) {
    case 'players':
      if (showEHP) {
        headers = ['Place', 'Player', 'Team', 'Points'];
        dataKeys = ['playerName', 'teamName', 'points'];
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
    case 'adminCategory':
      if (data?.length && 'purples' in data[0]) {
        headers = ['Place', 'Team', 'Purples', 'Points'];
        dataKeys = ['teamName', 'purples', 'points'];
      } else {
      headers = ['Place', 'Player', 'Team', 'Category', 'Entry', 'Points'];
      dataKeys = ['player_name', 'team_name', 'category', 'entry', 'points'];
      }
      if (data[0].category?.includes('Most')) {
        data.forEach(valueCleaner)
      }
      break;

    default:
      return null;
  }

  return <BingoTable headers={headers} data={data} dataKeys={dataKeys} type={type} />;
};

export default TableManager;