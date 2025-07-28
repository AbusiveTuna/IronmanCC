import React from 'react';
import { Button, Col } from 'react-bootstrap';

const SkillButtons = ({
  skills,
  handleClick,
  getIconUrl,
  selectedTile,
  colorMap = {},
  showTeamcolors = false,
}) => (
  <>
    {skills.map((skill, index) => {
      const isCategory = skill.isCategory;
      const tint = showTeamcolors ? colorMap[skill.name] : undefined;

      return (
        <Col key={index} xs="auto" className="mb-1 p-1 text-center">
          <Button
            variant="outline-primary"
            onClick={() => handleClick(skill.name)}
            className={`skill-button ${
              selectedTile === skill.name ? 'selected-tile' : ''
            }`}
            style={tint ? { backgroundColor: tint } : undefined}
          >
            {isCategory ? (
              <span>{skill.displayName}</span>
            ) : (
              <>
                <span className="visually-hidden">{skill.displayName}</span>
                <div
                  className="button-background"
                  style={{ backgroundImage: `url(${getIconUrl(skill.name)})` }}
                />
              </>
            )}
          </Button>
        </Col>
      );
    })}
  </>
);

export default SkillButtons;
