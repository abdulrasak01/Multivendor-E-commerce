from django.urls import path,re_path
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('address',views.CustomerAddressViewSet)
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
    path('customer/login/',views.customer_login,name='customer_login'),
    path('customer/register/',views.customer_register,name='customer_register'),
    path('customer/update-password/',views.update_password,name='update_password'),
    path('customer/forgot-password/',views.forgot_password,name='forgot_password'),
    path('reset-password/<str:uidb64>/<str:token>/', views.reset_password, name='reset_password'),
]

urlpatterns+=router.urls

