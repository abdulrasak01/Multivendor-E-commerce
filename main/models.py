from django.db import models
from django.contrib.auth.models import User

# Vendor models
class Vendor(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    address = models.TextField(null = True)
    
    def __str__(self):
        return self.user.username
     
#Product category model
class productCategory(models.Model):
    title = models.CharField(max_length=200)
    detail = models.TextField(null=True)
    
    def __str__(self):
        return self.title
    
#Product model
class Product(models.Model):
    category = models.ForeignKey(productCategory, on_delete=models.SET_NULL, null=True, related_name='category_products')
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200)
    slug = models.CharField(max_length=300, unique=True, null=True) 
    detail = models.TextField(null=True)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    tags=models.TextField(null=True)
    image = models.ImageField(upload_to='product_imgs/', null=True, blank=True)
    demo_url = models.URLField(blank=True, null=True)
    product_file = models.FileField(upload_to='product_files/',null=True, blank=True)
    downloads = models.IntegerField(default=0,null=True)
    usd_price = models.DecimalField(max_digits=10, decimal_places=2,default=80)
    def __str__(self):
        return self.title
    
    def tag_list(self):
        if(self.tags):
            tagList=self.tags.split(',')
            return(tagList)
        return
    
    # def calculated_usd_price(self):
    #     if self.price and self.usd_price:
    #         return self.price / self.usd_price
    #     return 0
    
    
#customer model
class Customer(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    mobile = models.PositiveBigIntegerField(null=True)
    profile_img = models.ImageField(upload_to='customer_imgs/', null=True)
    
    def __str__(self):
        return self.user.username
    
#order model
class Order(models.Model):
    customer = models.ForeignKey(Customer,on_delete=models.CASCADE,related_name='order_items')
    order_time = models.DateTimeField(auto_now_add=True)
    order_status = models.BooleanField(default=False)
    
    def __str__(self):
        return '%s' % self.order_time
    
   
class OrderItems(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE,related_name='order_items')
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    qty = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=20, decimal_places=2,default=0)
    
    def __str__(self):
        return self.product.title


# customer address model
class  CustomerAddress(models.Model):
    customer = models.ForeignKey(Customer,on_delete=models.CASCADE,related_name='customer_addresses')
    address=models.TextField()
    default_address = models.BooleanField(default=False)
    
    def __str__(self):
        return self.address
    
# product ratings
class ProductRating(models.Model):
     customer = models.ForeignKey(Customer,on_delete=models.CASCADE)
     product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name='product_ratings')
     rating=models.IntegerField()
     reviews=models.TextField()
     add_time=models.DateTimeField(auto_now_add=True)
     def __str__(self):
        return f'{self.rating} - {self.reviews}'
    
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_imgs')
    image = models.ImageField(upload_to='product_imgs/',null=True)
    
    def __str__(self):
        return self.image.url
    
class CustomUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    mobile = models.CharField(max_length=10, null=True)
    
    
    
# class Student(models.Model):
#     name = models.CharField(max_length=20, null= True)
    
#     def __str__(self):
#         return self.name
# class Address(models.Model):
#     student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
#     door = models.IntegerField(null= True)
#     address = models.CharField(max_length=100, null=True)
    
    def __str__(self):
        return self.door
    
    
class WishList(models.Model):
    Product = models.ForeignKey(Product,on_delete=models.CASCADE)
    Customer=models.ForeignKey(Customer,on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.Product.title} - {self.Customer.user.first_name}'
    