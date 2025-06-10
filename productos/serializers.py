from rest_framework import serializers
from .models import Producto, Orden
from usuarios.serializers import RegistroSerializer


class ProductoSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(use_url=True)
    class Meta:
        model = Producto
        fields = "__all__"
        

class OrdenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orden
        fields = "__all__"