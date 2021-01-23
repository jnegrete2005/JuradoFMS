# Generated by Django 3.1.5 on 2021-01-23 19:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vote', '0002_auto_20210122_1829'),
    ]

    operations = [
        migrations.RenameField(
            model_name='competitor',
            old_name='minuto1',
            new_name='min1',
        ),
        migrations.RenameField(
            model_name='competitor',
            old_name='minuto2',
            new_name='min2',
        ),
        migrations.AlterField(
            model_name='competitor',
            name='random_mode',
            field=models.IntegerField(blank=True, choices=[(0, 'Personajes contrapuestos'), (1, 'Objetos'), (2, 'Imágenes vaiadas'), (3, 'Terminaciones'), (4, 'Temática de actualidad')], default=0, null=True),
        ),
    ]
