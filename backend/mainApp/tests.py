from django.db import IntegrityError
from django.test import TestCase
from authentication.models import FlatterUser, UserPreferences, Tag
from .models import Property

# Create your tests here.
class TestProperty(TestCase):
    
    def test_createPropertyPositive(self):
        
        user = FlatterUser.objects.create_user(
                            username="Hola", 
                            password="1234", 
                            email="asd@asd.asd", 
                            first_name="A", 
                            last_name="B", 
                            genre = 'H',
                            flatter_coins = 0,
                        )
        
        Property.objects.create(
            title="title",
            description="description",
            bedrooms_number=3,
            bathrooms_number=2,
            price=100,
            location="location",
            province="province",
            dimensions=200,
            owner=user,
            max_capacity=5,
        )
        
        assert Property.objects.count() == 1

    def test_createPropertyNegative(self):
        
        user = FlatterUser.objects.create_user(
                            username="Hola", 
                            password="1234", 
                            email="asd@asd.asd", 
                            first_name="A", 
                            last_name="B", 
                            genre = 'H',
                            flatter_coins = 0,
                        )
        try:
            Property.objects.create(
                title="title",
                description="description",
                bedrooms_number=3,
                bathrooms_number=2,
                price=100,
                location="location",
                province="province",
                dimensions=200,
                owner=user,
                max_capacity=-5,
            ) 
            self.fail("Se esperaba un error por duplicación de email.")
        except IntegrityError:
            pass
    
    def test_addTagToProperty(self):

        tag_1 = Tag.objects.create(name="Tag 1", entity="U")
        
        user = FlatterUser.objects.create_user(
                            username="Hola", 
                            password="1234", 
                            email="asd@asd.asd", 
                            first_name="A", 
                            last_name="B", 
                            genre = 'H',
                            flatter_coins = 0,
                        )
        
        property = Property.objects.create(
            title="title",
            description="description",
            bedrooms_number=3,
            bathrooms_number=2,
            price=100,
            location="location",
            province="province",
            dimensions=200,
            owner=user,
            max_capacity=5,
        )
        property.tags.add(tag_1)
        
        assert Property.objects.first().tags.count() == 1
    
    def test_updateProperty(self):
        
        user = FlatterUser.objects.create_user(
                            username="Hola", 
                            password="1234", 
                            email="asd@asd.asd", 
                            first_name="A", 
                            last_name="B", 
                            genre = 'H',
                            flatter_coins = 0,
                        )
        
        Property.objects.create(
            title="title",
            description="description",
            bedrooms_number=3,
            bathrooms_number=2,
            price=100,
            location="location",
            province="province",
            dimensions=200,
            owner=user,
            max_capacity=5,
        )
        
        Property.objects.update(
            title="Mi habitación",
            description="un día bonito",
        )

        assert Property.objects.get(title="Mi habitación")
    
    def test_deleteProperty(self):
        
        user = FlatterUser.objects.create_user(
                            username="Hola", 
                            password="1234", 
                            email="asd@asd.asd", 
                            first_name="A", 
                            last_name="B", 
                            genre = 'H',
                            flatter_coins = 0,
                        )
        
        Property.objects.create(
            title="title",
            description="description",
            bedrooms_number=3,
            bathrooms_number=2,
            price=100,
            location="location",
            province="province",
            dimensions=200,
            owner=user,
            max_capacity=5,
        )
        
        property = Property.objects.get(title="title")
        property.delete()

        assert Property.objects.count() == 0
    
    def test_MakePropertyOutstanding(self):

        user = FlatterUser.objects.create_user(
                            username="Hola", 
                            password="1234", 
                            email="asd@asd.asd", 
                            first_name="A", 
                            last_name="B", 
                            genre = 'H',
                            flatter_coins = 0,
                        )
        
        Property.objects.create(
            title="title",
            description="description",
            bedrooms_number=3,
            bathrooms_number=2,
            price=100,
            location="location",
            province="province",
            dimensions=200,
            owner=user,
            max_capacity=5,
        )

        Property.objects.update(
            is_outstanding=True
        )

        assert Property.objects.get(title="title").is_outstanding == True

        