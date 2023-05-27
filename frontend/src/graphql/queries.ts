import { gql } from '@apollo/client';

export const CurrentGameStatus = gql`
  query CurrentGameStatus {
    game {
      status
      remainingCardCount
      dealtCards {
        cardRank
        suitType
        displayName
      }
      remainingAceCount
    }
  }
`;
