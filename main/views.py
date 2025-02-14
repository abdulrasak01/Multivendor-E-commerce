from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.core.mail import send_mail
from django.shortcuts import render
from rest_framework import generics, pagination, viewsets
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import authenticate
import json

from . import models
from . import serializers
from django.contrib.auth.models import User
from django.db import IntegrityError

from django.contrib.auth import get_user_model
from django.contrib.auth import password_validation


class VendorList(generics.ListCreateAPIView):
    queryset = models.Vendor.objects.all()
    serializer_class = serializers.VendorSerializer


class VendorDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Vendor.objects.all()
    serializer_class = serializers.VendorDetailSerializer


class ProductList(generics.ListCreateAPIView):
    queryset = models.Product.objects.all().order_by('id')
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
        tag = self.kwargs['tag']
        qs = qs.filter(tags=tag)
        return qs


class RelatedProductList(generics.ListCreateAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductListSerializer
    pagination_class = pagination.PageNumberPagination

    def get_queryset(self):
        qs = super().get_queryset()
        product_id = self.kwargs['pk']
        product = models.Product.objects.get(id=product_id)
        qs = qs.filter(category=product.category).exclude(id=product_id)
        return qs


class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductDetailSerializer
    pagination_class = pagination.PageNumberPagination


class CustomerList(generics.ListCreateAPIView):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer


class CustomerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer


class OrderList(generics.ListCreateAPIView):
    queryset = models.Order.objects.all()
    serializer_class = serializers.OrderSerializer


class OrderItemList(generics.ListCreateAPIView):
    queryset = models.OrderItems.objects.all()
    serializer_class = serializers.OrderItemsSerializer


class OrderDetail(generics.ListAPIView):
    serializer_class = serializers.OrderDetailSerializer

    def get_queryset(self):
        order_id = self.kwargs['pk']
        order = models.Order.objects.get(id=order_id)
        order_items = models.OrderItems.objects.filter(order=order)
        return order_items


class CustomerAddressViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CustomerAddressSerializer
    queryset = models.CustomerAddress.objects.all()


class ProductRatingViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ProductRatingSerializer
    queryset = models.ProductRating.objects.all()


# product category
class CategoryList(generics.ListCreateAPIView):
    queryset = models.productCategory.objects.all()
    serializer_class = serializers.CategorySerializer


class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.productCategory.objects.all()
    serializer_class = serializers.CategoryDetailSerializer


@csrf_exempt
def customer_login(request):
    # For API, assuming JSON input, parse the body as JSON
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            # Ensure the username and password are not None or empty
            if not username or not password:
                return JsonResponse({'bool': False, 'msg': "Username and password are required"})

            user = authenticate(username=username, password=password)

            if user is not None:
                print("user------------->", user)
                customer = models.Customer.objects.get(user=user)
                print("customer------------->", customer)
                return JsonResponse({
                    'bool': True,
                    'user': user.username,
                    'id': customer.id
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
            print("password------------>", password)
            print("user------------>", username)

            # Create the user first
            user = User.objects.create(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
            )

            # Set the password using set_password (Django handles hashing automatically)
            user.set_password(password)
            user.save()

            print("User------------>", user)

            # Create the customer related to the user
            customer = models.Customer.objects.create(
                user=user,
                mobile=mobile
            )

            return JsonResponse({
                'bool': True,
                'user': user.id,
                'customer': customer.id,
                'msg': "User registered successfully! You can login now."
            })
        except IntegrityError:
            return JsonResponse({'bool': False, 'msg': "Mobile already exists!"})
    else:
        return JsonResponse({'bool': False, 'msg': "Only POST method is allowed"})


@csrf_exempt
def update_password(request):
    # Ensure the request is a POST request
    if request.method == 'POST':
        try:
            # Parse the incoming data
            data = json.loads(request.body)
            username = data.get('username')
            current_password = data.get('current_password')
            new_password = data.get('new_password')

            # Ensure all required fields are provided
            if not username or not current_password or not new_password:
                return JsonResponse({'bool': False, 'msg': "Username, current password, and new password are required."})

            # Authenticate the user with their current password
            user = authenticate(username=username, password=current_password)

            print("password------------>", current_password)
            print("user------------>", username)

            if user is not None:
                # Ensure the new password is different from the current password
                if current_password == new_password:
                    return JsonResponse({'bool': False, 'msg': "New password must be different from the current password."})

                # Set the new password and save the user
                # This automatically hashes the new password
                user.set_password(new_password)
                user.save()

                return JsonResponse({
                    'bool': True,
                    'msg': "Password updated successfully!"
                })
            else:
                return JsonResponse({
                    'bool': False,
                    'msg': "Invalid username or current password"
                })

        except Exception as e:
            return JsonResponse({'bool': False, 'msg': str(e)})
    else:
        return JsonResponse({'bool': False, 'msg': "Only POST method is allowed"})


@csrf_exempt
def forgot_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')

            # Ensure the email is provided
            if not email:
                return JsonResponse({'bool': False, 'msg': "Email is required."})

            # Check if the user exists with the provided email
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({'bool': False, 'msg': "No account associated with this email."})

            # Generate a password reset token
            token = default_token_generator.make_token(user)

            # Encode the user ID as string and then to base64
            uid = urlsafe_base64_encode(str(user.id).encode('utf-8'))

            # Create the password reset URL
            reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

            # Send email with the reset link
            subject = "Password Reset Request"
            message = f"Hi {user.username},\n\nTo reset your password, click the link below:\n\n{reset_url}\n\nIf you didn't request this, please ignore this email."
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])

            return JsonResponse({
                'bool': True,
                'msg': "Password reset email sent successfully!"
            })

        except Exception as e:
            print(f"Error during forgot password: {e}")
            return JsonResponse({'bool': False, 'msg': str(e)})

    else:
        return JsonResponse({'bool': False, 'msg': "Only POST method is allowed"})


@csrf_exempt
def reset_password(request, uidb64, token):
    if request.method == 'POST':
        try:
            # Decode user ID
            uid = urlsafe_base64_decode(uidb64).decode('utf-8')
            user = get_user_model().objects.get(id=uid)
            # Validate the token
            if not default_token_generator.check_token(user, token):
                return JsonResponse({'bool': False, 'msg': "Invalid or expired token."})

            # Parse the new password from the request
            data = json.loads(request.body)
            new_password = data.get('new_password')

            if not new_password:
                return JsonResponse({'bool': False, 'msg': "New password is required."})

            # Optionally, validate the new password using Django's built-in validators
            password_validation.validate_password(new_password, user)

            # Set the new password
            user.set_password(new_password)
            user.save()

            return JsonResponse({'bool': True, 'msg': "Password reset successfully."})

        except Exception as e:
            print(f"Error during password reset: {e}")
            return JsonResponse({'bool': False, 'msg': str(e)})

