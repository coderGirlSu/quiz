# Generated by Django 5.0.1 on 2024-01-20 04:03

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("quiz_server", "0003_attempt"),
    ]

    operations = [
        migrations.AddField(
            model_name="attempt",
            name="user_id",
            field=models.IntegerField(default=0),
        ),
    ]
