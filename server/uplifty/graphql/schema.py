"""GraphQL schema specific to this app."""

import graphene

import graphql_jwt
from graphql_jwt.decorators import login_required

from uplifty.models import Game

from .types.game import DoAction
from .types.game import Game as GameNode
from .types.game import SetRig
from .types.user import User as UserNode


class Query(graphene.ObjectType):
    """Queries specific to uplifty app."""

    class Meta:
        abstract = True

    me = graphene.Field(UserNode)
    game = graphene.Field(GameNode)

    def resolve_me(self, info, **kwargs):
        """Return the current logged in user."""
        return info.context.user

    @login_required
    def resolve_game(self, info):
        object, created = Game.objects.get_or_create(user=info.context.user)
        return object


class Mutation(graphene.ObjectType):
    """Mutations specific to uplifty app."""

    class Meta:
        abstract = True

    # logout_user = LogoutUser.Field(description="Log the user out.")
    do_action = DoAction.Field(description="Handle the Game Action like, StartNew, Deal, Reset. ")
    set_rig = SetRig.Field(description="Setup RigMode and Enable Rig Mode")
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    refresh_token = graphql_jwt.Refresh.Field()
