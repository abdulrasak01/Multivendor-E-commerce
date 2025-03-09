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
from rest_framework.decorators import api_view

from . import models
from . import serializers
from django.contrib.auth.models import User
from django.db import IntegrityError

from django.contrib.auth import get_user_model
from django.contrib.auth import password_validation

from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404




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
    

class CustomerOrderItemsList(generics.ListCreateAPIView):
    serializer_class = serializers.CustomerOrderItemsListSerializer  

    def get_queryset(self):
        customer_id = self.kwargs['pk']
        return models.OrderItems.objects.filter(order__customer__id=customer_id)




class OrderDetail(generics.ListAPIView):
    serializer_class = serializers.OrderDetailSerializer

    def get_queryset(self):
        order_id = self.kwargs['pk']
        order = models.Order.objects.get(id=order_id)
        order_items = models.OrderItems.objects.filter(order=order)
        return order_items



# @api_view(['GET'])
# def get_addresses_for_customer(request, customer_id):
#     """
#     Retrieve the list of addresses for a specific customer.
#     """
#     # Get the customer instance or return a 404 error if not found
#     customer = get_object_or_404(models.Customer, id=customer_id)
    
#     # Filter the addresses for the given customer
#     addresses = models.CustomerAddress.objects.filter(customer=customer)
    
#     # Serialize the address data
#     serializer = serializers.CustomerAddressSerializer(addresses, many=True)
    
#     return Response(serializer.data)

@api_view(['GET'])
def customer_address_list(request, customer_id):
    """
    List the addresses for a specific customer.
    """
    # Get the customer instance or return a 404 error if not found
    customer = get_object_or_404(models.Customer, id=customer_id)

    # Filter the queryset based on customer_id
    addresses = models.CustomerAddress.objects.filter(customer=customer).order_by('-default_address')
    
    # Serialize the address data
    serializer = serializers.CustomerAddressSerializer(addresses, many=True)
    
    return Response(serializer.data)

@api_view(['POST'])
def create_customer_address(request, customer_id):
    """
    Create a new address for a specific customer, with an option to set it as the default address.
    """
    # Ensure the customer exists
    customer = get_object_or_404(models.Customer, id=customer_id)

    # Check if the request data contains the default_address flag
    default_address = request.data.get('default_address', False)

    # The serializer will validate and create the CustomerAddress object
    serializer = serializers.CustomerAddressSerializer(data=request.data)

    if serializer.is_valid():
        # If it's the default address, ensure only one address per customer can be marked as default
        if default_address:
            # Set all other addresses to non-default for this customer
            models.CustomerAddress.objects.filter(customer=customer).update(default_address=False)

        # Save the new address and associate it with the customer
        address = serializer.save(customer=customer, default_address=default_address)
        
        # Respond with the created address data (serialized)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        # Return validation errors if the data is not valid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PATCH'])
def set_default_address(request, address_id):
    """
    Set the specified address as the default address for the customer.
    """
    customer_id = request.data.get('customer')
    if not customer_id:
        return Response({"error": "Customer ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Get the customer and the address
    customer = get_object_or_404(models.Customer, id=customer_id)
    address = get_object_or_404(models.CustomerAddress, id=address_id, customer=customer)

    # Start a database transaction to ensure data consistency
    try:
        # Update all other addresses for this customer to have default_address = False
        models.CustomerAddress.objects.filter(customer=customer).update(default_address=False)

        # Set the selected address as the default
        address.default_address = True
        address.save()

        # Serialize the updated address
        serializer = serializers.CustomerAddressSerializer(address)

        # Return the updated address information
        return Response({
            "message": "Address successfully set as default.",
            "address": serializer.data  # Use the serialized data here
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
def update_order_status(request,order_id):
    if request.method == 'POST':
        updateRes = models.Order.objects.filter(id=order_id).update(order_status=True)
        msg={
            'bool': False,
        }
        if updateRes:
            msg={
                'bool' : True
            }
    return JsonResponse(msg)


@csrf_exempt
def update_product_download_count(request, product_id):
    if request.method == 'POST':
        try:
            # Retrieve the product using product_id
            product = models.Product.objects.get(id=product_id)
            
            # Increment download count
            product.downloads += 1
            
            # Save the updated product
            product.save()

            # Return success response
            return JsonResponse({'bool': True})
        except models.Product.DoesNotExist:
            # If the product doesn't exist, return an error response
            return JsonResponse({'bool': False, 'error': f'Product with ID {product_id} not found'})
    else:
        # Return error if the method is not POST
        return JsonResponse({'bool': False, 'error': 'Invalid request method'})



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
        
from django.http import JsonResponse
from . import models
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def check_in_wishlist(request):
    if request.method == 'POST':
        # Get product_id and customer_id from the request data
        data = json.loads(request.body)
        product_id = data.get('product_id')  # Ensure the key matches the request payload
        customer_id = data.get('customer')  # Ensure the key matches the request payload
        
        # Check if product_id and customer_id are provided
        if not product_id or not customer_id:
            return JsonResponse({'bool': False, 'msg': 'Product ID and Customer ID are required.'}, status=400)

        # Check if the product exists in the customer's wishlist
        check_wishlist = models.WishList.objects.filter(Product_id=product_id, Customer_id=customer_id).exists()
        
        # Return a response based on the existence of the wishlist item
        if check_wishlist:
            return JsonResponse({'bool': True})
        return JsonResponse({'bool': False})
    
    
@csrf_exempt
def add_to_wishlist(request):
    if request.method == 'POST':
        # Get the product_id and customer_id from the request body
        data = json.loads(request.body)
        product_id = data.get('product_id')  # Ensure the key matches the request payload
        customer_id = data.get('customer')  # Ensure the key matches the request payload
        
        # Check if product_id and customer_id are provided
        if not product_id or not customer_id:
            return JsonResponse({'bool': False, 'msg': 'Product ID and Customer ID are required.'}, status=400)
        
        # Check if the product already exists in the wishlist for the customer
        existing_wishlist_item = models.WishList.objects.filter(Product_id=product_id, Customer_id=customer_id)
        
        if existing_wishlist_item.exists():
            return JsonResponse({'bool': False, 'msg': 'Product already in wishlist.'})

        # Add the product to the wishlist
        try:
            wishlist_item = models.WishList.objects.create(Product_id=product_id, Customer_id=customer_id)
            return JsonResponse({'bool': True, 'msg': 'Product added to wishlist successfully!'})
        except Exception as e:
            return JsonResponse({'bool': False, 'msg': str(e)})

    return JsonResponse({'bool': False, 'msg': 'Only POST method is allowed'})



@csrf_exempt
def customer_dashboard(request, pk):
    totalAddress = models.CustomerAddress.objects.filter(customer__user__id=pk).count()
    totalOrders = models.Order.objects.filter(customer__user__id=pk).count()
    totalWishList = models.WishList.objects.filter(Customer__user__id=pk).count()
    msg = {
        'totalAddress': totalAddress,
        'totalOrders' : totalOrders,
        'totalWishList': totalWishList,
    }
    
    return JsonResponse(msg)

@api_view(['GET'])
def get_all_wishlist(request, pk):
    if request.method == 'GET':
        wishList = models.WishList.objects.filter(Customer__user__id=pk)
        serializer = serializers.WishListSerializer(wishList, many=True, context={'request': request})  # Pass the request context
        return Response(serializer.data)
    

@csrf_exempt
def remove_from_wishlist(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        product_id = data.get('product_id')
        customer_id = data.get('customer')
        
        # Ensure both product_id and customer_id are provided
        if not product_id or not customer_id:
            return JsonResponse({'bool': False, 'msg': 'Product ID and Customer ID are required.'}, status=400)

        # Check if the item exists in the wishlist
        wishlist_item = models.WishList.objects.filter(Product_id=product_id, Customer_id=customer_id)

        if not wishlist_item.exists():
            return JsonResponse({'bool': False, 'msg': 'Item not found in wishlist.'})

        # Remove the item from the wishlist
        try:
            wishlist_item.delete()
            return JsonResponse({'bool': True, 'msg': 'Product removed from wishlist successfully!'})
        except Exception as e:
            return JsonResponse({'bool': False, 'msg': str(e)})

    return JsonResponse({'bool': False, 'msg': 'Only POST method is allowed'})



