import React from 'react';
import { Table } from 'react-bootstrap';

const BingoTable = ({ headers, data, dataKeys, type }) => (
  <div className="table-container" data-bs-theme="dark">
    <Table striped bordered hover className="custom-table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td>{type === 'skillData' || type === 'teamTotals' ? rowIndex + 1 : row.rank}</td>
            {dataKeys.map((key, colIndex) => (
              <td key={colIndex}>
                {key === 'efficiency' && row[key] !== undefined
                  ? row[key].toFixed(2)
                  : row[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

export default BingoTable;
