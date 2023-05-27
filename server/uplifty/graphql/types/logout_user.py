"""Logout mutation."""

import graphene
from django.contrib.auth import authenticate, login, logout


class LogoutUser(graphene.Mutation):
    """Authentication mutation, deletes the session."""

    success = graphene.Boolean()

    def mutate(self, info, **kwargs):
        """Log the user out from Django."""
        logout(info.context)
        return LogoutUser(success=True)


class LoginUser(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        username = graphene.String()
        password = graphene.String()

    def mutate(self, info, username, password):
        user = authenticate(username=username, password=password)
        if user is None:
            return LoginUser(success=False)
        login(info.context, user)
        return LoginUser(success=True)
