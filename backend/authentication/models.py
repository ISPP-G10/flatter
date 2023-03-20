from datetime import datetime
from django.db import models
from django.db.models import signals
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator


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
    phone_number = models.CharField(_("phone_number"), max_length=9, null=True)
    profile_picture = models.ImageField(_("profile_picture"), upload_to='users/images/', default='users/images/default.png')
    roles = models.ManyToManyField(Role, related_name=_('roles'))
    genre = models.CharField(choices=choices_genre, max_length=2)
    biography = models.TextField(_("biography"), blank=True, null=True)
    flatter_coins = models.PositiveIntegerField(default=0)
    profession = models.CharField(max_length=100, blank=True, null=True)
    birthday = models.DateField(_("birthday"), blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name=_('user_tags'))
    username = models.CharField(
        _('username'),
        max_length=24,
        unique=True,
        validators=[MinLengthValidator(6)]
    )
    password = models.CharField(
        _('password'),
        max_length=128,
        validators=[MinLengthValidator(6)]
    )
    first_name = models.CharField(
        _('first name'),
        max_length=50,
        validators=[MinLengthValidator(3)]
    )

    last_name = models.CharField(
        _('last name'),
        max_length=50,
        validators=[MinLengthValidator(3)]
    )
    
    def __str__(self):
        return f"User[username: {self.username}, first_name: {self.first_name}, last_name: {self.last_name}, email: {self.email}]"
    
class Plan(models.Model):
    choices_type = (
        ('B', 'Básico'),
        ('A','Advanced'),
        ('P','Pro')
    )
    price = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100000.0)],)
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

signals.post_migrate.connect(add_roles)








