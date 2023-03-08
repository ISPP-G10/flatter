from django.db import models
from authentication.models import FlatterUser, Tag
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Image(models.Model):
    image = models.ImageField( upload_to='property/images/', blank=True, null=True)
    
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

class Review(models.Model):

    choices_entity = (('A', 'Amigos'), ('C', 'Compañeros'), ('E', 'Excompañeros'), ('P', 'Propietario'))

    assessment = models.IntegerField()
    text = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)
    valued_user = models.ForeignKey(FlatterUser, blank=True, null=True, on_delete=models.CASCADE, related_name='valued_reviews')
    evaluator_user = models.ForeignKey(FlatterUser, blank=True, null=True, on_delete=models.CASCADE, related_name='evaluator_reviews')
    property = models.ForeignKey(Property, blank=True, null=True, on_delete=models.CASCADE)
    relationship = models.CharField(choices=choices_entity, max_length=1)

class Type(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField()

class Application(models.Model):
    message = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)
    property = models.ForeignKey(Property,on_delete=models.CASCADE)
    user = models.ManyToManyField(FlatterUser)
    type = models.ForeignKey(Type, on_delete= models.DO_NOTHING)