/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import CloverSVG from '../../assets/Clover.svg';
import DiamondSVG from '../../assets/Diamond.svg';
import HeartSVG from '../../assets/Heart.svg';
import SpadeSVG from '../../assets/Spade.svg';
import { Suits } from '../../generated/graphql-types';
import { CardInputProps, CardRank } from './types';

import './styles.css';

const Card: React.FC<CardInputProps> = ({ cardRank, suitType }) => {
  let cardImage;
  switch (suitType) {
    case Suits.Clover:
      cardImage = CloverSVG;
      break;
    case Suits.Diamond:
      cardImage = DiamondSVG;
      break;
    case Suits.Heart:
      cardImage = HeartSVG;
      break;
    case Suits.Spade:
      cardImage = SpadeSVG;
      break;
    default:
      cardImage = HeartSVG;
      break;
  }
  // useEffect(() => {

  // },[cardRank])
  return (
    <>
      <div className="bg-white card-body">
        <span className="card-letter text-3xl sm:text-6xl md:text-7xl">
          {' '}
          {CardRank[cardRank!]}{' '}
        </span>
        <img className="suit-sub-img" src={cardImage} alt="suit-img" />
        <img className="suit-main-img" src={cardImage} alt="suit-img" />
      </div>
    </>
  );
};

export default Card;
