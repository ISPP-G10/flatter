from django.db import models
from django.db.models import signals
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _



class RoleType(models.TextChoices):
    owner = 'OWNER'
    renter = 'RENTER'

class Role(models.Model):
    role = models.CharField(max_length=60, choices=[ (tag, tag.value) for tag in RoleType])
    
    def __str__(self):
        return f"User[username: {self.username}, first_name: {self.first_name}, last_name: {self.last_name}, email: {self.email}]"
    
class Tag(models.Model):
    name= models.CharField(max_length=30)
    #-Entity = Entity

class UserPreferences(models.Model):
    public = models.BooleanField()
    online = models.BooleanField()
    bad_words = models.BooleanField()

class Plan(models.Model):
    choices_type = (
        ('B', 'Básico'),
        ('A','Advanced'),
        ('P','Pro')
    )
    price = models.FloatField()
    initial_date = models.DateTimeField()
    end_date = models.DateTimeField()
    plan_type = models.CharField(max_length=1, choices=choices_type)

class FlatterUser(AbstractUser):
    choices_genre = (('H','Hombre'),
                     ('M', 'Mujer'),
                     ('NB','No Binario'),
                     ('O', 'Otro'))
    email = models.EmailField(_("email_address"), unique=True)
    phone_number = models.CharField(_("phone_number"), max_length=20, null=True)
    profile_picture = models.ImageField(_("profile_picture"), upload_to='users/images/', blank=True, null=True)
    roles = models.ManyToManyField(Role, related_name=_('roles'), blank=True)
    genre = models.CharField(choices=choices_genre, max_length=2)
    flatterCoins = models.FloatField(blank=True, null=True)
    role = models.ForeignKey(Role, on_delete=models.DO_NOTHING)
    user_preferences = models.ForeignKey(UserPreferences, on_delete=models.DO_NOTHING, null=True, blank=True)
    tag = models.ManyToManyField(Tag, null=True, blank=True)
    plan = models.ForeignKey(Plan, on_delete=models.DO_NOTHING, null=True, blank=True)
    
    
    def __str__(self):
        return f"User[username: {self.username}, first_name: {self.first_name}, last_name: {self.last_name}, email: {self.email}]"
    
    
def add_roles(sender=None, **kwargs):
    for role in RoleType:
        Role.objects.get_or_create(role=role)

signals.post_migrate.connect(add_roles)








