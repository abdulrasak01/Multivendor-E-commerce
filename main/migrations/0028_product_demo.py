# Generated by Django 5.0.7 on 2024-11-23 07:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0027_remove_student_address_address_student'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='demo',
            field=models.URLField(blank=True, null=True),
        ),
    ]
