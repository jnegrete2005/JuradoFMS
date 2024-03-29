# Generated by Django 3.1.5 on 2021-05-02 20:04

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vote', '0015_auto_20210501_1811'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competitor',
            name='deluxe',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), blank=True, null=True, size=14, verbose_name='Deluxe'),
        ),
        migrations.AlterField(
            model_name='competitor',
            name='easy',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), blank=True, null=True, size=9, verbose_name='Easy Mode'),
        ),
        migrations.AlterField(
            model_name='competitor',
            name='hard',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), blank=True, null=True, size=9, verbose_name='Hard Mode'),
        ),
        migrations.AlterField(
            model_name='competitor',
            name='min1',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), blank=True, null=True, size=9, verbose_name='minuto 1'),
        ),
        migrations.AlterField(
            model_name='competitor',
            name='min2',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), blank=True, null=True, size=9, verbose_name='minuto 2'),
        ),
        migrations.AlterField(
            model_name='competitor',
            name='random_score',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), blank=True, null=True, size=11, verbose_name='Random Mode'),
        ),
        migrations.AlterField(
            model_name='competitor',
            name='replica',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), blank=True, null=True, size=9, verbose_name='Replica'),
        ),
        migrations.AlterField(
            model_name='competitor',
            name='tematicas_1',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), blank=True, null=True, size=7, verbose_name='Tematicas 1'),
        ),
        migrations.AlterField(
            model_name='competitor',
            name='tematicas_2',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), blank=True, null=True, size=7, verbose_name='Tematicas 2'),
        ),
    ]
