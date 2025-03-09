from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.Vendor)
# admin.site.register(models.Product)
admin.site.register(models.productCategory)
admin.site.register(models.Customer)
admin.site.register(models.OrderItems)
admin.site.register(models.CustomerAddress)
admin.site.register(models.ProductRating)

# admin.site.register(models.Student)
# admin.site.register(models.Address)
#Product image

admin.site.register(models.ProductImage)

class ProductImageInline(admin.StackedInline):
    model = models.ProductImage
    
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title','price','usd_price','downloads']
    list_editable=['usd_price']
    prepopulated_fields = {"slug": ("title",)}
    inlines = [
         ProductImageInline,
    ]
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id','customer','order_time','order_status']
    
class WishListAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_customer', 'get_product']

    def get_customer(self, obj):
        return obj.Customer.user.first_name  # Assuming you want the first name of the user
    get_customer.short_description = 'Customer'  # Optional, customize the column name in admin

    def get_product(self, obj):
        return obj.Product.title  # Assuming you want the title of the product
    get_product.short_description = 'Product'  # Optional, customize the column name in admin

# Register the admin
admin.site.register(models.WishList, WishListAdmin)

admin.site.register(models.Product,ProductAdmin)
admin.site.register(models.Order,OrderAdmin)
