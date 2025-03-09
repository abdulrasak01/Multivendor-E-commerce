from rest_framework import serializers
from . import models
from django.contrib.auth.models import User
from django.conf import settings

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
    image = serializers.SerializerMethodField()  # Use a method to get the full URL for the image
    
    class Meta:
        model = models.Product
        fields = ['id', 'category', 'vendor', 'title', 'slug', 'detail', 'price', 'usd_price', 'image', 'product_imgs'] 

    def get_image(self, obj):
        request = self.context.get('request')  # Get the request context
        if obj.image:
            return request.build_absolute_uri(obj.image.url)  # Full URL for the image
        return None
    
    def __init__(self, *args, **kwargs):
        super(ProductListSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 2
    
    
        
        
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductImage
        fields = ['id','product','image']
        
class ProductDetailSerializer(serializers.ModelSerializer):
    product_ratings = serializers.StringRelatedField(many=True,read_only=True)
    product_imgs = ProductImageSerializer(many=True, read_only = True)
    class Meta:
        model = models.Product
        fields=['id','category','vendor','title','slug','tag_list','detail','price','usd_price','demo_url','product_file','product_ratings','product_imgs', 'downloads']
        
    def __init__(self, *args, **kwargs):
        super(ProductDetailSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1
        
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Customer
        fields=['id','user','mobile','profile_img']
        
    def __init__(self, *args, **kwargs):
        super(CustomerSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1
        
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields=['id','customer','order_status']
        
        
class OrderItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderItems
        fields=['id','order','product','qty','price']
        
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['order'] = OrderDetailSerializer(instance.order).data
        response['product'] = ProductDetailSerializer(instance.product).data
        return response
        
        
class CustomerOrderItemsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderItems
        fields = ['id', 'order', 'product', 'qty', 'price']
        depth = 1 

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs) 

        
    
    
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
        fields = ['id', 'address', 'default_address', 'customer']

    def validate_customer(self, value):
        if not value:
            raise serializers.ValidationError("Customer is required")
        return value
        
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
        fields=['id','title','detail','image']
        
    def __init__(self, *args, **kwargs):
        super(CategorySerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1
        
class CategoryDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.productCategory
        fields=['id','title','detail','image']
        
    def __init__(self, *args, **kwargs):
        super(CategoryDetailSerializer, self).__init__(*args, **kwargs)
        # self.Meta.depth = 1
        
class UserSerializer(serializers.ModelSerializer):
    mobile = serializers.CharField(max_length=15, required=False)
    class Meta(object):
        model = User
        fields = ['id','username','password','email','mobile']
        
        
# class AddressSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.Address
#         fields = ['address','door']
        
# class StudentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.Student
#         fields = ['id','name']
        
#     def __init__(self, *args, **kwargs):
#         super(StudentSerializer, self).__init__(*args, **kwargs)
#         self.Meta.depth = 1
        
class WishListSerializer(serializers.ModelSerializer):
    Product = ProductListSerializer()  # Nest ProductSerializer
   # Customer = CustomerSerializer()  # Nest CustomerSerializer

    class Meta:
        model = models.WishList
        fields = ['id', 'Product', 'Customer']
        
class PopularProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = models.Product
        fields = ['id', 'title', 'slug', 'detail', 'price', 'tags', 'image', 'demo_url', 'downloads', 'usd_price']
        
    # def get_image(self, obj):
    #     request = self.context.get('request')  # Get the request context
    #     print(f"REQUEST: {request}")
    #     if obj.image:
    #         print(f"Image URL: {obj.image.url}")  # Log the URL
    #         if request:
    #             return request.build_absolute_uri(obj.image.url)  # Full URL for the image
    #     return None
    
    def get_image(self, obj):
        request = self.context.get('request')  # Get the request context from the serializer context
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)  # Build absolute URL if request is available
        return None

        
        
        
        