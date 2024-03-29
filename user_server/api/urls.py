from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from user_server.api.views import logout

urlpatterns = [
    path("login/",obtain_auth_token,name="login"),
    path("logout/",logout,name="logout"),
]
