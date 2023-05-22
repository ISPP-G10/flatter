from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator

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
        _('first_name'),
        max_length=50,
        validators=[MinLengthValidator(3)]
    )

    last_name = models.CharField(
        _('last_name'),
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
    flatter_coins = models.PositiveIntegerField(default = 0)
    visits_number = models.FloatField(default = 10)
    tags_number = models.PositiveIntegerField(default = 6)
    advertisement = models.BooleanField(default=False)
    chat_creation = models.BooleanField(default=False)
    standard_support = models.BooleanField(default=False)
    premium_support = models.BooleanField(default=False)
    view_self_profile_opinions = models.BooleanField(default=False)
    initial_date = models.DateField(default=datetime.now)
    end_date = models.DateField(null=True)
    plan_type = models.CharField(max_length=1, choices=choices_type)
    compensation = models.PositiveIntegerField(default=0)

class Contract(models.Model):
    choices_days = (
        (1, '1 día'),
        (3, '3 días'),
        (7, '1 semana'),
        (30, '1 mes'),
        (90, '3 meses'),
        (180, '6 meses')
    )
    initial_date = models.DateField(default=datetime.now)
    end_date = models.DateField(null=True)
    choices = models.PositiveIntegerField(choices_days, default=1, null=True)
    obsolete = models.BooleanField(default=False)
    user = models.ForeignKey(FlatterUser, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
        
class UserPreferences(models.Model):
    public = models.BooleanField(default=True)
    add_group = models.BooleanField(default=True)
    inappropiate_language = models.BooleanField(default=True)
    user = models.OneToOneField(FlatterUser, on_delete=models.CASCADE)
    
class Promotion(models.Model):
    code = models.CharField(max_length=64, unique=True)
    quantity = models.FloatField()
    is_discount = models.BooleanField(default=False)
    users_used = models.ManyToManyField(FlatterUser, related_name=_('users_used'), blank=True)
    is_disabled = models.BooleanField(default=False)
    can_be_used_always = models.BooleanField(default=False)
    max_date = models.DateField(null=True, blank=True)
    times_to_be_used = models.PositiveIntegerField(null=True, blank=True)
    is_welcome_promotion = models.BooleanField(default=False)

class ReferralProgram(models.Model):
    initial_date = models.DateField(default=datetime.now)
    end_date = models.DateField()
    user = models.OneToOneField(FlatterUser, on_delete=models.CASCADE)
    code = models.CharField(max_length=64, unique=True)
    users_referred = models.ManyToManyField(FlatterUser, related_name=_('users_referred'), blank=True)
    user_quantity = models.PositiveIntegerField(default=0)
    user_referred_quantity = models.PositiveIntegerField(default=0)
    times_to_be_used = models.PositiveIntegerField()
    is_disabled = models.BooleanField(default=False)

class ReferralProgramController(models.Model):
    max_days = models.PositiveIntegerField(default=0)
    max_users = models.PositiveIntegerField(default=0)
    quantity = models.PositiveIntegerField(default=0)
    quantity_referred = models.PositiveIntegerField(default=0)
    is_disabled = models.BooleanField(default=False)
