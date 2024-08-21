import React from 'react';

const SelectedSkillHeader = ({ skill, displayName, getIconUrl }) => {
  return (
    <div className="selected-skill-header">
      <img
        src={getIconUrl(skill)}
        alt={skill}
        className="selected-skill-icon"
      />
      <span className="selected-skill-text">{displayName}</span>
      <img
        src={getIconUrl(skill)}
        alt={skill}
        className="selected-skill-icon"
      />
    </div>
  );
};

export default SelectedSkillHeader;