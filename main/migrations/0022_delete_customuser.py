# Generated by Django 5.0.7 on 2024-10-21 14:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0021_customuser'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CustomUser',
        ),
    ]