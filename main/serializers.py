from rest_framework import serializers
from . import models
from django.contrib.auth.models import User

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Vendor
        fields=['id','user','address']
        
    def __init__(self, *args, **kwargs):
        super(VendorSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1
        
class VendorDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Vendor
        fields=['id','user','address']
        
    def __init__(self, *args, **kwargs):
        super(VendorDetailSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1
        
        
class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields=['id','category','vendor','title','slug','detail','price','product_imgs']
        
    def __init__(self, *args, **kwargs):
        super(ProductListSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1
        
        
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductImage
        fields = ['id','product','image']
        
class ProductDetailSerializer(serializers.ModelSerializer):
    product_ratings = serializers.StringRelatedField(many=True,read_only=True)
    product_imgs = ProductImageSerializer(many=True, read_only = True)
    class Meta:
        model = models.Product
        fields=['id','category','vendor','title','slug','tag_list','detail','price','product_ratings','product_imgs']
        
    def __init__(self, *args, **kwargs):
        super(ProductDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1
        
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Customer
        fields=['id','user','mobile']
        
    def __init__(self, *args, **kwargs):
        super(CustomerSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1
        
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields=['id','customer']
        
    def __init__(self, *args, **kwargs):
        super(OrderSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1
    
    
class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderItems
        fields=['id','order','product']
        
    def __init__(self, *args, **kwargs):
        super(OrderDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1
       
class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomerAddress
        fields=['id','order','address']
        
    def __init__(self, *args, **kwargs):
        super(CustomerAddressSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1
        
class ProductRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductRating
        fields=['id','customer','product','rating','reviews','add_time']
        
    def __init__(self, *args, **kwargs):
        super(ProductRatingSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1
         

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.productCategory
        fields=['id','title','detail']
        
    def __init__(self, *args, **kwargs):
        super(CategorySerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1
        
class CategoryDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.productCategory
        fields=['id','title','detail']
        
    def __init__(self, *args, **kwargs):
        super(CategoryDetailSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1
        
class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id','username','password', 'email']