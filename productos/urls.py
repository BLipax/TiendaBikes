from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, OrdenViewSet, ProductoList
from .views import iniciar_pago, actualizar_stock, pago_exitoso, webpay_respuesta
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register('productos', ProductoViewSet)
router.register('ordenes', OrdenViewSet)

urlpatterns = [
    path('lista/', ProductoList.as_view(), name='producto-list'),
    path('iniciar_pago/', iniciar_pago, name='iniciar_pago'),
    path('webpay_respuesta/', webpay_respuesta, name='webpay_respuesta'),
    path("pago_exitoso/", pago_exitoso, name="pago_exitoso"),
    path('actualizar_stock/', actualizar_stock, name='actualizar_stock'),
    path('', include(router.urls)),  # ahora esto manejará /api/productos/
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
