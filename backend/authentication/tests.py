import json
from django.db import IntegrityError
from django.test import TestCase
from .models import FlatterUser, Tag
from backend.schema import schema
from graphene_django.utils.testing import GraphQLTestCase

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
        
    '''def test_invalid_phoneNumber(self):
        
        try:                    
            user = FlatterUser.objects.create_user(
                                username="Hola", 
                                password="1234", 
                                phone_number="123456789",
                                email="asd@asd.asd", 
                                first_name="A", 
                                last_name="B", 
                                genre = 'H',
                                flatter_coins = 0,
                            )
        
            self.fail("Se esperaba un error por número de teléfono inválido.")
        except IntegrityError:
            pass
    
         
    def test_invalid_genre(self):
        
        try:                    
            user = FlatterUser.objects.create_user(
                                username="Hola", 
                                password="1234", 
                                phone_number="123456789",
                                email="asd@asd.asd", 
                                first_name="A", 
                                last_name="B", 
                                genre = 'HHH',
                                flatter_coins = 0,
                            )
        
            self.fail("Se esperaba un error por género inválido.")
        except IntegrityError:
            pass    '''
            

        


class DefaultTests(GraphQLTestCase):

    def setUp(self):
        self.GRAPHQL_URL = '/api/graphql/'
        
#Tests de queries
class TestsQueries(DefaultTests):
    def setUp(self):
        super().setUp()
        
   
    def test_resolve_get_user_by_username(self):
        self.quser = '''
            mutation testUser{
                createUser(
                    email: "e@e.com"
                    firstName: "Prueba"
                    lastName: "Pruebesita"
                    username: "usuario"
                    password: "contraseña"
                    genre: "Hombre"
                    roles: "Owner"
                ){
                    user{
                        username
                        id
                    }
                }
            }
        '''
        schema.execute(self.quser)
        query = '''
            query test{
                getUserByUsername(username: "usuario") {
                    username
                    id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors 
    
    def test_resolve_get_roles(self):
        query = '''
            query test{
                getRoles {
                    id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors


#Tests de mutations
class TestsMutations(DefaultTests):

    def setUp(self):
        super().setUp()
        
    def test_mutation_create_user(self):
        response = self.query('''
            mutation test{
                createUser(
                    email: "e@e.com"
                    firstName: "Prueba"
                    lastName: "Pruebaaa"
                    username: "usuario"
                    password: "contraseña"
                    phone: "123456789"
                    genre: "Hombre"
                    roles: "Owner"
                ){
                    user{
                        username
                        id
                    }
                }
        }
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseNoErrors(response)    
            
    def test_mutation_invalid_username(self):
        response = self.query('''
             mutation test{
                createUser(
                    email: "e@e.com"
                    firstName: "Prueba"
                    lastName: "Pruebaaa"
                    username: "usu"
                    password: "contraseña"
                    phone: "123456789"
                    genre: "Hombre"
                    roles: "Owner"
                ){
                    user{
                        username
                        id
                    }
                }
        }
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "El usuario debe tener entre 6 y 24 caracteres")
        
    def test_mutation_invalid_password(self):
        response = self.query('''
             mutation test{
                createUser(
                    email: "e@e.com"
                    firstName: "Prueba"
                    lastName: "Pruebaaa"
                    username: "usuario"
                    password: "mal"
                    phone: "123456789"
                    genre: "Hombre"
                    roles: "Owner"
                ){
                    user{
                        username
                        id
                    }
                }
        }
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "La contraseña debe tener al menos 6 caracteres")
        
    def test_mutation_invalid_firstName(self):
        response = self.query('''
             mutation test{
                createUser(
                    email: "e@e.com"
                    firstName: "oh"
                    lastName: "Pruebaaa"
                    username: "usuario"
                    password: "contraseña"
                    phone: "123456789"
                    genre: "Hombre"
                    roles: "Owner"
                ){
                    user{
                        username
                        id
                    }
                }
        }
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "El nombre debe tener entre 3 y 50 caracteres")
    
    

    def test_mutation_invalid_lastName(self):
        response = self.query('''
             mutation test{
                createUser(
                    email: "e@e.com"
                    firstName: "Prueba"
                    lastName: "Pr"
                    username: "usuario"
                    password: "contraseña"
                    phone: "123456789"
                    genre: "Hombre"
                    roles: "Owner"
                ){
                    user{
                        username
                        id
                    }
                }
        }
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'],"Los apellidos deben tener entre 3 y 50 caracteres")

    def test_mutation_invalid_email(self):
        response = self.query('''
             mutation test{
                createUser(
                    email: "eecom"
                    firstName: "Prueba"
                    lastName: "Pruebaaa"
                    username: "usuario"
                    password: "contraseña"
                    phone: "123456789"
                    genre: "Hombre"
                    roles: "Owner"
                ){
                    user{
                        username
                        id
                    }
                }
        }
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'],"El email no es válido")

    def test_mutation_invalid_genre(self):
        response = self.query('''
             mutation test{
                createUser(
                    email: "e@e.com"
                    firstName: "Prueba"
                    lastName: "Pruebaaa"
                    username: "usuario"
                    password: "contraseña"
                    phone: "123456789"
                    genre: "Xxxx"
                    roles: "Owner"
                ){
                    user{
                        username
                        id
                    }
                }
        }
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "El género no es válido")
    
        
    def test_mutation_add_tag_to_user(self):
        response = self.query('''
            mutation test{
                addTagToUser(id: 1, tag: "P"){
    					user{
                            username
                            id
                            tags{
                                id
                                name
                            }
                    }
                }  
            }
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        
   




  
                
        