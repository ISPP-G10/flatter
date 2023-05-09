import json
import logging
import time

from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.db import IntegrityError
from django.db.utils import DataError
from django.test import TestCase
from selenium import webdriver
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from .models import FlatterUser, Tag
from backend.schema import schema
from graphene_django.utils.testing import GraphQLTestCase

logging.disable(logging.CRITICAL)


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
            genre='H',
            flatter_coins=0,
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
            genre='H',
            flatter_coins=0,
        )

        try:
            user2 = FlatterUser.objects.create_user(
                username="Hola",
                password="1234",
                email="asd2@asd.asd",
                first_name="C",
                last_name="D",
                genre='M',
                flatter_coins=0,
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
            genre='H',
            flatter_coins=0,
        )

        try:
            user2 = FlatterUser.objects.create_user(
                username="Hola2",
                password="1234",
                email="asd1@asd.asd",
                first_name="C",
                last_name="D",
                genre='M',
                flatter_coins=0,
            )
            self.fail("Se esperaba un error por duplicación de email.")
        except IntegrityError:
            pass

    def test_invalid_phoneNumber(self):

        try:
            user = FlatterUser.objects.create_user(
                username="Hola",
                password="1234",
                phone_number="123456789000",
                email="asd@asd.asd",
                first_name="A",
                last_name="B",
                genre='H',
                flatter_coins=0,
            )

            self.fail("Se esperaba un error por número de teléfono inválido.")
        except DataError:
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
                genre='HHH',
                flatter_coins=0,
            )
            self.fail("Se esperaba un error por género inválido.")
        except DataError:
            pass


class DefaultTests(GraphQLTestCase):

    def setUp(self):
        self.GRAPHQL_URL = '/api/graphql/'


# Tests de queries
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
                getRoles(userToken: "") {
                    id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors


# Tests de mutations
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
        self.assertEqual(content['errors'][0]['message'], "Los apellidos deben tener entre 3 y 50 caracteres")

    def test_mutation_invalid_email(self):
        response = self.query('''
             mutation test{
                createUser(
                    email: "eecom"
                    firstName: "Prueba"
                    lastName: "Pruebaaa"
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
                              )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "El email no es válido")

    def test_mutation_invalid_genre(self):
        response = self.query('''
             mutation test{
                createUser(
                    email: "e@e.com"
                    firstName: "Prueba"
                    lastName: "Pruebaaa"
                    username: "usuario"
                    password: "contraseña"
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


class SeleniumTests(StaticLiveServerTestCase):

    def setUp(self):
        super().setUp()

        options = webdriver.ChromeOptions()

        # full window
        options.add_argument("--start-maximized")

        self.driver = webdriver.Chrome(options=options)
        self.driver.delete_all_cookies()

        user = FlatterUser()
        user.username = "username_test"
        user.password = "contraseña"
        user.email = "test@e.com"
        user.first_name = "Prueba"
        user.last_name = "Pruebaaa"

        self.user1 = user

        user2 = FlatterUser()
        user2.username = "username_test2"
        user2.password = "contraseña"
        user2.email = "test2@e.com"
        user2.first_name = "Prueba"
        user2.last_name = "Pruebesita"

        self.user2 = user2


        try:
            user22 = FlatterUser.objects.get(username=self.user2.username)
            user22.delete()
        except FlatterUser.DoesNotExist:
            pass



        try:
            user = FlatterUser.objects.get(username=self.user1.username)

        except FlatterUser.DoesNotExist:
            user = None

        if user:
            user.delete()




    def tearDown(self) -> None:
        super().tearDown()

        self.driver.quit()

        try:
            user = FlatterUser.objects.get(username=self.user1.username)

        except FlatterUser.DoesNotExist:
            user = None

        if user:
            user.delete()

        try:
            user = FlatterUser.objects.get(username=self.user2.username)
        except FlatterUser.DoesNotExist:
            user = None

        if user:
            user.delete()

    def test_simple_test(self):

        self.driver.get(f'http://localhost:3000/')
        button = self.driver.find_element(By.XPATH, "//button[contains(.,'Registrarme')]")
        assert button.is_displayed()
        button.click()

        self.driver.implicitly_wait(10)

        firstname = self.driver.find_element(By.XPATH, "//div[@id='first_name_form']/input")
        firstname.send_keys(self.user1.first_name)


        lastname = self.driver.find_element(By.XPATH, "//div[@id='last_name_form']/input")
        lastname.send_keys(self.user1.last_name)

        username = self.driver.find_element(By.XPATH, "//div[@id='username_form']/input")
        username.send_keys(self.user1.username)

        email = self.driver.find_element(By.XPATH, "//div[@id='email_form']/input")
        email.send_keys(self.user1.email)

        password = self.driver.find_element(By.XPATH, "//div[@id='password_form']/input")
        password.send_keys(self.user1.password)

        password = self.driver.find_element(By.XPATH, "//div[@id='passwordConfirm_form']/input")
        password.send_keys(self.user1.password)
        password.send_keys(Keys.ENTER)

        time.sleep(5)

        assert self.driver.current_url == f'http://localhost:3000/'

        username = self.driver.find_element(By.ID, "wrapped-name")
        assert username.text == self.user1.username

    def test_simple_login(self):

        self.driver.get(f'http://localhost:3000')
        button = self.driver.find_element(By.XPATH, "//button[contains(.,'Registrarme')]")
        assert button.is_displayed()
        button.click()

        firstname = self.driver.find_element(By.XPATH, "//div[@id='first_name_form']/input")
        firstname.send_keys(self.user2.first_name)

        lastname = self.driver.find_element(By.XPATH, "//div[@id='last_name_form']/input")
        lastname.send_keys(self.user2.last_name)

        username = self.driver.find_element(By.XPATH, "//div[@id='username_form']/input")
        username.send_keys(self.user2.username)

        email = self.driver.find_element(By.XPATH, "//div[@id='email_form']/input")
        email.send_keys(self.user2.email)

        password = self.driver.find_element(By.XPATH, "//div[@id='password_form']/input")
        password.send_keys(self.user2.password)

        password = self.driver.find_element(By.XPATH, "//div[@id='passwordConfirm_form']/input")
        password.send_keys(self.user2.password)

        time.sleep(5)

        password.send_keys(Keys.ENTER)

        assert self.driver.current_url == f'http://localhost:3000/'

        time.sleep(8)

        username = self.driver.find_element(By.ID, "wrapped-name")
        assert username.text == self.user2.username

        self.driver.get(f'http://localhost:3000/me')

        logout = self.driver.find_element(By.XPATH, "/html/body/div[1]/main/div/div/div[2]/div[1]/div[8]")
        logout.click()



        button = self.driver.find_element(By.XPATH, "//button[contains(.,'Acceder')]")
        assert button.is_displayed()
        button.click()

        username = self.driver.find_element(By.XPATH, "//div[@id='username_form']/input")
        username.send_keys(self.user2.username)

        password = self.driver.find_element(By.XPATH, "//div[@id='password_form']/input")
        password.send_keys(self.user2.password)



        button = self.driver.find_element(By.XPATH, "//div[@id='root']/main/div[2]/div/div/div/div/button")
        button.click()

        time.sleep(10)

        # Reload page

        self.driver.get(f'http://localhost:3000')

        # button.click()
        # self.driver.execute_script("arguments[0].click();", button)

        assert self.driver.current_url == f'http://localhost:3000/'

        username = self.driver.find_element(By.ID, "wrapped-name")
        assert username.text == self.user2.username



