import json
import graphene
from graphene_django.utils.testing import GraphQLTestCase
from django.db import IntegrityError
from django.test import TestCase
from authentication.models import FlatterUser, Tag
from .models import Property


# Create your tests here.
class TestProperty(TestCase):
    def setUp(self):
        self.user = FlatterUser.objects.create_user(
            username="Hola",
            password="1234",
            email="asd@asd.asd",
            first_name="A",
            last_name="B",
            genre='H',
            flatter_coins=0,
        )

        self.property = Property.objects.create(
            title="title",
            description="description",
            bedrooms_number=3,
            bathrooms_number=2,
            price=100,
            location="location",
            province="province",
            dimensions=200,
            owner=self.user,
            max_capacity=5,
        )
    
    def test_createPropertyPositive(self):
        
        assert Property.objects.count() == 1

    def test_createPropertyNegative(self):
        
        try:
            self.property = Property.objects.create(
                title="title",
                description="description",
                bedrooms_number=3,
                bathrooms_number=2,
                price=100,
                location="location",
                province="province",
                dimensions=200,
                owner=self.user,
                max_capacity=-5,
            ) 
            self.fail("Se esperaba un error por creación de inmueble")
        except IntegrityError:
            pass
    
    def test_addTagToProperty(self):

        tag_1 = Tag.objects.create(name="Tag 1", entity="U")
        
        self.property.tags.add(tag_1)
        
        assert Property.objects.first().tags.count() == 1
    
    def test_updateProperty(self):
        
        self.property = Property.objects.update(
            title="Mi habitación",
            description="un día bonito",
        )

        assert Property.objects.get(title="Mi habitación")
    
    def test_deleteProperty(self):
        
        self.property = Property.objects.get(title="title")
        self.property.delete()

        assert Property.objects.count() == 0
    
    def test_MakePropertyOutstanding(self):
        
        self.property = Property.objects.update(
            is_outstanding=True
        )

        assert Property.objects.get(title="title").is_outstanding == True