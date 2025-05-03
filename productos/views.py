from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Producto, Orden
from .serializers import ProductoSerializer, OrdenSerializer
#from transbank.sdk.webpay import Webpay
#from transbank.webpay.webpay_plus.transaction import Transaction

import uuid

class ProductoList(APIView):
    def get(self, request):
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class OrdenViewSet(viewsets.ModelViewSet):
    queryset = Orden.objects.all()
    serializer_class = OrdenSerializer


#@api_view(['POST'])
#def iniciar_pago(request):
#    buy_order = str(uuid.uuid4())[:10]
#    session_id = str(uuid.uuid4())
#    amount = request.data.get("amount", 1000)  # puedes ajustar esto según tu modelo#
#
#    return_url = "http://127.0.0.1:8000/api/webpay/respuesta/"  # cambia a tu dominio si es producción

 #   tx = Transaction()
 #   response = tx.create(buy_order=buy_order, session_id=session_id, amount=amount, return_url=return_url)

    #eturn Response({
    #    "url": response['url'],
   #     "token": response['token']
  #  })

#@api_view(['POST'])
#def webpay_respuesta(request):
#    token = request.data.get("token_ws")
#
#    tx = Transaction()
#    response = tx.commit(token)
#
#    return Response({
#        "estado": response['status'],
#        "monto": response['amount'],
#        "orden": response['buy_order']
#    })

@api_view(['GET'])
def pago_exitoso(request):
    respuesta = {
        "estado": "exitoso",
        "mensaje": "El pago se ha procesado correctamente",
    }
    return Response(respuesta)
# Create your views here.
