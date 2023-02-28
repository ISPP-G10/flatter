from django.test import TestCase
from authentication.models import FlatterUser

class MyTest(TestCase):
    
    def test_createUser(self):
        FlatterUser.objects.create(username="Hola", password="1234", email="asd@asd.asd", first_name="A", last_name="B")
        
        assert FlatterUser.objects.count() == 1