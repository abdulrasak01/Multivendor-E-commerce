from django.shortcuts import render
from rest_framework import generics,pagination,viewsets
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import authenticate
import json

from . import models
from . import serializers
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
class VendorList(generics.ListCreateAPIView):
    queryset = models.Vendor.objects.all()
    serializer_class = serializers.VendorSerializer
    
class VendorDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Vendor.objects.all()
    serializer_class = serializers.VendorDetailSerializer
    
    
# @authentication_classes([SessionAuthentication,TokenAuthentication])
# @permission_classes([IsAuthenticated])
class ProductList(generics.ListCreateAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductListSerializer
    pagination_class = pagination.PageNumberPagination
    
    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.GET['category']
        category=models.productCategory.objects.get(id=category)
        qs=qs.filter(category=category)
        return qs
    
    
class TagProductList(generics.ListCreateAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductListSerializer
    pagination_class = pagination.PageNumberPagination
    
    def get_queryset(self):
        qs = super().get_queryset()
        tag=self.kwargs['tag']
        qs=qs.filter(tags=tag)
        return qs
    
class RelatedProductList(generics.ListCreateAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductListSerializer
    pagination_class = pagination.PageNumberPagination
    
    def get_queryset(self):
        qs = super().get_queryset()
        product_id=self.kwargs['pk']
        product = models.Product.objects.get(id=product_id)
        qs=qs.filter(category=product.category).exclude(id=product_id)
        return qs
    
class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductDetailSerializer
    pagination_class=pagination.PageNumberPagination
    
class CustomerList(generics.ListCreateAPIView):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer
    
class CustomerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer
    
class OrderList(generics.ListCreateAPIView):
    queryset = models.Order.objects.all()
    serializer_class = serializers.OrderSerializer
    
class OrderDetail(generics.ListAPIView):
    serializer_class = serializers.OrderDetailSerializer
    
    def get_queryset(self):
        order_id = self.kwargs['pk']
        order = models.Order.objects.get(id=order_id)
        order_items = models.OrderItems.objects.filter(order=order)
        return order_items
        
        
class CustomerAddressViewSet(viewsets.ModelViewSet):
    serializer_class=serializers.CustomerAddressSerializer
    queryset = models.CustomerAddress.objects.all()
    
class ProductRatingViewSet(viewsets.ModelViewSet):
    serializer_class= serializers.ProductRatingSerializer
    queryset = models.ProductRating.objects.all()
    
    
#product category
class CategoryList(generics.ListCreateAPIView):
    queryset= models.productCategory.objects.all()
    serializer_class=serializers.CategorySerializer
    
class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset= models.productCategory.objects.all()
    serializer_class=serializers.CategoryDetailSerializer
    
    
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def customer_login(request):
    # For API, assuming JSON input, parse the body as JSON
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            print("password------------>",password)
            print("user------------>",username)   

            # Ensure the username and password are not None or empty
            if not username or not password:
                return JsonResponse({'bool': False, 'msg': "Username and password are required"})

            user = authenticate(username=username, password=password)

            if user is not None:
                return JsonResponse({
                    'bool': True,
                    'user': user.username
                })
            else:
                return JsonResponse({
                    'bool': False,
                    'msg': "Invalid username or password"
                })

        except Exception as e:
            return JsonResponse({'bool': False, 'msg': str(e)})
    else:
        return JsonResponse({'bool': False, 'msg': "Only POST method is allowed"})
    
    
@csrf_exempt
def customer_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')
            mobile = data.get('mobile')
            print("password------------>",password)
            print("user------------>",username)   
            
            user = User.objects.create(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
            )
            if user:
                password_hash = make_password(password)
                user.set_password(password_hash)
                customer = models.Customer.objects.create(
                    user = user,
                    mobile = mobile
                )
                return JsonResponse({
                    'bool': True,
                    'user' : user.id,
                    'customer': customer.id,
                    'msg' : "User registered successfully! You can login now."
                })
            else:
                return JsonResponse({
                    'bool': False,
                    'msg': "Oops! Something went wrong"
                })

        except IntegrityError:
            return JsonResponse({'bool': False, 'msg': "Mobile already exists!"})
    else:
        return JsonResponse({'bool': False, 'msg': "Only POST method is allowed"})

        
    
    

    

