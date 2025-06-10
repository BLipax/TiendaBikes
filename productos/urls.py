from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, OrdenViewSet, iniciar_pago, webpay_respuesta, pago_exitoso, actualizar_stock

router = DefaultRouter()
router.register(r'', ProductoViewSet, basename='producto')  # root path is now just /api/productos/
router.register(r'ordenes', OrdenViewSet, basename='orden')

urlpatterns = [
    path('', include(router.urls)),
    path('iniciar_pago/', iniciar_pago, name='iniciar_pago'),
    path('webpay_respuesta/', webpay_respuesta, name='webpay_respuesta'),
    path('pago_exitoso/', pago_exitoso, name='pago_exitoso'),
    path('actualizar_stock/', actualizar_stock, name='actualizar_stock'),
]
