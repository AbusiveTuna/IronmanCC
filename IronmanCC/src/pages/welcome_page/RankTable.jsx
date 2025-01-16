import React from 'react';

import ownerIcon from '../../resources/ranks/Owner.webp';
import deputyOwnerIcon from '../../resources/ranks/Deputy_owner.webp';
import administratorIcon from '../../resources/ranks/Administrator.webp';
import mod2Icon from '../../resources/ranks/Brigadier.webp';
import modIcon from '../../resources/ranks/Colonel.webp';
import retiredModIcon from '../../resources/ranks/Legacy.webp';
import vouch3Icon from '../../resources/ranks/Commander.webp';
import vouch2Icon from '../../resources/ranks/Officer.webp';
import vouch1Icon from '../../resources/ranks/General.webp';
import sergeantIcon from '../../resources/ranks/Sergeant.webp';
import corporalIcon from '../../resources/ranks/Corporal.webp';
import recruitIcon from '../../resources/ranks/Recruit.webp';
import championIcon from '../../resources/ranks/Champion.webp';
import dunceIcon from '../../resources/ranks/Gnome_Child.webp';
import guestIcon from '../../resources/ranks/Guest.webp';

const data = [
    { icon: ownerIcon, text: 'Owner' },
    { icon: deputyOwnerIcon, text: 'Deputy Owner' },
    { icon: administratorIcon, text: 'Administrator' },
    { icon: mod2Icon, text: 'Senior Moderator' },
    { icon: modIcon, text: 'Moderator' },
    { icon: retiredModIcon, text: 'Former Mod' },
    { icon: vouch3Icon, text: 'Vouch Rank 3' },
    { icon: vouch2Icon, text: 'Vouch Rank 2' },
    { icon: vouch1Icon, text: 'Vouch Rank 1' },
    { icon: sergeantIcon, text: '2200 Total lvl' },
    { icon: corporalIcon, text: '2000 Total lvl' },
    { icon: recruitIcon, text: '1750 Total lvl' },
    { icon: championIcon, text: 'Under 1750 Total lvl' },
    { icon: dunceIcon, text: 'Dunce rank ' },
    { icon: guestIcon, text: 'Guest' },
  ];

const RankTable = () => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '3px', textAlign: 'center', width: '30px' }}>
              <img src={item.icon} alt={`icon-${index}`} style={{ width: '15px', height: '15px' }} />
            </td>
            <td style={{ padding: '3px' }}>{item.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RankTable;
