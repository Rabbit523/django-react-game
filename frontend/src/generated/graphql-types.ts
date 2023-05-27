/* eslint-disable  no-explicit-any */

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: any;
};

/** An enumeration. */
export enum CardRank {
  Two = 'Two',
  Three = 'Three',
  Four = 'Four',
  Five = 'Five',
  Six = 'Six',
  Seven = 'Seven',
  Eight = 'Eight',
  Nine = 'Nine',
  Ten = 'Ten',
  Jack = 'Jack',
  Queen = 'Queen',
  King = 'King',
  Ace = 'Ace'
}

export type CardType = {
  __typename?: 'CardType';
  cardRank?: Maybe<CardRank>;
  suitType?: Maybe<Suits>;
  displayName?: Maybe<Scalars['String']>;
};

export type DoAction = {
  __typename?: 'DoAction';
  success?: Maybe<Scalars['Boolean']>;
  actionName?: Maybe<GameAction>;
  game?: Maybe<Game>;
};

/** GraphQL type for the User model. */
export type Game = {
  __typename?: 'Game';
  remainingCardCount: Scalars['Int'];
  remainingAceCount: Scalars['Int'];
  status: GameStatus;
  rigEnabled: Scalars['Boolean'];
  rigMode: GameRigMode;
  streakNumber: Scalars['Int'];
  streakType: GameStreakType;
  dealtCards?: Maybe<Array<Maybe<CardType>>>;
};

export enum GameAction {
  StartNew = 'StartNew',
  Deal = 'Deal',
  Reset = 'Reset'
}

/** An enumeration. */
export enum GameResultType {
  Win = 'WIN',
  Lose = 'LOSE'
}

/** An enumeration. */
export enum GameRigMode {
  /** Win */
  Win = 'WIN',
  /** Lose */
  Lose = 'LOSE'
}

/** An enumeration. */
export enum GameStatus {
  /** Win */
  Win = 'WIN',
  /** Lose */
  Lose = 'LOSE',
  /** Init */
  Init = 'INIT',
  /** Playing */
  Playing = 'PLAYING'
}

/** An enumeration. */
export enum GameStreakType {
  /** Win */
  Win = 'WIN',
  /** Lose */
  Lose = 'LOSE'
}


/** Mutation wrapper for all mutations. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Handle the Game Action like, StartNew, Deal, Reset.  */
  doAction?: Maybe<DoAction>;
  /** Setup RigMode and Enable Rig Mode */
  setRig?: Maybe<SetRig>;
  /** Obtain JSON Web Token mutation */
  tokenAuth?: Maybe<ObtainJsonWebToken>;
  refreshToken?: Maybe<Refresh>;
};


/** Mutation wrapper for all mutations. */
export type MutationDoActionArgs = {
  name: GameAction;
};


/** Mutation wrapper for all mutations. */
export type MutationSetRigArgs = {
  enable?: Maybe<Scalars['Boolean']>;
  mode?: Maybe<GameResultType>;
};


/** Mutation wrapper for all mutations. */
export type MutationTokenAuthArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


/** Mutation wrapper for all mutations. */
export type MutationRefreshTokenArgs = {
  token?: Maybe<Scalars['String']>;
};

/** Obtain JSON Web Token mutation */
export type ObtainJsonWebToken = {
  __typename?: 'ObtainJSONWebToken';
  payload: Scalars['GenericScalar'];
  refreshExpiresIn: Scalars['Int'];
  token: Scalars['String'];
};

/** Query wrapper for all queries. */
export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  game?: Maybe<Game>;
};

export type Refresh = {
  __typename?: 'Refresh';
  payload: Scalars['GenericScalar'];
  refreshExpiresIn: Scalars['Int'];
  token: Scalars['String'];
};

/** An enumeration. */
export enum Suits {
  Spade = 'Spade',
  Clover = 'Club',
  Diamond = 'Diamond',
  Heart = 'Heart'
}

export type SetRig = {
  __typename?: 'SetRig';
  success?: Maybe<Scalars['Boolean']>;
};

/** GraphQL type for the User model. */
export type User = {
  __typename?: 'User';
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String'];
  email: Scalars['String'];
};

export type TokenAuthMutationVariables = Exact<{ [key: string]: never; }>;


export type TokenAuthMutation = (
  { __typename?: 'Mutation' }
  & { tokenAuth?: Maybe<(
    { __typename?: 'ObtainJSONWebToken' }
    & Pick<ObtainJsonWebToken, 'token'>
  )> }
);

export type DoActionMutationVariables = Exact<{
  action: GameAction;
}>;


export type DoActionMutation = (
  { __typename?: 'Mutation' }
  & { doAction?: Maybe<(
    { __typename?: 'DoAction' }
    & Pick<DoAction, 'success' | 'actionName'>
    & { game?: Maybe<(
      { __typename?: 'Game' }
      & Pick<Game, 'status' | 'remainingCardCount' | 'remainingAceCount' | 'rigMode' | 'rigEnabled'>
      & { dealtCards?: Maybe<Array<Maybe<(
        { __typename?: 'CardType' }
        & Pick<CardType, 'cardRank' | 'suitType' | 'displayName'>
      )>>> }
    )> }
  )> }
);

export type CurrentGameStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentGameStatusQuery = (
  { __typename?: 'Query' }
  & { game?: Maybe<(
    { __typename?: 'Game' }
    & Pick<Game, 'status' | 'remainingCardCount' | 'remainingAceCount'>
    & { dealtCards?: Maybe<Array<Maybe<(
      { __typename?: 'CardType' }
      & Pick<CardType, 'cardRank' | 'suitType' | 'displayName'>
    )>>> }
  )> }
);


export const TokenAuthDocument = gql`
    mutation TokenAuth {
  tokenAuth(username: "interview", password: "uplifty") {
    token
  }
}
    `;
export type TokenAuthMutationFn = Apollo.MutationFunction<TokenAuthMutation, TokenAuthMutationVariables>;

/**
 * __useTokenAuthMutation__
 *
 * To run a mutation, you first call `useTokenAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTokenAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [tokenAuthMutation, { data, loading, error }] = useTokenAuthMutation({
 *   variables: {
 *   },
 * });
 */
export function useTokenAuthMutation(baseOptions?: Apollo.MutationHookOptions<TokenAuthMutation, TokenAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        //@ts-ignore
        return Apollo.useMutation<TokenAuthMutation, TokenAuthMutationVariables>(TokenAuthDocument, options);
      }
export type TokenAuthMutationHookResult = ReturnType<typeof useTokenAuthMutation>;
export type TokenAuthMutationOptions = Apollo.BaseMutationOptions<TokenAuthMutation, TokenAuthMutationVariables>;
export const DoActionDocument = gql`
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
export type DoActionMutationFn = Apollo.MutationFunction<DoActionMutation, DoActionMutationVariables>;

/**
 * __useDoActionMutation__
 *
 * To run a mutation, you first call `useDoActionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDoActionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [doActionMutation, { data, loading, error }] = useDoActionMutation({
 *   variables: {
 *      action: // value for 'action'
 *   },
 * });
 */
export function useDoActionMutation(baseOptions?: Apollo.MutationHookOptions<DoActionMutation, DoActionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        //@ts-ignore
        return Apollo.useMutation<DoActionMutation, DoActionMutationVariables>(DoActionDocument, options);
      }
export type DoActionMutationHookResult = ReturnType<typeof useDoActionMutation>;
export type DoActionMutationOptions = Apollo.BaseMutationOptions<DoActionMutation, DoActionMutationVariables>;
export const CurrentGameStatusDocument = gql`
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

/**
 * __useCurrentGameStatusQuery__
 *
 * To run a query within a React component, call `useCurrentGameStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentGameStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentGameStatusQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentGameStatusQuery(baseOptions?: Apollo.QueryHookOptions<CurrentGameStatusQuery, CurrentGameStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        //@ts-ignore
        return Apollo.useQuery<CurrentGameStatusQuery, CurrentGameStatusQueryVariables>(CurrentGameStatusDocument, options);
      }
export function useCurrentGameStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentGameStatusQuery, CurrentGameStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          //@ts-ignore
          return Apollo.useLazyQuery<CurrentGameStatusQuery, CurrentGameStatusQueryVariables>(CurrentGameStatusDocument, options);
        }
export type CurrentGameStatusQueryHookResult = ReturnType<typeof useCurrentGameStatusQuery>;
export type CurrentGameStatusLazyQueryHookResult = ReturnType<typeof useCurrentGameStatusLazyQuery>;
export function refetchCurrentGameStatusQuery(variables?: CurrentGameStatusQueryVariables) {
      return { query: CurrentGameStatusDocument, variables: variables }
    }