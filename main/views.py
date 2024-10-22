from django.shortcuts import render
from rest_framework import generics,pagination,viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . import models
from . import serializers
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

class VendorList(generics.ListCreateAPIView):
    queryset = models.Vendor.objects.all()
    serializer_class = serializers.VendorSerializer
    
class VendorDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Vendor.objects.all()
    serializer_class = serializers.VendorDetailSerializer
    
class ProductList(generics.ListCreateAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductListSerializer
    pagination_class = pagination.PageNumberPagination
    
    # def get_queryset(self):
    #     qs = super().get_queryset()
    #     category = self.request.GET['category']
    #     category=models.productCategory.objects.get(id=category)
    #     qs=qs.filter(category=category)
    #     return qs
    
    
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
    
@api_view(['POST'])
def signup(request):
    serializer = serializers.UserSerializer
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({"token":token.key,"user":serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    return Response({})

@api_view(['POST'])
def test_token(request):
    return Response({})
    
    

    

