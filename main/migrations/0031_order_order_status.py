# Generated by Django 5.0.7 on 2025-01-30 03:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0030_remove_order_price_remove_order_qty_orderitems_price_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='order_status',
            field=models.BooleanField(default=False),
        ),
    ]
