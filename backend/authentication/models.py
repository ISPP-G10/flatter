from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class FlatterUser(AbstractUser):
    email = models.EmailField(_("email_address"), unique=True)
    phone_number = models.CharField(_("phone_number"), max_length=20, null=True)
    profile_picture = models.ImageField(_("profile_picture"), upload_to='users/images/', blank=True, null=True)
    
    def __str__(self):
        return f"User[username: {self.username}, first_name: {self.first_name}, last_name: {self.last_name}, email: {self.email}]"