from django.urls import path,re_path
from . import views
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register('product-rating',views.ProductRatingViewSet)


urlpatterns = [
    path('vendors/', views.VendorList.as_view() ),
    path('products/', views.ProductList.as_view() ),
    path('product/<int:pk>/',views.ProductDetail.as_view()),
    path('related-products/<int:pk>/',views.RelatedProductList.as_view()),
    path('products/<str:tag>/',views.TagProductList.as_view()),
    path('categories/', views.CategoryList.as_view() ),
    path('category/<int:pk>/',views.CategoryDetail.as_view()),
    path('vendor/<int:pk>/', views.VendorDetail.as_view()),
    path('customers',views.CustomerList.as_view()),
    path('customer/<int:pk>/',views.CustomerDetail.as_view()),
    path('orders/',views.OrderList.as_view()),
    path('order-detail/<int:pk>/',views.OrderDetail.as_view()),
    path('order-items/',views.OrderItemList.as_view()),
    # path('customer-address-list/<int:pk>/',views.CustomerAddressList.as_view()),
    path('customer/login/',views.customer_login,name='customer_login'),
    path('customer/register/',views.customer_register,name='customer_register'),
    path('customer/update-password/',views.update_password,name='update_password'),
    path('customer/forgot-password/',views.forgot_password,name='forgot_password'),
    path('reset-password/<str:uidb64>/<str:token>/', views.reset_password, name='reset_password'),
    path('customer/<int:pk>/order-items/', views.CustomerOrderItemsList.as_view(), name='customer_orders_list'),
    path('update-order-status/<int:order_id>/',views.update_order_status, name='update_order_status'),
    path('update-product-download-count/<int:product_id>/',views.update_product_download_count, name='update-product-download-count'),
    path('wishlist-check/', views.check_in_wishlist, name='check_in_wishlist'),
    path('add-to-wishlist/', views.add_to_wishlist, name='add_to_wishlist'),
    path('get-all-wishlist/<int:pk>/', views.get_all_wishlist, name='get_all_wishlist'),
    path('customer-dashboard/<int:pk>/', views.customer_dashboard, name='customer_dashboard'),
    path('remove-wishlist/', views.remove_from_wishlist, name='remove_from_wishlist'),
    path('addresses/<int:customer_id>/', views.customer_address_list, name='customer_address_list'),
    path('address/<int:customer_id>/create/', views.create_customer_address, name='create_customer_address'),
    path('addresses/<int:address_id>/update/', views.set_default_address, name='set_default_address'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

