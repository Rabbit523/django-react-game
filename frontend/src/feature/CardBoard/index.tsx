import React from 'react';
import Anime, { anime } from 'react-animejs-wrapper';
import { useMediaQuery } from 'react-responsive';
import styled, { css } from 'styled-components';
import Card from '../../components/Card';
import './styles.css';
import { CardBoardInputProps, CardListInputProps } from './types';

const CardList = styled.div<CardListInputProps>`
  width: 1225px;
  height: 348px;
  ${(props) =>
    props.scale < 1
      ? css`
          position: absolute;
          left: 50%;
          transform: translate(-50%) scale(${props.scale});
        `
      : ``}
`;
const CardBoard: React.FC<CardBoardInputProps> = ({ cards }) => {
  const isBigDesktop = useMediaQuery({
    query: '(min-width: 1440px)',
  });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  if (cards.length === 0) return null;
  return (
    <>
      <Anime
        config={{
          targets: '.anime-div',
          translateY: [isMobile || isBigDesktop ? '-80vh' : '-150vh', 0],
          duration: 100,
          delay: anime.stagger(100),
          easing: 'easeInQuart',
        }}
        className="mt-10 flex justify-center items-center flex-wrap anime-content"
      >
        {isMobile ? (
          cards.map((item) => (
            <div className="mx-1.5 mb-1.5 anime-div" key={item.suitType! + item.cardRank!}>
              <Card cardRank={item.cardRank} suitType={item.suitType} />
            </div>
          ))
        ) : (
          <CardList scale={isBigDesktop ? 1 : 0.5}>
            {cards.length === 2 ? (
              <>
                <div className="mx-5 mb-1.5 inline-block anime-div">
                  <Card cardRank={cards[0].cardRank} suitType={cards[0].suitType} />
                </div>
                <div className="mx-5 mb-1.5 inline-block anime-div">
                  <Card cardRank={cards[1].cardRank} suitType={cards[1].suitType} />
                </div>
              </>
            ) : (
              <>
                <div className="anime-div">
                  <div className="absolute card-first">
                    <Card cardRank={cards[0].cardRank} suitType={cards[0].suitType} />
                  </div>
                </div>
                <div className="anime-div">
                  <div className="absolute card-second">
                    <Card cardRank={cards[1].cardRank} suitType={cards[1].suitType} />
                  </div>
                </div>
                <div className="anime-div">
                  <div className="absolute card-third">
                    <Card cardRank={cards[2].cardRank} suitType={cards[2].suitType} />
                  </div>
                </div>
                <div className="anime-div">
                  <div className="absolute card-reverse-second">
                    <Card cardRank={cards[3].cardRank} suitType={cards[3].suitType} />
                  </div>
                </div>
                <div className="anime-div">
                  <div className="absolute card-reverse-first">
                    <Card cardRank={cards[4].cardRank} suitType={cards[4].suitType} />
                  </div>
                </div>
              </>
            )}
          </CardList>
        )}
      </Anime>
    </>
  );
};

export default CardBoard;
