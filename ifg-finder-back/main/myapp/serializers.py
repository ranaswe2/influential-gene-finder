from rest_framework import serializers
from myapp.models import User, Dataset, InfluentialGene, DrugCandidate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'profession', 'email', 'image_path', 'otp', 'is_verified', 'password', 'created_at', 'updated_at', 'deleted_at', 'is_active']

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ['user','disease','dataset_path','created_at','updated_at','deleted_at']

class InfluentialGeneSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfluentialGene
        fields = ['dataset', 'splitting_columns', 'ifg_file_path', 'created_at', 'updated_at', 'deleted_at']

class DrugCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrugCandidate
        fields = ['influentialgene','dsigdb_path','created_at','updated_at','deleted_at']