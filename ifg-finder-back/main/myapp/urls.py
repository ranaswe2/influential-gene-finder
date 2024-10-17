
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from myapp import views
from rest_framework.routers import DefaultRouter
from .views import DatasetUploadView, DatasetViewSet, DatasetListView, SignupAPIView, VerifyOTPAPIView, LoginAPIView, LogoutAPIView, UpdateAPIView, GetUserAPIView
from .views import InfluentialGeneAPIView, DrugCandidateAPIView, UserFileInfoView, NewOtpAPIView, ResetPasswordAPIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


# Initialize the default router for the DatasetViewSet
router = DefaultRouter()
router.register(r'dataset', DatasetViewSet, basename='dataset')



urlpatterns = [
    path('api/user/signup/', SignupAPIView.as_view(), name='signup'),
    path('api/user/verifyotp/', VerifyOTPAPIView.as_view(), name='verify_otp'),
    path('api/user/login/', LoginAPIView.as_view(), name='login'),
    path('api/user/logout/', LogoutAPIView.as_view(), name='logout'),
    path('api/user/info/', GetUserAPIView.as_view(), name='get-user'),
    path('api/user/update/', UpdateAPIView.as_view(), name= 'update'),
    path('api/user/resetotp/', NewOtpAPIView.as_view(), name= 'otp'),
    path('api/user/reset-pass/', ResetPasswordAPIView.as_view(), name='reset-password'),
    
    # For uploading and preprocessing a dataset
    path('api/dataset/upload/', DatasetUploadView.as_view(), name='dataset-upload'),
    path('api/dataset/', DatasetListView.as_view(), name='dataset-list'),


    path('api/ifg/find/', InfluentialGeneAPIView.as_view(), name='ifg-find'),

    path('api/drug/find/', DrugCandidateAPIView.as_view(), name='drug-find'),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/user/history/', UserFileInfoView.as_view(), name='user-files'),

    # Include all CRUD routes for DatasetViewSet (list, retrieve, update, delete)
    path('api/', include(router.urls)),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)