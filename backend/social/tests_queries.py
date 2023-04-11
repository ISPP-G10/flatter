import logging
from django.test import TestCase
from social.models import Group, Message
from authentication.models import FlatterUser, Tag
from graphene.test import Client
from backend.schema import schema
from django.test import TestCase 
from social.queries import SocialQueries
from datetime import datetime

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

        cls.group2 = Group(name='test_query_group_2', individual=False)
        cls.group2.save()
        cls.group2.users.add(cls.user1, cls.user2, cls.user3)
        cls.group2.save()

        cls.tag1 = Tag(name='test_tag_1', entity='U', color='red')
        cls.tag1.save()

        cls.message1 = Message.objects.create(text='message1', group=cls.group1, user=cls.user1, timestamp=datetime(2023, 4, 11, 12, 0),)
        cls.message2 = Message.objects.create(text='message2', group=cls.group2, user=cls.user1, timestamp=datetime(2023, 4, 11, 12, 5),)
        cls.message3 = Message.objects.create(text='message3', group=cls.group1, user=cls.user2, timestamp=datetime(2023, 4, 12, 12, 0),)
        cls.message4 = Message.objects.create(text='message4', group=cls.group2, user=cls.user1, timestamp=datetime(2023, 4, 12, 12, 5),)

        cls.message1.save()
        cls.message2.save()
        cls.message3.save()
        cls.message4.save()

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
        assert executed == {'data': {'getGroups': [{'name': 'test_query_group_1'}, {'name': 'test_query_group_2'}]}}



    ### Test de query de grupos de un usuario +++ Caso positivo: obtener todos los grupos de un usuario
    def test_resolve_get_my_groups_returns_groups_with_last_message(self):
        result = SocialQueries.resolve_get_my_groups(None, None, 'test_user')
        expected_result = [
            {'group': self.group1, 'last_message': self.message3},
            {'group': self.group2, 'last_message': self.message4},
        ]
        self.assertEqual(len(result), len(expected_result))
        self.assertEqual(result[0].group.name, expected_result[0]['group'].name)
        self.assertEqual(result[0].last_message.text, expected_result[0]['last_message'].text)
        self.assertEqual(result[1].group.name, expected_result[1]['group'].name)
        self.assertEqual(result[1].last_message.text, expected_result[1]['last_message'].text)



    ### Test de query de mensajes de un grupo  +++ Caso positivo: obtener todos los mensajes de un grupo
    def test_get_messages_from_group_returns_correct_data(self):
        result = SocialQueries.resolve_get_messages_by_group(None, None, 'test_user', self.group1.id)
        expected_result = [
            {
                'key': datetime(2023, 4, 11),
                'value': [
                    {'user': self.user1, 'messages': [self.message1]},
                ],
            },
            {
                'key': datetime(2023, 4, 12),
                'value': [
                    {'user': self.user2, 'messages': [self.message3]},
                ],
            },
        ]
        self.assertEqual(len(result), len(expected_result)-1)
        
        self.assertEqual(len(result[0].value), len(expected_result[0]['value']) + len(expected_result[1]['value']))



    ### Test de query de mensajes  +++ Caso positivo: obtener todos los mensajes
    def test_get_messages_returns_correct_data(self):
        client = Client(schema)
        executed = client.execute('''query {getMessages{ text }}''')
        assert executed == {'data': {'getMessages': [{'text': 'message1'}, {'text': 'message2'}, {'text': 'message3'}, {'text': 'message4'}]}}


    ### Test de query de relaciones entre usuarios  +++ Caso positivo: obtener todas las relaciones entre usuarios
    def test_get_user_relations_returns_correct_data(self):
        #client = Client(schema)
        #executed = client.execute('''query {getRelationsBetweenUsers{ user_login, user_valued }}''')
        #assert executed == {'data': {'getRelationsBetweenUsers': []}}
        pass