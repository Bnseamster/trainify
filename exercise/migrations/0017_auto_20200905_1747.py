# Generated by Django 3.0.8 on 2020-09-06 00:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exercise', '0016_auto_20200905_1738'),
    ]

    operations = [
        migrations.AlterField(
            model_name='muscle',
            name='muscleGroup',
            field=models.CharField(blank='True', max_length=50),
        ),
    ]
