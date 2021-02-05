# Generated by Django 3.1.5 on 2021-02-05 00:00

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vote', '0004_auto_20210131_1621'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competitor',
            name='min1',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.PositiveSmallIntegerField(), blank=True, null=True, size=9, verbose_name='minuto 1'),
        ),
        migrations.AlterField(
            model_name='competitor',
            name='min2',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.PositiveSmallIntegerField(), blank=True, null=True, size=9, verbose_name='minuto 2'),
        ),
    ]