from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import ProductoViewSet, OrdenViewSet, ProductoList

from django.conf import settings
from django.conf.urls.static import static

from productos.views import pago_exitoso #iniciar_pago, 

router = DefaultRouter()
router.register('productos', ProductoViewSet)
router.register('ordenes', OrdenViewSet)

urlpatterns = [

    
    path('', include(router.urls)),
    path('productos/', ProductoList.as_view(), name='producto-list'),
 #   path('iniciar-pago/', iniciar_pago, name='iniciar-pago'),
#path('webpay/respuesta/', webpay_respuesta, name='webpay-respuesta'),
    path("pago_exitoso/", pago_exitoso, name="pago_exitoso"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
