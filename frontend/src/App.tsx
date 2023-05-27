import party from 'party-js';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import useSound from 'use-sound';
import DealingSound from './assets/sound/dealing.mp3';
import fireWorks from './assets/sound/fireworks.mp3';
import WinnerSVG from './assets/winner.svg';
import CardBoard from './feature/CardBoard';
import {
  Game,
  GameAction,
  GameStatus,
  useCurrentGameStatusLazyQuery,
  useDoActionMutation,
  useTokenAuthMutation,
} from './generated/graphql-types';
import styles from './App.module.css';

const BoardItem = styled.div.attrs({
  className: 'bg-black border flex flex-col font-bold justify-center mx-1.5',
})`
  width: 180px;
  height: 120px;
  border-color: #fff48c;
`;

const DealBtn = styled.button.attrs({
  className: 'rounded-md text-black text-6xl px-10 py-5 font-alfa',
})`
  background-color: #efce4b;
`;
const RoundedOutlineBtn = styled.button.attrs({
  className: 'border-solid	border rounded-lg text-xl px-5 py-1 font-alfa',
})`
  border-color: #efce4b;
  color: #efce4b;
`;

const WinnerDiv = styled.div.attrs({
  className: 'left-2/4 ',
})`
  width: 1028px;
  max-width: 100%;
  @media (min-width: 768px) {
    max-width: 70%;
    margin: auto;
  }
`;

const BulletinBoard = styled.div.attrs({
  className: 'bullettin-board flex justify-center px-10 pt-10',
})``;

function App() {
  const [play] = useSound(DealingSound);
  const [playFireworks] = useSound(fireWorks);
  const [loading, setLoading] = useState<boolean>(true);
  const [gameData, setGameData] = useState<Game>();
  const [getGameStatus] = useCurrentGameStatusLazyQuery();
  const [tokenAuthMutation, { loading: authenticating, error }] = useTokenAuthMutation();
  const [doActionMutation] = useDoActionMutation();

  const onDealBtnClick = () => {
    if (!gameData) return;
    if (gameData.status === GameStatus.Win || gameData.status === GameStatus.Lose) return;
    doActionMutation({ variables: { action: GameAction.Deal } }).then((resp) => {
      if (resp.data) {
        setGameData(resp.data?.doAction?.game as Game);
        if (resp.data?.doAction?.game?.status === GameStatus.Win) {
          playFireworks();
          party.confetti(party.Rect.fromScreen(), { count: party.variation.range(70, 100) });
        } else {
          play();
        }
      }
    });
  };

  const onResetBtnClick = () => {
    doActionMutation({ variables: { action: GameAction.Reset } }).then((resp) => {
      if (resp.data) {
        setGameData(resp.data?.doAction?.game as Game);
      }
    });
  };

  const onPlayAgainBtnClick = () => {
    doActionMutation({ variables: { action: GameAction.StartNew } }).then((resp) => {
      if (resp.data) {
        setGameData(resp.data?.doAction?.game as Game);
      }
    });
  };

  useEffect(() => {
    console.info('Use Effect');
    getGameStatus().then((resp) => {
      if (resp.error) {
        tokenAuthMutation().then((response) => {
          localStorage.setItem('token', response.data?.tokenAuth?.token || '');
        });
      } else {
        setGameData(resp.data?.game as Game);
      }
      setLoading(false);
    });
  }, []);

  // useEffect(() => {
  //   console.info(' ============ render =============');
  //   console.info(loading, authenticating, error, gameData);
  // });

  if (loading) return <h1>Loading</h1>;
  if (authenticating) {
    return <h1> Authenticating </h1>;
  }
  if (error) {
    return <h1> Error is raised. Refresh the browser after 5 seconds ... </h1>;
  }

  // console.info(gameData);

  return (
    <div className={styles.body}>
      <BulletinBoard>
        <BoardItem>
          <p className="text-white text-4xl"> {gameData?.remainingCardCount} </p>
          <p className="text-white text-xl"> Cards Left </p>
        </BoardItem>
        <BoardItem>
          <p className="text-white text-4xl"> {gameData?.remainingAceCount} </p>
          <p className="text-white text-xl"> Aces Left </p>
        </BoardItem>
      </BulletinBoard>
      {gameData?.status === GameStatus.Win && (
        <WinnerDiv>
          <img src={WinnerSVG} alt="" />
        </WinnerDiv>
      )}

      <CardBoard cards={gameData?.dealtCards || []} />

      {gameData?.status === GameStatus.Lose && (
        <p className="text-white my-10">
          {' '}
          You lose. <br /> Better luck next time!{' '}
        </p>
      )}

      {(gameData?.status === GameStatus.Lose || gameData?.status === GameStatus.Win) && (
        <div className="mt-1.5 mb-12">
          <RoundedOutlineBtn onClick={onPlayAgainBtnClick}> Play Again</RoundedOutlineBtn>
        </div>
      )}

      <div className="my-10">
        <DealBtn onClick={onDealBtnClick}>DEAL</DealBtn>
      </div>
      <div className="mt-1.5 mb-12 md:mr-6 md:text-right">
        <RoundedOutlineBtn onClick={onResetBtnClick}> Reset</RoundedOutlineBtn>
      </div>
    </div>
  );
}

export default App;
