# Generated by Django 3.2.13 on 2022-08-01 23:57

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models

import uplifty.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Game",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("shuffled_cards", models.TextField(default=uplifty.models.init_cards)),
                ("dealt_position", models.IntegerField(default=0)),
                ("last_dealt_cards", models.TextField(default="[]")),
                ("remaining_card_count", models.IntegerField(default=52)),
                ("remaining_ace_count", models.IntegerField(default=4)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("WIN", "Win"),
                            ("LOSE", "Lose"),
                            ("INIT", "Init"),
                            ("PLAYING", "Playing"),
                        ],
                        default="INIT",
                        max_length=10,
                    ),
                ),
                ("rig_enabled", models.BooleanField(default=False)),
                (
                    "rig_mode",
                    models.CharField(
                        choices=[("WIN", "Win"), ("LOSE", "Lose")], default="WIN", max_length=5
                    ),
                ),
                ("streak_number", models.IntegerField(default=0)),
                (
                    "streak_type",
                    models.CharField(
                        choices=[("WIN", "Win"), ("LOSE", "Lose")], default="WIN", max_length=5
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
                    ),
                ),
            ],
        ),
    ]