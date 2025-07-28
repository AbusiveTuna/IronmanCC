import React from 'react';
import { Row, Col} from 'react-bootstrap';

const TEAM_COLORS = {
  'Barely Legal Seafood': 'rgb(247, 125, 12)',
  'Everything but the Tub': 'rgba(55, 0, 255, 0.82)',
  'Sophanem Sigmas': 'rgba(220, 53, 70, 0.63)',
  'The Butter Churners': 'rgba(255, 217, 0, 0.86)',
};

const TeamsLegend = () => (
  <Row className="legend-row justify-content-center mb-2">
    {Object.entries(TEAM_COLORS).map(([team, color]) => (
      <Col key={team} xs="auto" className="team-legend-item d-flex align-items-center">
        <span className="team-legend-color" style={{ backgroundColor: color }} />
        <span className="team-legend-text ms-1">{team}</span>
      </Col>
    ))}
  </Row>
);
export default TeamsLegend;