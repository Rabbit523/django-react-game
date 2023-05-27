"""User GraphQL types."""

import graphene

from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from uplifty.models import SUITS as DjangoSuits
from uplifty.models import CardRank as DjangoCardRank
from uplifty.models import Game as GameModel

SUITS = graphene.Enum.from_enum(DjangoSuits)
CardRank = graphene.Enum.from_enum(DjangoCardRank)


class CardType(graphene.ObjectType):
    card_rank = CardRank()
    suit_type = SUITS()
    display_name = graphene.String()

    def resolve_display_name(parent, info):
        return f"{parent.suit_type.name} {parent.card_rank.name.title()}"


class Game(DjangoObjectType):
    """GraphQL type for the User model."""

    dealt_cards = graphene.List(CardType)

    class Meta:
        model = GameModel
        fields = (
            "remaining_card_count",
            "remaining_ace_count",
            "status",
            "rig_enabled",
            "rig_mode",
            "streak_number",
            "streak_type",
        )

    def resolve_dealt_cards(self, info):
        cards = self.get_last_dealt_cards()
        return list(
            map(
                lambda card: CardType(
                    suit_type=SUITS.get(card[0]), card_rank=CardRank.get(card[1])
                ),
                cards,
            )
        )


class GameAction(graphene.Enum):
    StartNew = "StartNew"
    Deal = "Deal"
    Reset = "Reset"


class DoAction(graphene.Mutation):
    success = graphene.Boolean()
    action_name = GameAction()
    game = graphene.Field(Game)

    class Arguments:
        name = GameAction(required=True)

    @login_required
    def mutate(self, info, name):
        """
        Handle the Game Action like, StartNew, Deal, Reset.
        """
        game_action = GameAction.get(name)
        game_obj, created = GameModel.objects.get_or_create(user=info.context.user)
        if game_action == GameAction.StartNew or game_action == GameAction.Reset:
            game_obj.reset()
        if game_action != GameAction.Reset:
            game_obj.deal_cards()
        game_obj.save()
        return DoAction(success=True, action_name=GameAction.get(name), game=game_obj)


RigType = graphene.Enum.from_enum(GameModel.GameResultType)


class SetRig(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        enable = graphene.Boolean()
        mode = RigType()
        # mode = graphene.InputField(RigType)

    @login_required
    def mutate(self, info, **kwargs):
        """
        Enable Rig Play or Set RigMode
        """
        game_obj, created = GameModel.objects.get_or_create(user=info.context.user)
        if "enable" in kwargs:
            game_obj.rig_enabled = kwargs["enable"]
        if "mode" in kwargs:
            game_obj.rig_mode = kwargs["mode"]
        game_obj.save()
        return SetRig(success=True)
