import React from 'react';
import './GavelIcon.css';
import { ReactComponent as GavelSVG } from './gavel-svgrepo-com.svg';

const GavelIcon = ({ onClick, isBanging }) => {
  return (
    <div onClick={onClick} className={`gavel-container ${isBanging ? 'gavel-bang' : ''}`}>
      <GavelSVG className="gavel-svg" />
    </div>
  );
};

export default GavelIcon;