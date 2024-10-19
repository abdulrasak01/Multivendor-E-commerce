# Generated by Django 5.0.7 on 2024-10-19 13:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0011_alter_product_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='image',
            field=models.ImageField(null=True, upload_to='product_imgs/'),
        ),
        migrations.AddField(
            model_name='product',
            name='tags',
            field=models.TextField(null=True),
        ),
    ]