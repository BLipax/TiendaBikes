from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .models import Producto, Orden
from .serializers import ProductoSerializer, OrdenSerializer, RegistroSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from transbank.common.options import WebpayOptions
from transbank.webpay.webpay_plus.transaction import Transaction
import uuid
from decouple import config

# Producto and Orden ViewSets
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class OrdenViewSet(viewsets.ModelViewSet):
    queryset = Orden.objects.all()
    serializer_class = OrdenSerializer

# User Registration
User = get_user_model()

class RegistroView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]

# Webpay Payment Initiation
@api_view(['POST'])
def iniciar_pago(request):
    total = request.data.get('total')

    if not total:
        return Response({"error": "Debes enviar un monto 'total'"}, status=status.HTTP_400_BAD_REQUEST)

    options = WebpayOptions(
        commerce_code=config('WEBPAY_COMMERCE_CODE', default='597055555532'),
        api_key=config('WEBPAY_API_KEY', default='579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'),
        integration_type='TEST'
    )

    transaction = Transaction(options)
    buy_order = str(uuid.uuid4())[:10]
    session_id = str(uuid.uuid4())[:10]
    return_url = request.build_absolute_uri('/Catalogo')

    try:
        response = transaction.create(
            buy_order=buy_order,
            session_id=session_id,
            amount=total,
            return_url=return_url,
        )
        return Response({
            "token": response["token"],
            "url": response["url"]
        })
    except Exception as e:
        return Response({"error": f"Error al iniciar la transacción: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Webpay Response Handling
@api_view(['POST'])
def webpay_respuesta(request):
    token = request.data.get("token_ws")

    if not token:
        return Response({"error": "Falta el token de pago (token_ws)"}, status=status.HTTP_400_BAD_REQUEST)

    options = WebpayOptions(
        commerce_code=config('WEBPAY_COMMERCE_CODE', default='597055555532'),
        api_key=config('WEBPAY_API_KEY', default='579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'),
        integration_type='TEST'
    )

    transaction = Transaction(options)

    try:
        response = transaction.commit(token)
        return Response({
            "estado": response.get('status'),
            "monto": response.get('amount'),
            "orden": response.get('buy_order'),
            "autorizacion": response.get('authorization_code'),
            "fecha": response.get('transaction_date')
        })
    except Exception as e:
        return Response({"error": f"Error al procesar la transacción: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Payment Success Confirmation
@api_view(['GET'])
def pago_exitoso(request):
    return Response({
        "estado": "exitoso",
        "mensaje": "El pago se ha procesado correctamente"
    })

# Stock Update (Single Version)
@api_view(['POST'])
def actualizar_stock(request):
    """
    Recibe JSON con lista de productos y cantidades compradas:
    {
      "items": [
        {"id": 1, "cantidad": 2},
        {"id": 3, "cantidad": 1}
      ]
    }
    Reduce el stock de cada producto según la cantidad.
    """
    items = request.data.get('items', [])
    if not items:
        return Response({"error": "No se enviaron productos"}, status=status.HTTP_400_BAD_REQUEST)

    errores = []
    for item in items:
        try:
            producto = Producto.objects.get(id=item['id'])
            cantidad_comprada = int(item['cantidad'])
            if producto.stock < cantidad_comprada:
                errores.append(f"No hay stock suficiente para el producto {producto.nombre}")
                continue
            producto.stock -= cantidad_comprada
            producto.save()
        except Producto.DoesNotExist:
            errores.append(f"Producto con id {item['id']} no encontrado")
        except Exception as e:
            errores.append(f"Error procesando producto {item.get('id')}: {str(e)}")

    if errores:
        return Response({"error": errores}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"mensaje": "Stock actualizado correctamente"}, status=status.HTTP_200_OK)