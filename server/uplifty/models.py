import enum
import json
import random

from django.contrib.auth.models import User
from django.db import models


class SUITS(enum.IntEnum):
    Spade = 0
    Clover = 1
    Diamond = 2
    Heart = 3


class CardRank(enum.Enum):
    Two = "2"
    Three = "3"
    Four = "4"
    Five = "5"
    Six = "6"
    Seven = "7"
    Eight = "8"
    Nine = "9"
    Ten = "10"
    Jack = "J"
    Queen = "Q"
    King = "K"
    Ace = "A"


# Create your models here.
def init_cards():
    cards = [(suit.value, rank.value) for rank in CardRank for suit in SUITS]
    random.shuffle(cards)
    return json.dumps(cards)


class Game(models.Model):
    class STATUS(models.TextChoices):
        WIN = "WIN"
        LOSE = "LOSE"
        INIT = "INIT"
        PLAYING = "PLAYING"

    class GameResultType(models.TextChoices):
        WIN = "WIN"
        LOSE = "LOSE"

    DEAL_COUNT = 5  # number of dealt cards per deal
    CARDS_COUNT = 52

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # GamePlay
    shuffled_cards = models.TextField(default=init_cards)
    dealt_position = models.IntegerField(default=0)
    last_dealt_cards = models.TextField(default=json.dumps([]))
    remaining_card_count = models.IntegerField(default=CARDS_COUNT)
    remaining_ace_count = models.IntegerField(default=4)
    status = models.CharField(choices=STATUS.choices, max_length=10, default=STATUS.INIT)
    # Game Settings
    rig_enabled = models.BooleanField(default=False)
    rig_mode = models.CharField(
        choices=GameResultType.choices, default=GameResultType.WIN, max_length=5
    )
    # Streak
    streak_number = models.IntegerField(default=0)  # last number of consecutive result
    streak_type = models.CharField(
        choices=GameResultType.choices, max_length=5, default=GameResultType.WIN
    )  # represent if current streak is WIN or LOSE

    def get_last_dealt_cards(self):
        cards = json.loads(self.last_dealt_cards)
        return cards
        # return list(map(lambda card: SUITS(card[0]).name + " " + card[1].title(), cards))

    def reset(self):
        cards = self._shuffle_cards()
        self.dealt_position = 0
        self.remaining_card_count = len(cards)
        self.remaining_ace_count = 4
        self.last_dealt_cards = "[]"
        self.status = Game.STATUS.INIT

    def _shuffle_cards(self):
        """
        Set the cards value of Object and Return new card list.
        """
        cards = [(suit.value, rank.value) for rank in CardRank for suit in SUITS]
        random.shuffle(cards)
        if self.rig_enabled:
            if self.rig_mode == Game.GameResultType.WIN:
                for idx, card in enumerate(cards):
                    if CardRank(card[1]) == CardRank.Ace:
                        cards.append(cards.pop(idx))
                        break
            else:
                for i in range(Game.DEAL_COUNT):
                    card = cards[-i - 1]
                    if CardRank(card[1]) == CardRank.Ace:
                        cards.insert(0, cards.pop(-i - 1))
        self.shuffled_cards = json.dumps(cards)
        return cards

    def _resolve_streak_value(self):
        if self.status == Game.STATUS.WIN:
            if self.streak_type == Game.GameResultType.WIN:
                self.streak_number += 1
            else:
                self.streak_number = 1
                self.streak_type = Game.GameResultType.LOSE

        if self.status == Game.STATUS.LOSE:
            if self.streak_type == Game.GameResultType.WIN:
                self.streak_number = 1
                self.streak_type = Game.GameResultType.WIN

            else:
                self.streak_number += 1

    def deal_cards(self):
        """
        Deal the cards and Return (is_end:bool, current_dealt_cards:[])
        """
        # If Game is already finished. return last result
        if self.status == Game.STATUS.WIN or self.status == Game.STATUS.LOSE:
            return True, json.loads(self.last_dealt_cards)

        shuffled_cards = json.loads(self.shuffled_cards)
        dealt_position = self.dealt_position
        next_position = min(self.dealt_position + Game.DEAL_COUNT, len(shuffled_cards))
        dealt_cards = shuffled_cards[dealt_position:next_position]
        self.last_dealt_cards = json.dumps(dealt_cards)
        self.dealt_position = next_position
        self.remaining_card_count -= next_position - dealt_position
        dealt_ace_count = sum([1 for card in dealt_cards if CardRank(card[1]) == CardRank.Ace])
        self.remaining_ace_count -= dealt_ace_count

        # Check if game is over and evaluate the win/lose
        if self.remaining_card_count == 0:
            # if there is ace in last deal, evaluates WON or LOSE
            if dealt_ace_count == 0:
                self.status = Game.STATUS.LOSE
            else:
                self.status = Game.STATUS.WIN
            self._resolve_streak_value()
            return True, dealt_cards

        if self.remaining_ace_count == 0:
            self.status = Game.STATUS.LOSE
            self._resolve_streak_value()
            return True, dealt_cards

        self.status = Game.STATUS.PLAYING
        return False, dealt_cards
