import React from 'react';
import './header/Header.css';

import zz from '../resources/images/zz.png';

function Footer() {
    return (
        <div className="site-credits">
          Created by: AbusiveTuna <a href="https://github.com/AbusiveTuna"><img src={zz} alt="AbusiveTuna" /></a>
        </div>
      );
    }
  
export default Footer;