# Generated by Django 5.0.7 on 2025-03-09 07:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0040_wishlist'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Address',
        ),
        migrations.DeleteModel(
            name='Student',
        ),
    ]
