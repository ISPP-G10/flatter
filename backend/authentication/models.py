from datetime import datetime
from django.db import models
from django.db.models import signals
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError



class RoleType(models.TextChoices):
    owner = 'OWNER'
    renter = 'RENTER'

class Role(models.Model):
    role = models.CharField(max_length=60, choices=[ (tag, tag.value) for tag in RoleType])
    
    def __str__(self):
        return f"User[username: {self.username}, first_name: {self.first_name}, last_name: {self.last_name}, email: {self.email}]"
    
class Tag(models.Model):
    
    choices_entity = (('P', 'Property'), ('U', 'User'))
    
    name= models.CharField(max_length=20)
    entity = models.CharField(choices=choices_entity, max_length=1)
    color = models.CharField(max_length=7)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name", "entity"], name='Unique name-entity constraint'),
        ]

class FlatterUser(AbstractUser):
    choices_genre = (('H','Hombre'),
                     ('M', 'Mujer'),
                     ('NB','No Binario'),
                     ('O', 'Otro'))
    email = models.EmailField(_("email_address"), unique=True)
    phone_number = models.CharField(_("phone_number"), max_length=20, null=True)
    profile_picture = models.ImageField(_("profile_picture"), upload_to='users/images/', blank=True, null=True)
    roles = models.ManyToManyField(Role, related_name=_('roles'))
    genre = models.CharField(choices=choices_genre, max_length=2)
    bibliography = models.TextField(_("bibliography"), blank=True, null=True)
    flatter_coins = models.IntegerField(default=0)
    profession = models.CharField(max_length=100, blank=True, null=True)
    birthday = models.DateField(_("birthday"), blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name=_('user_tags'))
    
    
    def __str__(self):
        return f"User[username: {self.username}, first_name: {self.first_name}, last_name: {self.last_name}, email: {self.email}]"
    
class Plan(models.Model):
    choices_type = (
        ('B', 'Básico'),
        ('A','Advanced'),
        ('P','Pro')
    )
    price = models.FloatField()
    initial_date = models.DateTimeField(default=datetime.now)
    end_date = models.DateTimeField(null=True)
    plan_type = models.CharField(max_length=1, choices=choices_type)
    user = models.ForeignKey(FlatterUser, on_delete=models.DO_NOTHING)
    
class UserPreferences(models.Model):
    public = models.BooleanField()
    online = models.BooleanField()
    bad_words = models.BooleanField()
    user = models.ForeignKey(FlatterUser, on_delete=models.CASCADE)
    
def add_roles(sender=None, **kwargs):
    for role in RoleType:
        Role.objects.get_or_create(role=role)

signals.post_migrate.connect(add_roles, sender=Role)








