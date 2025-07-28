import React from 'react';

const rankCategories = [
  {
    title: 'Moderator Ranks',
    ranks: [
      { icon: '/ranks/Owner.webp', text: 'Owner' },
      { icon: '/ranks/Deputy_owner.webp', text: 'Deputy Owner' },
      { icon: '/ranks/Brigadier.webp', text: 'Senior Moderator' },
      { icon: '/ranks/Colonel.webp', text: 'Moderator' },
    ],
  },
  {
    title: 'Vouched Ranks',
    ranks: [
      { icon: '/ranks/Officer.webp', text: 'Better Noodle (Vouched 3+)' },
      { icon: '/ranks/General.webp', text: 'Good Noodle (Vouched 1+)' },
      { icon: '/ranks/Legacy.webp', text: 'Former Mod' },
    ],
  },
  {
    title: 'Achievement Ranks',
    ranks: [
      { icon: '/ranks/competitorRank.webp', text: '200M in a Single Skill or 1B Total Exp' },
      { icon: '/ranks/wrathRank.webp', text: 'Master/GM CAs or Blood Torva' },
      { icon: '/ranks/clueRank.webp', text: '2277+ Total Clues' },
      { icon: '/ranks/scholarRank.webp', text: '1000+ Collection Logs' },
      { icon: '/ranks/xericianRank.webp', text: 'More than 1000 Combined Raids Cleared' },
      { icon: '/ranks/infernalRank.webp', text: 'Inferno Completion' },
      { icon: '/ranks/archerRank.webp', text: 'Colosseum Completion' },
      { icon: '/ranks/maxedRank.webp', text: 'Achieved 2277 Total Level' },
      { icon: '/ranks/achieverRank.webp', text: 'Achieved an Achievement Diary Cape' },
      { icon: '/ranks/Corporal.webp', text: '2000 Total lvl' },
      { icon: '/ranks/Recruit.webp', text: '1750 Total lvl' },
      { icon: '/ranks/Champion.webp', text: 'No Achievements Thus Far' },
    ],
  },
  {
    title: 'Other Ranks',
    ranks: [
      { icon: '/ranks/gnomeRank.webp', text: 'Dunce rank' },
      { icon: '/ranks/Guest.webp', text: 'Guest' },
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
