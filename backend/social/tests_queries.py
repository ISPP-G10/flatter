import logging
from django.test import TestCase
from social.models import Group, Message
from authentication.models import FlatterUser, Tag
from graphene.test import Client
from backend.schema import schema
from django.test import TestCase

logging.disable(logging.CRITICAL)
    
##### QUERIES TESTS #####
class TestQueries(TestCase):

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

        cls.group1 = Group(name='test_query_group_1', individual=False)
        cls.group1.save()
        cls.group1.users.add(cls.user1, cls.user2, cls.user3)
        cls.group1.save()

        cls.tag1 = Tag(name='test_tag_1', entity='U', color='red')
        cls.tag1.save()

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        FlatterUser.objects.filter(username='test_user').delete()
        FlatterUser.objects.filter(username='test_user2').delete()
        FlatterUser.objects.filter(username='test_user3').delete()
        Group.objects.filter(name='test_group_1').delete()
        Tag.objects.filter(name='test_tag_1').delete()

    #Tests de query de GraphQL 
    ### Test de query de etiquetas  +++ Caso positivo: obtener todas las etiquetas
    def test_get_all_tag_returns_correct_data(self):
        client = Client(schema)
        executed = client.execute('''query {getAllTag{ name, color }}''')
        assert executed == {'data': {'getAllTag': [{'name': 'test_tag_1', 'color': 'red'}]}}


    ### Test de query de grupos  +++ Caso positivo: obtener todos los grupos
    def test_get_groups_returns_correct_data(self):
        client = Client(schema)
        executed = client.execute('''query {getGroups{ name }}''')
        assert executed == {'data': {'getGroups': [{'name': 'test_query_group_1'}]}}


    ### Test de query de grupos  +++ Caso positivo: obtener todos los grupos de un usuario
    def test_get_groups_by_user_returns_correct_data(self):
        pass


    ### Test de query de mensajes  +++ Caso positivo: no hay mensajes
    def test_get_messages_returns_empty_list_when_no_messages(self):
        client = Client(schema)
        executed = client.execute('''query {getMessages{ text }}''')
        assert executed == {'data': {'getMessages': []}}


    ### Test de query de mensajes  +++ Caso positivo: hay un mensaje
    def test_get_messages_returns_correct_data_with_one_message(self):
        client = Client(schema)
        message = Message(text='Test de query', user=self.user1, group=self.group1)
        message.save()
        executed = client.execute('''query {getMessages{ text }}''')
        assert executed == {'data': {'getMessages': [{'text': 'Test de query'}]}}
        message.delete()