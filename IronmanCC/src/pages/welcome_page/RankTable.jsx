import React from 'react';

import ownerIcon from '../../resources/ranks/Owner.webp';
import deputyOwnerIcon from '../../resources/ranks/Deputy_owner.webp';
import mod2Icon from '../../resources/ranks/Brigadier.webp';
import modIcon from '../../resources/ranks/Colonel.webp';
import retiredModIcon from '../../resources/ranks/Legacy.webp';
import vouch2Icon from '../../resources/ranks/Officer.webp';
import vouch1Icon from '../../resources/ranks/General.webp';
import corporalIcon from '../../resources/ranks/Corporal.webp';
import recruitIcon from '../../resources/ranks/Recruit.webp';
import championIcon from '../../resources/ranks/Champion.webp';
import dunceIcon from '../../resources/ranks/Gnome_Child.webp';
import guestIcon from '../../resources/ranks/Guest.webp';
import competitorIcon from '../../resources/ranks/competitorRank.webp';
import wrathIcon from '../../resources/ranks/wrathRank.webp';
import scholarIcon from '../../resources/ranks/scholarRank.webp';
import infernalRank from '../../resources/ranks/infernalRank.webp';
import archerRank from '../../resources/ranks/archerRank.webp';
import achieverRank from '../../resources/ranks/achieverRank.webp';
import maxedRank from '../../resources/ranks/maxedRank.webp';
import xericianIcon from '../../resources/ranks/xericianRank.webp';
import clueRank from '../../resources/ranks/clueRank.webp'; 

const rankCategories = [
  { title: 'Moderator Ranks', ranks: [
    { icon: ownerIcon, text: 'Owner' },
    { icon: deputyOwnerIcon, text: 'Deputy Owner' },
    { icon: mod2Icon, text: 'Senior Moderator' },
    { icon: modIcon, text: 'Moderator' },
  ]},
  { title: 'Vouched Ranks', ranks: [
    { icon: vouch2Icon, text: 'Better Noodle (Vouched 3+)' },
    { icon: vouch1Icon, text: 'Good Noodle (Vouched 1+)' },
    { icon: retiredModIcon, text: 'Former Mod' },
  ]},
  { title: 'Achievement Ranks', ranks: [
    { icon: competitorIcon, text: '200M in a Single Skill or 1B Total Exp' },
    { icon: wrathIcon, text: 'Master/GM CAs or Blood Torva' },
    { icon: clueRank, text: '2277+ Total Clues' },
    { icon: scholarIcon, text: '1000+ Collection Logs' },
    { icon: xericianIcon, text: 'More than 1000 Combined Raids Cleared' },
    { icon: infernalRank, text: 'Inferno Completion' },
    { icon: archerRank, text: 'Colosseum Completion' },
    { icon: maxedRank, text: 'Achieved 2277 Total Level' },
    { icon: achieverRank, text: 'Achieved an Achievement Diary Cape'},
    { icon: corporalIcon, text: '2000 Total lvl' },
    { icon: recruitIcon, text: '1750 Total lvl' },
    { icon: championIcon, text: 'No Achievements Thus Far' },
  ]},
  { title: 'Other Ranks', ranks: [
    { icon: dunceIcon, text: 'Dunce rank' },
    { icon: guestIcon, text: 'Guest' },
  ]},
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
