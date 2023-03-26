from django.test import TestCase
from social.models import Group, Message, Incident, Request
from authentication.models import FlatterUser

# Create your tests here.

########## MODELS TESTS ##########
class TestModels(TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user1 = FlatterUser.objects.create_user(username="test_user", password="1234", email="test@gmail.com", first_name="Test", 
                                                last_name="User", genre = 'H', flatter_coins = 0,)

        cls.user2 = FlatterUser.objects.create_user(username="test_user2", password="1234", email="test2@gmail.com", first_name="Test", 
                                                last_name="User2", genre = 'M', flatter_coins = 0,)
        
        cls.user3 = FlatterUser.objects.create_user(username="test_user3", password="1234", email="test3@gmail.com", first_name="Test",
                                                last_name="User3", genre = 'H', flatter_coins = 0,)
        cls.user1.save()
        cls.user2.save()
        cls.user3.save()

        cls.group1 = Group(name='test_group_1', individual=True)
        cls.group1.save()
        cls.group1.users.add(cls.user1, cls.user2)
        cls.group1.save()

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        FlatterUser.objects.filter(username='test_user').delete()
        FlatterUser.objects.filter(username='test_user2').delete()
        FlatterUser.objects.filter(username='test_user3').delete()
        Group.objects.filter(name='test_group_1').delete()


    # Modelo Group
    ### Test de creación de un grupo individual  +++ Caso positivo
    def test_individual_group_positive(self):
        group = Group(name='individual_group_test_positive', individual=True)
        group.save()
        group.users.add(self.user1, self.user2)
        self.assertEqual(group.name, 'individual_group_test_positive')
        self.assertEqual(group.individual, True)
        self.assertEqual(group.users.count(), 2)
        group.delete()

    ### Test de creación de un grupo individual  --- Caso negativo: el grupo individual no tiene suficientes miembros 
    def test_individual_group_negative(self):
        try:
            group = Group(name='individual_group_test_negative', individual=True)
            group.save()
            group.users.add(self.user1)
            self.fail("Individual group can only have two users")
        except:
            pass

    ### Test de creación de un grupo individual  --- Caso negativo: el nombre del grupo está vacío
    def test_individual_group_negative2(self):
        try:
            group = Group(name='', individual=True)
            group.save()
            group.users.add(self.user1, self.user2)
            self.fail("Group name can't be empty")
        except:
            pass

    ### Test de creación de un grupo público  +++ Caso positivo
    def test_public_group_positive(self):
        group = Group(name='group_test1', individual=False)
        group.save()
        group.users.add(self.user1, self.user2, self.user3)
        self.assertEqual(group.name, 'group_test1')
        self.assertEqual(group.individual, False)
        self.assertEqual(group.users.count(), 3)

    ### Test de creación de un grupo público --- Caso negativo: el grupo público no tiene suficientes miembros (3)
    def test_public_group_negative(self):
        try:
            group = Group(name='group_test2', individual=False)
            group.save()
            group.users.add(self.user1)
            self.fail("Group must have at least 3 users")
        except:
            pass

    ### Test de borrado de un grupo público --- Caso negativo: no se puede borrar un grupo público con más de 2 miembros
    def test_public_group_negative2(self):
        try:
            group = Group(name='group_test3', individual=False)
            group.save()
            group.users.add(self.user1, self.user2, self.user3)
            group.delete()
            self.fail("Group can not be deleted")
        except:
            pass


    # Modelo Message
    ### Test de creación de un mensaje  +++ Caso positivo
    def test_message_positive(self):
        message = Message(text='Esto es una prueba positiva', user=self.user1, group=self.group1)
        message.save()
        self.assertEqual(message.text, 'Esto es una prueba positiva')
        self.assertEqual(message.user, self.user1)
        self.assertEqual(message.group, self.group1)
        message.delete()

    ### Test de creación de un mensaje  --- Caso negativo: mensaje en blanco
    def test_message_negative(self):
        try:
            message = Message(text='Esto es una prueba negativa', user=self.user1, group=self.group1)
            message.save()
            self.fail("Message must have text")
        except:
            pass

    ### Test de creación de un mensaje: usuario no pertenece al grupo  --- Caso negativo
    def test_message_negative2(self):
        try:
            message = Message(text='Esto es una prueba negativa', user=self.user3, group=self.group1)
            message.save()
            self.fail("User not in group")
        except:
            pass