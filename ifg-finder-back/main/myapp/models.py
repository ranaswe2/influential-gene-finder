from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a regular user with an email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Use set_password to hash the password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser):
    name = models.CharField(max_length=50)
    profession = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, unique=True)
    image_path = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    otp = models.IntegerField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    password = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Required for superuser
    is_superuser = models.BooleanField(default=False)  # Required for superuser

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'profession']  # Fields required for creating a superuser

    def __str__(self):
        return self.name



class Dataset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    disease = models.TextField(max_length=1000)
    dataset_path = models.FileField(upload_to='datasets/', null=True, blank=True)
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at= models.DateTimeField(auto_now_add=True)
    deleted_at= models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.disease


class InfluentialGene(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE)
    splitting_columns = models.IntegerField()
    ifg_file_path = models.FileField(upload_to='ifg_files/', null=True, blank=True)  # Path to CSV file
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"CSV for dataset {self.dataset.id}"


class DrugCandidate(models.Model):
    influentialgene = models.ForeignKey(InfluentialGene, on_delete=models.CASCADE)
    dsigdb_path = models.FileField(upload_to='dsigdb_files/', null=True, blank=True) 
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at= models.DateTimeField(auto_now_add=True)
    deleted_at= models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"CSV for dataset {self.dataset.id}"
