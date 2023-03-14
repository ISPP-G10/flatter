from django.db import IntegrityError
from django.test import TestCase
from .models import FlatterUser, UserPreferences, Tag

class MyTest(TestCase):
    
    def test_createUser(self):
        
        tag_1 = Tag.objects.create(name="Tag 1", entity="U")
        tag_2 = Tag.objects.create(name="Tag 2", entity="P")
        
        user = FlatterUser.objects.create_user(
                            username="Hola", 
                            password="1234", 
                            email="asd@asd.asd", 
                            first_name="A", 
                            last_name="B", 
                            genre = 'H',
                            flatter_coins = 0,
                        )
        
        user.tags.add(tag_1, tag_2)
        
        assert FlatterUser.objects.count() == 1
        assert FlatterUser.objects.first().tags.count() == 2
        
    def test_duplicate_username(self):

        user1 = FlatterUser.objects.create_user(
                            username="Hola", 
                            password="1234", 
                            email="asd1@asd.asd", 
                            first_name="A", 
                            last_name="B", 
                            genre = 'H',
                            flatter_coins = 0,
                        )

        try:
            user2 = FlatterUser.objects.create_user(
                            username="Hola", 
                            password="1234", 
                            email="asd2@asd.asd", 
                            first_name="C", 
                            last_name="D", 
                            genre = 'M',
                            flatter_coins = 0,
                        )
            self.fail("Se esperaba un error por duplicación de nombre de usuarios.")
        except IntegrityError:
            pass

    def test_duplicate_email(self):

        user1 = FlatterUser.objects.create_user(
                            username="Hola", 
                            password="1234", 
                            email="asd1@asd.asd", 
                            first_name="A", 
                            last_name="B", 
                            genre = 'H',
                            flatter_coins = 0,
                        )

        try:
            user2 = FlatterUser.objects.create_user(
                            username="Hola2", 
                            password="1234", 
                            email="asd1@asd.asd", 
                            first_name="C", 
                            last_name="D", 
                            genre = 'M',
                            flatter_coins = 0,
                        )
            self.fail("Se esperaba un error por duplicación de email.")
        except IntegrityError:
            pass
        