from django.db import models
from authentication.models import FlatterUser, Tag
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator, MinLengthValidator

# Create your models here.

class Image(models.Model):
    image = models.ImageField( upload_to='properties/images/', blank=True, null=True)


class Property(models.Model):
    is_outstanding = models.BooleanField(default=False)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=250, default="")
    visits_counter = models.IntegerField(default=0)
    bedrooms_number = models.IntegerField()
    bathrooms_number = models.IntegerField()
    price = models.FloatField()
    #LOCATION DEBERIA SER UN SELECT
    location = models.CharField(max_length=50)
    province = models.CharField(max_length=50)
    is_in_offer = models.BooleanField(default=False)
    is_full = models.BooleanField(default=False)
    dimensions = models.IntegerField()
    tags = models.ManyToManyField(Tag, related_name=_('property_tags'))
    images = models.ManyToManyField(Image, related_name=_('property_images'))
    owner = models.ForeignKey(FlatterUser, related_name=_('property_owner'), on_delete=models.CASCADE)
    flatmates = models.ManyToManyField(FlatterUser, related_name=_('property_flatmates'))

class Review(models.Model):

    choices_entity = (('A', 'Amigo'), ('C', 'Compañero'), ('E', 'Excompañero'), ('P', 'Propietario'))

    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True)
    text = models.TextField(validators=[MinLengthValidator(2)], max_length=256)
    creation_date = models.DateTimeField(auto_now_add=True)
    valued_user = models.ForeignKey(FlatterUser, on_delete=models.CASCADE, related_name='valued_reviews')
    evaluator_user = models.ForeignKey(FlatterUser, on_delete=models.CASCADE, related_name='evaluator_reviews')
    relationship = models.CharField(choices=choices_entity, max_length=1)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["valued_user", "evaluator_user"], name='Review must be unique'),
        ]

class Type(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField()

class Application(models.Model):
    message = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)
    property = models.ForeignKey(Property,on_delete=models.CASCADE)
    user = models.ManyToManyField(FlatterUser)
    type = models.ForeignKey(Type, on_delete= models.DO_NOTHING)