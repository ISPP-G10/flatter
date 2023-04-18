import logging
from django.test import TestCase
from social.models import Group, Message, InappropiateLanguage
from authentication.models import FlatterUser, Tag, Role
from mainApp.models import Property, Municipality, Province
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
        Group.objects.filter(name='test_group_2').delete()
        Tag.objects.filter(name='test_tag_1').delete()
        Message.objects.filter(text='message1').delete()
        Message.objects.filter(text='message2').delete()
        Message.objects.filter(text='message3').delete()
        Message.objects.filter(text='message4').delete()

    #Tests de query de GraphQL 
    ### Test de query de etiquetas  +++ Caso positivo: obtener todas las etiquetas
    def test_get_all_tag_returns_correct_data(self):
        client = Client(schema)
        executed = client.execute('''query {getAllTag(userToken: " "){ name, color }}''')
        assert executed == {'data': {'getAllTag': [{'name': 'test_tag_1', 'color': 'red'}]}}



    ### Test de query de grupos  +++ Caso positivo: obtener todos los grupos
    def test_get_groups_returns_correct_data(self):
        client = Client(schema)
        executed = client.execute('''query {getGroups(userToken: " "){ name }}''')
        expected_data = {'data': {'getGroups': [{'name': 'test_query_group_1'}, {'name': 'test_query_group_2'}]}}
        assert len(executed['data']['getGroups']) == len(expected_data['data']['getGroups'])
        for group in expected_data['data']['getGroups']:
            assert group in executed['data']['getGroups']



    ### Test de query de grupos de un usuario +++ Caso positivo: obtener todos los grupos de un usuario
    def test_resolve_get_my_groups_returns_groups_with_last_message(self):
        result = SocialQueries.resolve_get_my_groups(None, None, 'test_user')
        expected_result = [
            {'group': self.group2, 'last_message': self.message4},
            {'group': self.group1, 'last_message': self.message3},
        ]
        self.assertEqual(len(result), len(expected_result))
        self.assertEqual(result[0].group.name, expected_result[0]['group'].name)
        self.assertEqual(result[0].last_message.text, expected_result[0]['last_message'].text)
        self.assertEqual(result[1].group.name, expected_result[1]['group'].name)
        self.assertEqual(result[1].last_message.text, expected_result[1]['last_message'].text)


    ### Test de query de mensajes de un grupo  --- Caso negativo: obtener todos los mensajes de un usuario no existente
    def test_get_messages_from_group_returns_with_non_existent_user(self):
        try:
            SocialQueries.resolve_get_messages_by_group(None, None, 'no_user', self.group1.id)
        except Exception as e:
            self.assertEqual(str(e), 'El usuario no es válido')



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


    ### Test de query de mensajes de un grupo  --- Caso negativo: obtener todos los mensajes de un grupo no existente
    def test_get_messages_from_group_returns_with_non_existent_group(self):
        try:
            SocialQueries.resolve_get_messages_by_group(None, None, 'test_user', 0)
        except Exception as e:
            self.assertEqual(str(e), 'El grupo no existe')



    ### Test de query de mensajes  +++ Caso positivo: obtener todos los mensajes
    def test_get_messages_returns_correct_data(self):
        client = Client(schema)
        executed = client.execute('''query {getMessages(userToken: " "){ text }}''')
        assert executed == {'data': {'getMessages': [{'text': 'message1'}, {'text': 'message2'}, {'text': 'message3'}, {'text': 'message4'}]}}



    ### Test de query de etiquetas a partir de su tipo +++ Caso positivo: obtener todas las etiquetas de un tipo
    def test_resolve_get_tags_by_type_returns_tags_with_valid_type(self):
        user_tag = Tag.objects.create(entity="U", name="user_tag", color="red")
        prop_tag = Tag.objects.create(entity="P", name="prop_tag", color="pink")

        user_tag.save()
        prop_tag.save()

        result_user = SocialQueries.resolve_get_tags_by_type(None, None, "U")
        self.assertIn(user_tag, result_user)
        self.assertNotIn(prop_tag, result_user)

        result_prop = SocialQueries.resolve_get_tags_by_type(None, None, "P")
        self.assertIn(prop_tag, result_prop)
        self.assertNotIn(user_tag, result_prop)

        user_tag.delete()
        prop_tag.delete()



    ### Test de query de etiquetas a partir de su tipo --- Caso negativo: obtener todas las etiquetas de un tipo no existente
    def test_resolve_get_tags_by_type_raises_value_error_with_invalid_type(self):
        try:
            SocialQueries.resolve_get_tags_by_type(None, "X")
        except ValueError as e:
            # Verificar que se levanta la excepción esperada
            self.assertEqual(str(e), "El tipo de etiqueta no es válido")



    ### Test de query de relaciones entre usuarios  +++ Caso positivo: obtener todas las relaciones entre usuarios
    def test_get_relationships_between_users_positive(self):
        # Creamos dos usuarios de prueba
        self.user_owner = FlatterUser.objects.create_user(username='user_login', email='user_login@example.com', password='password')
        self.user_exmate = FlatterUser.objects.create_user(username='user_valued', email='user_valued@example.com', password='password')

        # Creamos una propiedad y asignamos a ambos usuarios como compañeros de piso
        provincia = Province.objects.create(name='Provincia de prueba', code=12345)
        municipality = Municipality.objects.create(name='Municipio de prueba', province=provincia , code=12345)

        self.property = Property.objects.create(title='Propiedad de prueba', owner=self.user_owner, price=1000, dimensions=100, 
            bedrooms_number=1, bathrooms_number=1, municipality=municipality, province=provincia)
        self.property.flatmates.add(self.user1)
        self.property.flatmates.add(self.user2)

        # Dos usuarios son compañeros de piso
        # Añadimos el rol de RENTER a los usuarios 1 y 2
        renter_role = Role.objects.get(role="RENTER")
        self.user1.roles.add(renter_role)
        self.user2.roles.add(renter_role)
        result_mates = SocialQueries.resolve_get_relationships_between_users(None, None, self.user2.username, self.user1.username)
        self.assertEqual(result_mates, ['Compañero'])

        # Dos usuarios son amigos o excompañeros de piso
        result_friend = SocialQueries.resolve_get_relationships_between_users(None, None, self.user1.username, self.user_exmate.username)
        self.assertEqual(result_friend, ['Amigo', 'Excompañero'])

        # Dos usuarios son inquilino y propietario
        # Añadimos el rol de OWNER al owner de la propiedad
        owner_role = Role.objects.get(role="OWNER")
        self.user_owner.roles.add(owner_role)
        result_owner = SocialQueries.resolve_get_relationships_between_users(None, None, self.user_owner.username, self.user1.username)
        self.assertEqual(result_owner, ['Propietario'])

        # Dos usuarios son inquilino y propietario
        result_renter = SocialQueries.resolve_get_relationships_between_users(None, None, self.user1.username, self.user_owner.username)
        self.assertEqual(result_renter, ['Inquilino'])


    ### Test de query de relaciones entre usuarios  --- Caso negativo: obtener todas las relaciones entre el mismo usuario
    def test_get_relationships_between_users_negative(self):
        # Creamos dos usuarios de prueba
        try:
            SocialQueries.resolve_get_relationships_between_users(None, None, self.user1.username, self.user1.username)
        except Exception as e:
            self.assertEqual(str(e), 'No puedes tener una relación contigo mismo')

    ### Test de query de usuarios recomendar  +++ Caso positivo: obtener todos los usuarios recomendados
    def test_get_recommended_users_returns_correct_data(self):
        # Crear usuarios y roles
        renter_role = Role.objects.get(role="RENTER")
        renter_user = FlatterUser.objects.create(username="renter_user", email="renter_user@example.com")
        renter_user.roles.add(renter_role)

        renter_user2 = FlatterUser.objects.create(username="renter_user2", email="renter_user2@example.com")
        renter_user2.roles.add(renter_role)

        recommendable_user = FlatterUser.objects.create(username="recommendable_user", email="recommendable_user@example.com")
        recommendable_user.roles.add(renter_role)

        result =  SocialQueries.resolve_get_users_recommendations(None, None, "renter_user")
        self.assertIn(recommendable_user, result)
        self.assertNotIn(renter_user, result)
        self.assertIn(renter_user2, result)

        # Borrar los usuarios creados
        renter_role.delete()
        renter_user.delete()
        renter_user2.delete()
        recommendable_user.delete()


    
    ### Test de query de usuarios recomendar --- Caso negativo: obtener todos los usuarios recomendados con un usuario no existente
    def test_get_recommended_users_returns_with_non_existent_user(self):
        try:
            SocialQueries.resolve_get_users_recommendations(None, None, "non_existent_user")
        except Exception as e:
            self.assertEqual(str(e), 'El usuario no existe')


    
    ### Test de query de usuarios recomendar --- Caso negativo: obtener todos los usuarios recomendados cuando no hay usuarios para recomendar
    def test_get_recommended_users_returns_with_no_users_to_recommend(self):
        try:
            SocialQueries.resolve_get_users_recommendations(None, None, "test_user")
        except Exception as e:
            self.assertEqual(str(e), 'No hay usuarios para recomendar')



    ### Test de query de lenguaje inapropiado  +++ Caso positivo: obtener todos los lenguajes inapropiados
    def test_get_inappropriate_languages_returns_correct_data(self):
        InappropiateLanguage.objects.create(word="Spanish")
        InappropiateLanguage.objects.create(word="Italian")
        
        # Llamar a la consulta con el nombre de usuario válido
        result = SocialQueries.resolve_get_inappropiate_language(None, None, self.user1.username)
        
        # Verificar que se devuelven los lenguajes inapropiados
        self.assertEqual(len(result), 2)
        self.assertIn("Spanish", [r.word for r in result])
        self.assertIn("Italian", [r.word for r in result])


    ### Test de query de lenguaje inapropiado --- Caso negativo: obtener todos los lenguajes inapropiados con un usuario no existente
    def test_resolve_get_inappropiate_language_raises_error_for_invalid_user(self):
        try:
            SocialQueries.resolve_get_inappropiate_language(None, None, "no_user")
        except Exception as e:
            self.assertEqual(str(e), "El usuario no es válido")


