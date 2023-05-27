import { gql } from '@apollo/client';

export const TokenAuth = gql`
  mutation TokenAuth {
    tokenAuth(username: "interview", password: "uplifty") {
      token
    }
  }
`;

export const DoAction = gql`
  mutation DoAction($action: GameAction!) {
    doAction(name: $action) {
      success
      actionName
      game {
        status
        remainingCardCount
        remainingAceCount
        dealtCards {
          cardRank
          suitType
          displayName
        }
        rigMode
        rigEnabled
      }
    }
  }
`;
