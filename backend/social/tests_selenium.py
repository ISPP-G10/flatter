import logging
from django.test import TestCase
from social.models import Group, Message, InappropiateLanguage
from authentication.models import FlatterUser
import time
from selenium import webdriver
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from django.contrib.staticfiles.testing import StaticLiveServerTestCase

logging.disable(logging.CRITICAL)

# Create your tests here.

class SeleniumTestCase(StaticLiveServerTestCase):
    def setUp(self):
        super().setUp()
        options = webdriver.ChromeOptions()
        self.browser = webdriver.Chrome(options=options)
        self.browser.implicitly_wait(5)
        self.browser.get('http://localhost:3000')

        flatteruser = FlatterUser(username='user_test', password='password_test', email='email@test.com', first_name='first_name_test', last_name='last_name_test', is_active=True, is_staff=False, is_superuser=False)
        flatteruser.save()

        inquilinoUser = FlatterUser(username='user_test_inquilino', password='password_test', email='inquilinoemail@test.com', first_name='Inquilino', last_name='Prueba', is_active=True, is_staff=False, is_superuser=False)
        inquilinoUser.save()

        #Registro de usuario propietario
        if not FlatterUser.objects.filter(username='user_test').exists():
            self.browser.find_element(By.XPATH, "//button[contains(.,'Registrarme')]").click()
            self.browser.find_element(By.ID, "first_name").send_keys("first_name_test")
            self.browser.find_element(By.ID, "last_name").send_keys("last_name_test")
            self.browser.find_element(By.ID, "username").send_keys("user_test")
            self.browser.find_element(By.ID, "email").send_keys("email@test.com")
            self.browser.find_element(By.ID, "password").send_keys("password_test")
            self.browser.find_element(By.ID, "passwordConfirm").send_keys("password_test")
            self.browser.find_element(By.ID, "passwordConfirm").send_keys(Keys.ENTER)
            time.sleep(3)
            self.browser.get('http://localhost:3000/me')
            self.browser.find_element(By.XPATH, "//button[contains(.,'Cerrar sesión')]").click()
            time.sleep(3)

        #Registro de usuario no propietario
        if not FlatterUser.objects.filter(username='user_test_inquilino').exists():
            self.browser.find_element(By.XPATH, "//button[contains(.,'Registrarme')]").click()
            self.browser.find_element(By.ID, "first_name").send_keys("Inquilino")
            self.browser.find_element(By.ID, "last_name").send_keys("Prueba")
            self.browser.find_element(By.ID, "username").send_keys("user_test_inquilino")
            self.browser.find_element(By.ID, "email").send_keys("inquilinoemail@test.com")
            self.browser.find_element(By.ID, "password").send_keys("password_test")
            self.browser.find_element(By.ID, "passwordConfirm").send_keys("password_test")
            self.browser.find_element(By.ID, "passwordConfirm").send_keys(Keys.ENTER)
            time.sleep(3)
            self.browser.get('http://localhost:3000/me')
            self.browser.find_element(By.XPATH, "//button[contains(.,'Cerrar sesión')]").click()
            time.sleep(3)


    def tearDown(self):
        self.browser.quit()

        # Borramos el usuario de prueba
        FlatterUser.objects.get(username='user_test').delete()
        FlatterUser.objects.get(username='user_test_inquilino').delete()


    def test_register(self):
       pass


    # Test de login
    def test_login(self):
        self.browser.get('http://localhost:3000')
        time.sleep(3)
        self.browser.find_element(By.XPATH, "//button[contains(.,'Acceder')]").click()

        self.browser.find_element(By.ID, "username").send_keys("user_test")
        self.browser.find_element(By.ID, "password").send_keys("password_test")
        self.browser.find_element(By.ID, "password").send_keys(Keys.ENTER)
        time.sleep(3)
        # Ir a perfil en la url: http://localhost:3000/me
        self.browser.get('http://localhost:3000/me')
        self.browser.find_element(By.XPATH, "//h4[contains(.,'Cerrar sesión')]").click()
        time.sleep(3)
    

    # Test de edición de perfil	privado
    def test_edit_private_profile(self):
        self.browser.get('http://localhost:3000')
        time.sleep(3)
        self.browser.find_element(By.XPATH, "//button[contains(.,'Acceder')]").click()

        self.browser.find_element(By.ID, "username").send_keys("user_test")
        self.browser.find_element(By.ID, "password").send_keys("password_test")
        self.browser.find_element(By.ID, "password").send_keys(Keys.ENTER)
        time.sleep(3)
        # Ir a perfil en la url: http://localhost:3000/me
        self.browser.get('http://localhost:3000/me')
        self.browser.find_element(By.ID, "firstName").clear()
        self.browser.find_element(By.ID, "firstName").send_keys("Mrs")
        self.browser.find_element(By.ID, "lastName").clear()
        self.browser.find_element(By.ID, "lastName").send_keys("Propietaria")
        self.browser.find_element(By.ID, "phoneNumber").clear()
        self.browser.find_element(By.ID, "phoneNumber").send_keys("666666666")
        self.browser.find_element(By.ID, "phoneNumber").send_keys(Keys.ENTER)
        time.sleep(5)

        # Comprobamos que se ha editado correctamente
        self.browser.get('http://localhost:3000/me')
        self.assertEqual(self.browser.find_element(By.ID, "firstName").get_attribute('value'), "Mrs")

    
    # Test de edición de perfil	público
    def test_edit_public_profile(self):
        self.browser.get('http://localhost:3000')
        time.sleep(3)

        #Login
        self.browser.find_element(By.XPATH, "//button[contains(.,'Acceder')]").click()
        self.browser.find_element(By.ID, "username").send_keys("user_test")
        self.browser.find_element(By.ID, "password").send_keys("password_test")
        self.browser.find_element(By.ID, "password").send_keys(Keys.ENTER)
        time.sleep(2)

        # Ir a perfil en la url: http://localhost:3000/me
        self.browser.get('http://localhost:3000/me')
        self.browser.find_element(By.XPATH, "//h4[contains(.,'Mi perfil público')]").click()
        self.browser.find_element(By.XPATH, "//button[@title='Edita tu perfil']").click()
        time.sleep(3)
        self.browser.find_element(By.ID, "firstName").clear()
        self.browser.find_element(By.ID, "firstName").send_keys("Mrs")
        self.browser.find_element(By.ID, "lastName").clear()
        self.browser.find_element(By.ID, "lastName").send_keys("Propietaria")
        self.browser.find_element(By.ID, "lastName").send_keys(Keys.ENTER)
        time.sleep(5)

        # Comprobamos que se ha editado correctamente
        self.browser.get('http://localhost:3000/me')
        self.assertEqual(self.browser.find_element(By.ID, "firstName").get_attribute('value'), "Mrs")

    '''
    # Test de chats
    def test_chat(self):
        # Primero nos logueamos con el usuario inquilino
        self.browser.get('http://localhost:3000')
        time.sleep(3)
        self.browser.find_element(By.XPATH, "//button[contains(.,'Acceder')]").click()
        self.browser.find_element(By.ID, "username").send_keys("user_test_inquilino")
        self.browser.find_element(By.ID, "password").send_keys("password_test")
        self.browser.find_element(By.ID, "password").send_keys(Keys.ENTER)
        time.sleep(2)

        # Adquirimos el plan avanzado para crear chats
        

        # Buscamos usuarios para chatear
        self.browser.find_element(By.XPATH, "//a[contains(.,'Buscador de usuarios')]").click()


        #self.browser.find_element(By.XPATH, "//h4[contains(.,'Cerrar sesión')]").click()
        time.sleep(3)

    '''





