# Generated by Django 5.0.7 on 2025-03-04 07:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0037_product_usd_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='profile_img',
            field=models.ImageField(null=True, upload_to='customer_imgs/'),
        ),
    ]
