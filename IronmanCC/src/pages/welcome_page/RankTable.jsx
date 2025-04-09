import React from 'react';

const rankCategories = [
  {
    title: 'Moderator Ranks',
    ranks: [
      { icon: '/resources/ranks/Owner.webp', text: 'Owner' },
      { icon: '/resources/ranks/Deputy_owner.webp', text: 'Deputy Owner' },
      { icon: '/resources/ranks/Brigadier.webp', text: 'Senior Moderator' },
      { icon: '/resources/ranks/Colonel.webp', text: 'Moderator' },
    ],
  },
  {
    title: 'Vouched Ranks',
    ranks: [
      { icon: '/resources/ranks/Officer.webp', text: 'Better Noodle (Vouched 3+)' },
      { icon: '/resources/ranks/General.webp', text: 'Good Noodle (Vouched 1+)' },
      { icon: '/resources/ranks/Legacy.webp', text: 'Former Mod' },
    ],
  },
  {
    title: 'Achievement Ranks',
    ranks: [
      { icon: '/resources/ranks/competitorRank.webp', text: '200M in a Single Skill or 1B Total Exp' },
      { icon: '/resources/ranks/wrathRank.webp', text: 'Master/GM CAs or Blood Torva' },
      { icon: '/resources/ranks/clueRank.webp', text: '2277+ Total Clues' },
      { icon: '/resources/ranks/scholarRank.webp', text: '1000+ Collection Logs' },
      { icon: '/resources/ranks/xericianRank.webp', text: 'More than 1000 Combined Raids Cleared' },
      { icon: '/resources/ranks/infernalRank.webp', text: 'Inferno Completion' },
      { icon: '/resources/ranks/archerRank.webp', text: 'Colosseum Completion' },
      { icon: '/resources/ranks/maxedRank.webp', text: 'Achieved 2277 Total Level' },
      { icon: '/resources/ranks/achieverRank.webp', text: 'Achieved an Achievement Diary Cape' },
      { icon: '/resources/ranks/Corporal.webp', text: '2000 Total lvl' },
      { icon: '/resources/ranks/Recruit.webp', text: '1750 Total lvl' },
      { icon: '/resources/ranks/Champion.webp', text: 'No Achievements Thus Far' },
    ],
  },
  {
    title: 'Other Ranks',
    ranks: [
      { icon: '/resources/ranks/gnomeRank.webp', text: 'Dunce rank' },
      { icon: '/resources/ranks/Guest.webp', text: 'Guest' },
    ],
  },
];

const RankTable = () => {
  return (
    <table className="rank-table">
      <tbody>
        {rankCategories.map((category, catIndex) => (
          <React.Fragment key={catIndex}>
            <tr className="rank-category-header">
              <th colSpan="2">{category.title}</th>
            </tr>
            {category.ranks.map((item, index) => (
              <tr key={index} className="rank-row">
                <td className="rank-icon-cell">
                  <img src={item.icon} alt={item.text} className="rank-icon" />
                </td>
                <td className="rank-text">{item.text}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default RankTable;
