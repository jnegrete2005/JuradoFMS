# Generated by Django 3.1.5 on 2021-04-24 22:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vote', '0012_auto_20210416_1738'),
    ]

    operations = [
        migrations.AddField(
            model_name='votingpoll',
            name='rep_counter',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
    ]
