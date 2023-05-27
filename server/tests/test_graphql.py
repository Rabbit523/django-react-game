"""Sanity test environment setup."""

from django.contrib.auth import get_user_model

from graphql.execution import ExecutionResult
from graphql_jwt.testcases import JSONWebTokenTestCase

from uplifty.graphql.types.game import GameAction
from uplifty.models import CardRank, Game


class GraphQLValidTestCase(JSONWebTokenTestCase):
    """Environment test cases."""

    def setUp(self):
        self.user = get_user_model().objects.create(username="test", email="test@test.com")
        self.client.authenticate(self.user)

    def test_me_query(self):
        query = """
            query {
                me {
                    username
                    email
                }
            }
            """
        res: ExecutionResult = self.client.execute(query)
        data = res.data

        self.assertIn("me", data)
        self.assertEqual(data["me"]["username"], "test")
        self.assertEqual(data["me"]["email"], "test@test.com")

    def test_game_query(self):
        query = """
            query {
                game {
                    remainingCardCount
                    remainingAceCount
                    status
                    dealtCards {
                        cardRank
                        suitType
                        displayName                    
                    }
                }
            }
            """
        res: ExecutionResult = self.client.execute(query)
        self.assertIsNone(res.errors)

    def test_game_reset(self):
        """
        Reset action shuffle the cards.
        Check if its status is "init" and \
        remaining_cards_count is equal to number of cards of a deck(52).
        """
        mutation = """
            mutation DoAction($action: GameAction!){
                doAction(name:$action){
                    success
                    actionName
                    game{
                    status,
                    remainingCardCount
                  }
                }
            }
        """
        res: ExecutionResult = self.client.execute(
            mutation, variables={"action": GameAction.Reset.value}
        )
        self.assertIsNone(res.errors)
        data = res.data["doAction"]
        self.assertTrue(data["success"])
        self.assertEqual(data["actionName"], GameAction.Reset)
        self.assertEqual(data["game"]["status"], Game.STATUS.INIT)
        self.assertEqual(data["game"]["remainingCardCount"], Game.CARDS_COUNT)

    def test_game_start_new_mutation(self):
        """
        Action "StartNew" shuffle the cards again and do the first deal.
        Check if its status is "playing" and remaining_cards_count is smaller than 52.
        """
        mutation = """
            mutation DoAction($action: GameAction!){
                doAction(name:$action){
                    success
                    actionName
                    game{
                    status,
                    remainingCardCount
                  }
                }
            }
        """
        res: ExecutionResult = self.client.execute(
            mutation, variables={"action": GameAction.StartNew.value}
        )
        self.assertIsNone(res.errors)
        data = res.data["doAction"]
        self.assertTrue(data["success"])
        self.assertEqual(data["actionName"], GameAction.StartNew)
        self.assertEqual(data["game"]["status"], Game.STATUS.PLAYING)
        self.assertEqual(data["game"]["remainingCardCount"], Game.CARDS_COUNT - Game.DEAL_COUNT)

    def test_game_deal(self):
        """
        Deal action do the next dealing.
        Check if it is success and remaining_cards_count is reduced by DealCount
        """
        mutation = """
            mutation DoAction($action: GameAction!){
                doAction(name:$action){
                    success
                    actionName
                    game {
                        status,
                        remainingCardCount
                        remainingAceCount
                        status
                        dealtCards {
                            cardRank
                            suitType
                            displayName                    
                        }
                  }
                }
            }
        """
        game_obj, _ = Game.objects.get_or_create(user=self.user)
        expected_remaining_card_count = game_obj.remaining_card_count - Game.DEAL_COUNT

        res: ExecutionResult = self.client.execute(
            mutation, variables={"action": GameAction.Deal.value}
        )
        self.assertIsNone(res.errors)
        data = res.data["doAction"]
        dealt_ace_count = sum(
            [1 for card in data["game"]["dealtCards"] if CardRank[card["cardRank"]] == CardRank.Ace]
        )
        expected_remaining_ace_count = game_obj.remaining_ace_count - dealt_ace_count

        self.assertTrue(data["success"])
        self.assertEqual(data["actionName"], GameAction.Deal)
        self.assertEqual(data["game"]["remainingCardCount"], expected_remaining_card_count)
        self.assertEqual(data["game"]["remainingAceCount"], expected_remaining_ace_count)

    def test_set_rig_mutation(self):
        """
        Expect Rig_Mode and Rig_Enabled is set correctly per request
        """
        mutation = """
            mutation SetRig($enable:Boolean, $mode:GameResultType){
                setRig(enable:$enable,mode:$mode){
                    success
                }
            }
        """
        res: ExecutionResult = self.client.execute(
            mutation, variables={"enable": True, "mode": Game.GameResultType.WIN.value}
        )
        self.assertIsNone(res.errors)
        self.assertTrue(res.data["setRig"]["success"])
        game = Game.objects.get(user=self.user)
        self.assertTrue(game.rig_enabled)
        self.assertEqual(game.rig_mode, Game.GameResultType.WIN)

    def test_rig_lose_game(self):
        """
        Check if the game is over when ace cards are all dealt before the last deal
        """
        mutation = """
            mutation DoAction($action: GameAction!){
                doAction(name:$action){
                    success
                    game {
                        status
                        remainingCardCount
                    }
                }
            }
        """
        game_obj, _ = Game.objects.get_or_create(user=self.user)
        game_obj.rig_enabled = True
        game_obj.rig_mode = Game.GameResultType.LOSE
        game_obj.reset()
        game_obj.save()

        while True:
            res: ExecutionResult = self.client.execute(
                mutation, variables={"action": GameAction.Deal.value}
            )
            self.assertIsNone(res.errors)
            data = res.data["doAction"]
            if data["game"]["status"] != Game.STATUS.PLAYING:
                break

        self.assertEqual(data["game"]["status"], Game.STATUS.LOSE)
        self.assertNotEqual(data["game"]["remainingCardCount"], 0)

    def test_rig_win_game(self):
        """
        Check if the game is win when RigMode is Win and RigMode is enabled.
        """
        mutation = """
            mutation DoAction($action: GameAction!){
                doAction(name:$action){
                    success
                    game {
                    status,
                    remainingCardCount
                  }
                }
            }
        """
        game_obj, _ = Game.objects.get_or_create(user=self.user)
        game_obj.rig_enabled = True
        game_obj.rig_mode = Game.GameResultType.WIN
        game_obj.reset()
        game_obj.save()

        while True:
            res: ExecutionResult = self.client.execute(
                mutation, variables={"action": GameAction.Deal.value}
            )
            self.assertIsNone(res.errors)
            data = res.data["doAction"]
            if data["game"]["status"] != Game.STATUS.PLAYING:
                break

        self.assertEqual(data["game"]["status"], Game.STATUS.WIN)
        self.assertEqual(data["game"]["remainingCardCount"], 0)

    def test_streak_feature(self):
        """
        Check If number of consecutive result increase when consecutive same game result is happened
        """
        game_obj, _ = Game.objects.get_or_create(user=self.user)
        game_obj.streak_number = 2
        game_obj.streak_type = Game.GameResultType.WIN
        game_obj.rig_enabled = True
        game_obj.rig_mode = Game.GameResultType.WIN
        game_obj.reset()
        game_obj.save()

        expected_streak_number = game_obj.streak_number + 1
        expected_streak_type = game_obj.streak_type
        mutation = """
            mutation DoAction($action: GameAction!){
                doAction(name:$action){
                    success
                    game {
                    status,
                    streakNumber,
                    streakType
                  }
                }
            }
        """
        while True:
            res: ExecutionResult = self.client.execute(
                mutation, variables={"action": GameAction.Deal.value}
            )
            self.assertIsNone(res.errors)
            data = res.data["doAction"]
            if data["game"]["status"] != Game.STATUS.PLAYING:
                break
        self.assertEqual(data["game"]["streakNumber"], expected_streak_number)
        self.assertEqual(data["game"]["streakType"], expected_streak_type)


class GraphQLInValidTestCase(JSONWebTokenTestCase):
    def test_me_query(self):
        """
        When Authorization Header is not specified, Expect the error message.
        """
        query = """
            query {
                me {
                    username
                    email
                }
            }
            """
        res: ExecutionResult = self.client.execute(query)
        errors = res.errors
        self.assertIsNone(res.data["me"])
        self.assertGreater(len(errors), 0)

    def test_game_query(self):
        """
        Expect return error message when request is not authorized.
        """
        query = """
            query {
                game {
                    remainingCardCount
                    remainingAceCount
                    status
                    dealtCards {
                        cardRank
                        suitType
                        displayName
                    }
                }
            }
            """
        res: ExecutionResult = self.client.execute(query)
        errors = res.errors
        self.assertIsNone(res.data["game"])
        self.assertGreater(len(errors), 0)

    def test_do_action(self):
        """
        Expect mutation return error response when request is not authorized.
        """

        mutation = """
            mutation DoAction($action: GameAction!){
                doAction(name:$action){
                    success
                    actionName
                    game{
                    status,
                    remainingCardCount
                  }
                }
            }
        """
        for action in GameAction.__enum__:
            res: ExecutionResult = self.client.execute(mutation, variables={"action": action.value})
            errors = res.errors
            self.assertIsNone(res.data["doAction"])
            self.assertGreater(len(errors), 0)

    def test_set_rig_mutation(self):
        """
        Expect mutation return error response when request is not authorized.
        """

        mutation = """
            mutation SetRig($enable:Boolean, $mode:RigMode){
                setRig(enable:$enable,mode:$mode){
                    success
                }
            }
        """
        res: ExecutionResult = self.client.execute(
            mutation, variables={"enable": True, "mode": Game.GameResultType.WIN.value}
        )
        self.assertIsNone(res.data)
        errors = res.errors
        self.assertGreater(len(errors), 0)
