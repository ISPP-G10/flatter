from django.db import models
from authentication.models import FlatterUser, Tag
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Image(models.Model):
    image = models.ImageField( upload_to='property/images/', blank=True, null=True)
    
class Property(models.Model):
    is_outstanding = models.BooleanField()
    title = models.CharField(max_length=50)
    description = models.TextField
    visits_counter = models.IntegerField()
    beedrooms_number = models.IntegerField()
    bathrooms_number = models.IntegerField()
    price = models.FloatField()
    #LOCATION DEBERIA SER UN SELECT
    location = models.CharField(max_length=50)
    province = models.CharField(max_length=50)
    is_in_offer = models.BooleanField()
    is_full = models.BooleanField
    dimensions = models.IntegerField()
    tags = models.ManyToManyField(Tag, related_name=_('property_tags'))
    images = models.ManyToManyField(Image) 

class Review(models.Model):
    assessment = models.IntegerField()
    text = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)
    valued_user = models.ForeignKey(FlatterUser, blank=True, null=True,on_delete=models.CASCADE),
    evaluator_user = models.ForeignKey(FlatterUser, blank=True, null=True, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, blank=True, null=True, on_delete=models.CASCADE)

class Type(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField()

class Application(models.Model):
    message = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)
    property = models.ForeignKey(Property,on_delete=models.CASCADE)
    user = models.ManyToManyField(FlatterUser)
    type = models.ForeignKey(Type, on_delete= models.DO_NOTHING)

