from rest_framework import serializers
from .models import Producto, Orden
from usuarios.serializers import RegistroSerializer


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = "__all__"
        imagen = serializers.ImageField(use_url=True)

class OrdenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orden
        fields = "__all__"