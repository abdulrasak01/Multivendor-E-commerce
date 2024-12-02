"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
    
    http http://localhost:8000/api/vendors/ "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyNTE5NTAyLCJpYXQiOjE3MzI1MTkyMDIsImp0aSI6IjE4MTcxOGY4OTU1MTQ3ZGFhMTQ3ZjNkNDczYjliZjg5IiwidXNlcl9pZCI6MjF9.VjZ1qwN3WYKLWWRusDq1MH7bZAkC2lHHdOdQxMmJV3w"
    
    http http://localhost:8000/api/token/refresh/ refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczMjYwNTYwMiwiaWF0IjoxNzMyNTE5MjAyLCJqdGkiOiI4ZDQ0NjRmZTJjNTM0M2M5ODU1MWI2MDZlM2I4M2U5NSIsInVzZXJfaWQiOjIxfQ.no-OTvNspw69gOl8l46cnWCvkKj0GuU2wJYhffFnx4Q
"""
from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('main.urls')),
    path('api/token/',jwt_views.TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('api/token/refresh/',jwt_views.TokenRefreshView.as_view(),name='token_refresh'),
    path('api-auth/',include('rest_framework.urls')),
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
