from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, OrdenViewSet, RegistroView, iniciar_pago, actualizar_stock, pago_exito, webpay_respuesta
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register('productos', ProductoViewSet)
router.register('ordenes', OrdenViewSet)

urlpatterns = [
    path('registro/', RegistroView.as_view(), name='registro'),
    path('iniciar-pago/', iniciar_pago, name='iniciar_pago'),
    path('webpay-respuesta/', webpay_respuesta, name='webpay_respuesta'),
    path('pago-exito/', pago_exito, name='pago_exito'),
    path('actualizar-stock/', actualizar_stock, name='actualizar_stock'),
    path('', include(router.urls)),  # Handles /api/productos/, /api/ordenes/
]

# Serve media files for testing
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)